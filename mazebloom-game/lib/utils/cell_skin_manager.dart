import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';

// মাজের cell এর background রঙ পরিবর্তন করার ছোট shop — path color এর সাথে মিলিয়ে আলাদা feel দেয়
class CellSkinOption {
  final String id;
  final Color color;
  final int cost;

  const CellSkinOption({required this.id, required this.color, required this.cost});
}

class CellSkinManager {
  static const _unlockedKey = 'mazebloom_unlocked_skins';
  static const _selectedKey = 'mazebloom_selected_skin';
  static const String defaultId = 'slate';

  static const List<CellSkinOption> options = [
    CellSkinOption(id: defaultId, color: Color(0xFF1E1E3A), cost: 0),
    CellSkinOption(id: 'forest', color: Color(0xFF1B3A2B), cost: 20),
    CellSkinOption(id: 'ocean', color: Color(0xFF1A2E4A), cost: 30),
    CellSkinOption(id: 'plum', color: Color(0xFF3A1E3A), cost: 40),
    CellSkinOption(id: 'sunset', color: Color(0xFF4A2E1A), cost: 55),
  ];

  static CellSkinOption optionFor(String id) =>
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
