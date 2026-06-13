import 'package:shared_preferences/shared_preferences.dart';
import 'question_generator.dart';

// High score phone এ save ও load করার কাজ করে
class ScoreManager {
  // SharedPreferences এ কোন key তে score রাখবো
  // প্রতিটা difficulty এর আলাদা key
  static const _keyEasy = 'high_score_easy';
  static const _keyMedium = 'high_score_medium';
  static const _keyHard = 'high_score_hard';

  // Difficulty দিলে সেই key ফেরত দাও
  static String _keyFor(Difficulty difficulty) {
    switch (difficulty) {
      case Difficulty.easy:
        return _keyEasy;
      case Difficulty.medium:
        return _keyMedium;
      case Difficulty.hard:
        return _keyHard;
    }
  }

  // Phone এ সেভ করা high score পড়ো
  static Future<int> getHighScore(Difficulty difficulty) async {
    final prefs = await SharedPreferences.getInstance();
    // কোনো score না থাকলে 0 দাও
    return prefs.getInt(_keyFor(difficulty)) ?? 0;
  }

  // নতুন score আগের record এর চেয়ে বেশি হলে সেভ করো
  // Returns true যদি নতুন high score হয়
  static Future<bool> saveIfHighScore(
    Difficulty difficulty,
    int newScore,
  ) async {
    final prefs = await SharedPreferences.getInstance();
    final key = _keyFor(difficulty);
    final old = prefs.getInt(key) ?? 0;

    if (newScore > old) {
      await prefs.setInt(key, newScore);
      return true; // নতুন record!
    }

    return false; // আগেরটাই বেশি
  }
}
