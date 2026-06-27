// Manages the player's gem balance (a rarer secondary currency, typically
// earned via achievements) persisted locally via SharedPreferences.
import 'package:shared_preferences/shared_preferences.dart';

// Gems — coins এর চেয়ে দুর্লভ দ্বিতীয় currency, achievement unlock করলে পাওয়া যায়
/// Stores and mutates the player's gem balance. Gems are a scarcer
/// secondary currency (compared to coins), typically awarded for
/// unlocking achievements.
class GemManager {
  static const _key = 'mazebloom_gems';

  /// Returns the current gem balance (0 if never set).
  static Future<int> getGems() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_key) ?? 0;
  }

  /// Adds the given amount of gems to the balance.
  static Future<void> addGems(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? 0;
    await prefs.setInt(_key, current + amount);
  }

  /// Attempts to deduct the given amount of gems; fails (returns false)
  /// without modifying the balance if funds are insufficient.
  static Future<bool> spendGems(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? 0;
    if (current < amount) return false;
    await prefs.setInt(_key, current - amount);
    return true;
  }
}
