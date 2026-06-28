// Provides audio/haptic feedback (tap, win, fail cues) for game
// interactions, with persisted user toggles for sound and vibration.
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

// সাউন্ড (bundled short WAV ক্লিপ — SystemSound Android-এ অনেক ডিভাইসে নিঃশব্দ/অনির্ভরযোগ্য,
// তাই real audio asset ব্যবহার করা হয়) আর ভাইব্রেশন (haptics) — দুটোই আলাদা on/off toggle এর সাথে
/// Plays bundled sound effects and haptic feedback for in-game events (tap,
/// win, fail), respecting independently persisted sound/vibration toggles.
/// Sound effects are short synthesized WAV clips under `assets/sounds/`,
/// played via `audioplayers` (the platform `SystemSound` API this used to
/// rely on is silent/unreliable on many Android devices).
class FeedbackService {
  static const _soundKey = 'mazebloom_sound_on';
  static const _vibrationKey = 'mazebloom_vibration_on';

  // Cached in-memory copy of the sound preference
  static bool _soundOn = true;
  // Cached in-memory copy of the vibration preference
  static bool _vibrationOn = true;

  // One low-latency player per clip, reused across plays so repeated taps
  // don't pay asset-decoding overhead each time. Asset paths passed to
  // setSourceAsset are relative to the default "assets/" cache prefix, so
  // they match the `assets/sounds/` folder declared in pubspec.yaml.
  static final AudioPlayer _tapPlayer = AudioPlayer();
  static final AudioPlayer _winPlayer = AudioPlayer();
  static final AudioPlayer _failPlayer = AudioPlayer();

  static bool get soundOn => _soundOn;
  static bool get vibrationOn => _vibrationOn;

  /// Loads persisted sound/vibration preferences into memory and preloads
  /// the sound effect clips into low-latency players; call once at app
  /// startup before relying on soundOn/vibrationOn or feedback methods.
  static Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _soundOn = prefs.getBool(_soundKey) ?? true;
    _vibrationOn = prefs.getBool(_vibrationKey) ?? true;

    for (final p in [_tapPlayer, _winPlayer, _failPlayer]) {
      await p.setPlayerMode(PlayerMode.lowLatency);
      await p.setReleaseMode(ReleaseMode.stop);
    }
    await _tapPlayer.setSourceAsset('sounds/tap.wav');
    await _winPlayer.setSourceAsset('sounds/win.wav');
    await _failPlayer.setSourceAsset('sounds/fail.wav');
  }

  /// Updates and persists the sound toggle.
  static Future<void> setSoundOn(bool value) async {
    _soundOn = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_soundKey, value);
  }

  /// Updates and persists the vibration toggle.
  static Future<void> setVibrationOn(bool value) async {
    _vibrationOn = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_vibrationKey, value);
  }

  // দ্রুত পরপর drag করার সময় tap() অনেকবার কল হয় — শুধু resume() করলে clip আগের
  // play এখনো চলতে থাকলে নতুন করে আবার শোনা যেত না, তাই প্রতিবার শুরু থেকে
  // seek করে দেওয়া হয় যাতে maze এর প্রতিটা cell এ আঙুল গেলে আলাদা করে শোনা যায়
  /// Light feedback for routine interactions (e.g. selecting/moving a cell).
  /// Seeks the tap clip back to the start before resuming so each cell
  /// visited during a continuous drag produces its own audible tick instead
  /// of being swallowed by an still-playing previous tap. Uses
  /// [HapticFeedback.lightImpact] rather than the much subtler
  /// `selectionClick` so taps are actually felt on most devices.
  static void tap() {
    if (_soundOn) {
      _tapPlayer.seek(Duration.zero);
      _tapPlayer.resume();
    }
    if (_vibrationOn) HapticFeedback.lightImpact();
  }

  /// Feedback played when the player wins/completes a level.
  static void win() {
    if (_soundOn) _winPlayer.resume();
    if (_vibrationOn) HapticFeedback.mediumImpact();
  }

  /// Feedback played on failure (vibration + a short descending tone).
  static void fail() {
    if (_soundOn) _failPlayer.resume();
    if (_vibrationOn) HapticFeedback.heavyImpact();
  }
}
