// Implements an in-game shop for changing the maze path's color, either
// with coins or (for premium colors) real-money in-app purchases.
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';

// কয়েন খরচ করে path এর রঙ পরিবর্তন করার ছোট shop — depth/monetization বাড়ানোর জন্য
/// Describes a single purchasable/selectable path color option, including
/// its coin cost and whether it's a premium (IAP-only) color.
class PathColorOption {
  final String id;
  final Color color;
  final int cost; // 0 মানে ফ্রি বা premium (coin দিয়ে কেনা যায় না)
  final bool isPremium; // true হলে coin এ কেনা যায় না — real money (IAP) লাগবে

  const PathColorOption({
    required this.id,
    required this.color,
    required this.cost,
    this.isPremium = false,
  });
}

/// Manages unlocking, selecting, and purchasing path colors, persisting
/// state via SharedPreferences and spending coins through [CoinManager].
class PathColorManager {
  // SharedPreferences key storing the list of unlocked color ids.
  static const _unlockedKey = 'mazebloom_unlocked_colors';
  // SharedPreferences key storing the currently selected color id.
  static const _selectedKey = 'mazebloom_selected_color';
  static const String defaultId = 'violet';
  static const String diamondId = 'diamond'; // premium — IapService এর মাধ্যমে আনলক হয়

  // দামের মধ্যে স্পষ্ট তফাত — হালকা রঙ কম দামি, গাঢ়/সোনালি বেশি দামি, একটা সম্পূর্ণ real-money only
  // Catalog of all available path colors, ordered roughly from cheapest to
  // most expensive, with one premium (real-money only) option.
  static const List<PathColorOption> options = [
    PathColorOption(id: 'violet', color: Color(0xFF7C4DFF), cost: 0),
    PathColorOption(id: 'rose', color: Color(0xFFEC407A), cost: 25),
    PathColorOption(id: 'teal', color: Color(0xFF26A69A), cost: 35),
    PathColorOption(id: 'amber', color: Color(0xFFFFA000), cost: 45),
    PathColorOption(id: 'crimson', color: Color(0xFFE53935), cost: 65),
    PathColorOption(id: 'gold', color: Color(0xFFFFD54F), cost: 95),
    PathColorOption(id: diamondId, color: Color(0xFF00E5FF), cost: 0, isPremium: true),
  ];

  /// Looks up a color option by id, falling back to the first option
  /// (default color) if the id isn't found.
  static PathColorOption optionFor(String id) =>
      options.firstWhere((o) => o.id == id, orElse: () => options.first);

  /// Returns the set of unlocked color ids, always including [defaultId].
  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_unlockedKey) ?? [defaultId]).toSet()..add(defaultId);
  }

  /// Returns the currently selected color id, defaulting to [defaultId].
  static Future<String> getSelectedId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_selectedKey) ?? defaultId;
  }

  /// Returns the actual Color of the currently selected option.
  static Future<Color> getSelectedColor() async {
    return optionFor(await getSelectedId()).color;
  }

  /// Persists the given color id as the currently selected path color.
  static Future<void> select(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_selectedKey, id);
  }

  // কয়েন থাকলে purchase করে সাথে সাথে select করে দেয় — না থাকলে false
  // Premium (real-money only) color এর জন্য false রিটার্ন করে — সেটা IapService এর মাধ্যমে কিনতে হয়
  /// Attempts to purchase (or, if already unlocked, simply select) the
  /// given color id using coins. Premium colors always return false here
  /// since they can only be unlocked via [unlockPremium] after a real-money
  /// IAP purchase. Returns true on success.
  static Future<bool> purchase(String id) async {
    final option = optionFor(id);
    if (option.isPremium) return false;

    final unlocked = await getUnlockedIds();
    if (unlocked.contains(id)) {
      await select(id);
      return true;
    }
    final spent = await CoinManager.spendCoins(option.cost);
    if (!spent) return false;

    final prefs = await SharedPreferences.getInstance();
    unlocked.add(id);
    await prefs.setStringList(_unlockedKey, unlocked.toList());
    await select(id);
    return true;
  }

  // IapService এ real-money purchase সফল হলে এটা কল করো — কয়েন না কেটেই unlock + select করে
  /// Call this after a successful real-money IAP purchase from IapService:
  /// unlocks and selects the given color without spending any coins.
  static Future<void> unlockPremium(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = await getUnlockedIds();
    unlocked.add(id);
    await prefs.setStringList(_unlockedKey, unlocked.toList());
    await select(id);
  }
}
