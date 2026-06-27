// Provides simple audio/haptic feedback (tap, win, fail cues) for game
// interactions, with persisted user toggles for sound and vibration.
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

// সাউন্ড (system click sound, কোনো audio asset লাগে না) আর ভাইব্রেশন (haptics) — দুটোই আলাদা on/off toggle এর সাথে
/// Plays system sound and haptic feedback for in-game events (tap, win,
/// fail), respecting independently persisted sound/vibration toggles.
/// Uses only system sounds/haptics, so no audio asset files are required.
class FeedbackService {
  static const _soundKey = 'mazebloom_sound_on';
  static const _vibrationKey = 'mazebloom_vibration_on';

  // Cached in-memory copy of the sound preference
  static bool _soundOn = true;
  // Cached in-memory copy of the vibration preference
  static bool _vibrationOn = true;

  static bool get soundOn => _soundOn;
  static bool get vibrationOn => _vibrationOn;

  /// Loads persisted sound/vibration preferences into memory; call once at
  /// app startup before relying on soundOn/vibrationOn or feedback methods.
  static Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _soundOn = prefs.getBool(_soundKey) ?? true;
    _vibrationOn = prefs.getBool(_vibrationKey) ?? true;
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

  /// Light feedback for routine interactions (e.g. selecting/moving a cell).
  static void tap() {
    if (_soundOn) SystemSound.play(SystemSoundType.click);
    if (_vibrationOn) HapticFeedback.selectionClick();
  }

  /// Feedback played when the player wins/completes a level.
  static void win() {
    if (_soundOn) SystemSound.play(SystemSoundType.click);
    if (_vibrationOn) HapticFeedback.mediumImpact();
  }

  /// Feedback played on failure (vibration only, no sound).
  static void fail() {
    if (_vibrationOn) HapticFeedback.heavyImpact();
  }
}
