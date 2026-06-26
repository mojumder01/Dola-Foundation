import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';

// কয়েন খরচ করে path এর রঙ পরিবর্তন করার ছোট shop — depth/monetization বাড়ানোর জন্য
class PathColorOption {
  final String id;
  final Color color;
  final int cost; // 0 মানে ফ্রি, সবার জন্য আনলকড

  const PathColorOption({required this.id, required this.color, required this.cost});
}

class PathColorManager {
  static const _unlockedKey = 'mazebloom_unlocked_colors';
  static const _selectedKey = 'mazebloom_selected_color';
  static const String defaultId = 'violet';

  static const List<PathColorOption> options = [
    PathColorOption(id: 'violet', color: Color(0xFF7C4DFF), cost: 0),
    PathColorOption(id: 'rose', color: Color(0xFFEC407A), cost: 30),
    PathColorOption(id: 'teal', color: Color(0xFF26A69A), cost: 30),
    PathColorOption(id: 'amber', color: Color(0xFFFFA000), cost: 30),
    PathColorOption(id: 'crimson', color: Color(0xFFE53935), cost: 50),
    PathColorOption(id: 'gold', color: Color(0xFFFFD54F), cost: 80),
  ];

  static PathColorOption optionFor(String id) =>
      options.firstWhere((o) => o.id == id, orElse: () => options.first);

  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_unlockedKey) ?? [defaultId]).toSet()..add(defaultId);
  }

  static Future<String> getSelectedId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_selectedKey) ?? defaultId;
  }

  static Future<Color> getSelectedColor() async {
    return optionFor(await getSelectedId()).color;
  }

  static Future<void> select(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_selectedKey, id);
  }

  // কয়েন থাকলে purchase করে সাথে সাথে select করে দেয় — না থাকলে false
  static Future<bool> purchase(String id) async {
    final option = optionFor(id);
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
}
