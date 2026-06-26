import 'package:shared_preferences/shared_preferences.dart';

// Gems — coins এর চেয়ে দুর্লভ দ্বিতীয় currency, achievement unlock করলে পাওয়া যায়
class GemManager {
  static const _key = 'mazebloom_gems';

  static Future<int> getGems() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_key) ?? 0;
  }

  static Future<void> addGems(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? 0;
    await prefs.setInt(_key, current + amount);
  }

  static Future<bool> spendGems(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? 0;
    if (current < amount) return false;
    await prefs.setInt(_key, current - amount);
    return true;
  }
}
