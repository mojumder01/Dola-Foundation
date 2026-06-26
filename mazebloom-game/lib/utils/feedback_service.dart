import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

// সাউন্ড (system click sound, কোনো audio asset লাগে না) আর ভাইব্রেশন (haptics) — দুটোই আলাদা on/off toggle এর সাথে
class FeedbackService {
  static const _soundKey = 'mazebloom_sound_on';
  static const _vibrationKey = 'mazebloom_vibration_on';

  static bool _soundOn = true;
  static bool _vibrationOn = true;

  static bool get soundOn => _soundOn;
  static bool get vibrationOn => _vibrationOn;

  static Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _soundOn = prefs.getBool(_soundKey) ?? true;
    _vibrationOn = prefs.getBool(_vibrationKey) ?? true;
  }

  static Future<void> setSoundOn(bool value) async {
    _soundOn = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_soundKey, value);
  }

  static Future<void> setVibrationOn(bool value) async {
    _vibrationOn = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_vibrationKey, value);
  }

  static void tap() {
    if (_soundOn) SystemSound.play(SystemSoundType.click);
    if (_vibrationOn) HapticFeedback.selectionClick();
  }

  static void win() {
    if (_soundOn) SystemSound.play(SystemSoundType.click);
    if (_vibrationOn) HapticFeedback.mediumImpact();
  }

  static void fail() {
    if (_vibrationOn) HapticFeedback.heavyImpact();
  }
}
