// Manages the player's in-game coin currency balance, persisted locally via
// SharedPreferences, used to purchase cosmetics like cell skins/path colors.
import 'package:shared_preferences/shared_preferences.dart';

// Coin system — phone এ coins সেভ করে রাখে
/// Static manager for the player's coin balance, stored locally on-device
/// (no server sync). New users start with a free coin grant.
class CoinManager {
  // SharedPreferences key storing the current coin balance.
  static const String _key = 'mazebloom_coins';
  static const int _startingCoins = 30; // নতুন user পাবে 30 free coins

  /// Returns the current coin balance. On first run (key not yet set),
  /// initializes and persists the starting coin grant.
  static Future<int> getCoins() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey(_key)) {
      await prefs.setInt(_key, _startingCoins);
      return _startingCoins;
    }
    return prefs.getInt(_key) ?? _startingCoins;
  }

  /// Adds [amount] coins to the balance (e.g. from rewards) and returns the
  /// new total.
  static Future<int> addCoins(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? _startingCoins;
    final newTotal = current + amount;
    await prefs.setInt(_key, newTotal);
    return newTotal;
  }

  // Coins খরচ করো — যথেষ্ট থাকলে true, না থাকলে false
  /// Attempts to deduct [amount] coins. Returns false without modifying the
  /// balance if funds are insufficient; otherwise deducts and returns true.
  static Future<bool> spendCoins(int amount) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_key) ?? _startingCoins;
    if (current < amount) return false;
    await prefs.setInt(_key, current - amount);
    return true;
  }
}
