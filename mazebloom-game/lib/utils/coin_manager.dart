import 'package:shared_preferences/shared_preferences.dart';

// Coin system — phone এ coins সেভ করে রাখে
class CoinManager {
  static const String _key = 'mazebloom_coins';
  static const int _startingCoins = 30; // নতুন user পাবে 30 free coins

  static Future<int> getCoins() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey(_key)) {
      await prefs.setInt(_key, _startingCoins);
      return _startingCoins;
    }
    return prefs.getInt(_key) ?? _startingCoins;
  }

  static Future<int> addCoins(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? _startingCoins;
    final newTotal = current + amount;
    await prefs.setInt(_key, newTotal);
    return newTotal;
  }

  // Coins খরচ করো — যথেষ্ট থাকলে true, না থাকলে false
  static Future<bool> spendCoins(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? _startingCoins;
    if (current < amount) return false;
    await prefs.setInt(_key, current - amount);
    return true;
  }
}
