import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';

// গেম স্ক্রিনের background — কিছু আগে থেকে বানানো gradient, আর একটা স্লট নিজের ফোনের ছবি দিয়ে customize করার জন্য
class MazeBackgroundOption {
  final String id;
  final List<Color> colors;
  final int cost;
  final bool isCustomPhoto; // true হলে device থেকে বাছা ছবি — কয়েন লাগে না, কিন্তু আগে ছবি বাছতে হবে

  const MazeBackgroundOption({
    required this.id,
    required this.colors,
    required this.cost,
    this.isCustomPhoto = false,
  });
}

class MazeBackgroundManager {
  static const _unlockedKey = 'mazebloom_unlocked_bg';
  static const _selectedKey = 'mazebloom_selected_bg';
  static const _customPathKey = 'mazebloom_custom_bg_path';
  static const String defaultId = 'default';
  static const String customId = 'custom_photo';

  static const List<MazeBackgroundOption> options = [
    MazeBackgroundOption(id: defaultId, colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)], cost: 0),
    MazeBackgroundOption(id: 'aurora', colors: [Color(0xFF1B2A4A), Color(0xFF2E5C4A), Color(0xFF4A1B5C)], cost: 30),
    MazeBackgroundOption(id: 'ember', colors: [Color(0xFF3A1414), Color(0xFF5C2E1B), Color(0xFF1A0E0E)], cost: 30),
    MazeBackgroundOption(id: 'lagoon', colors: [Color(0xFF0E2A3A), Color(0xFF14525C), Color(0xFF0A1A2E)], cost: 30),
    MazeBackgroundOption(id: customId, colors: [Color(0xFF1A1A2E), Color(0xFF16213E)], cost: 0, isCustomPhoto: true),
  ];

  static MazeBackgroundOption optionFor(String id) =>
      options.firstWhere((o) => o.id == id, orElse: () => options.first);

  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_unlockedKey) ?? [defaultId]).toSet()..add(defaultId);
  }

  static Future<String> getSelectedId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_selectedKey) ?? defaultId;
  }

  static Future<void> select(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_selectedKey, id);
  }

  static Future<String?> getCustomPhotoPath() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_customPathKey);
  }

  static Future<void> setCustomPhotoPath(String path) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_customPathKey, path);
    final unlocked = await getUnlockedIds();
    unlocked.add(customId);
    await prefs.setStringList(_unlockedKey, unlocked.toList());
    await select(customId);
  }

  static Future<bool> purchase(String id) async {
    final option = optionFor(id);
    if (option.isCustomPhoto) return false; // এটা ছবি বাছার মাধ্যমেই আনলক হয়

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
