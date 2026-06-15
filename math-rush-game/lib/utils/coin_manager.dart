import 'package:shared_preferences/shared_preferences.dart';

// Coin system — phone এ coins সেভ করে রাখে
class CoinManager {
  static const String _key = 'math_rush_coins';
  static const int _startingCoins = 50; // নতুন user পাবে 50 free coins

  // বর্তমান coin balance দেখাও
  static Future<int> getCoins() async {
    final prefs = await SharedPreferences.getInstance();
    // প্রথমবার app খুললে 50 coins দিয়ে শুরু করো
    if (!prefs.containsKey(_key)) {
      await prefs.setInt(_key, _startingCoins);
      return _startingCoins;
    }
    return prefs.getInt(_key) ?? _startingCoins;
  }

  // Coins যোগ করো (ad দেখলে বা সঠিক উত্তরে)
  static Future<int> addCoins(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? 0;
    final newTotal = current + amount;
    await prefs.setInt(_key, newTotal);
    return newTotal;
  }

  // Coins খরচ করো — যথেষ্ট থাকলে true, না থাকলে false
  static Future<bool> spendCoins(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? 0;
    if (current < amount) return false; // টাকা নেই
    await prefs.setInt(_key, current - amount);
    return true;
  }
}
