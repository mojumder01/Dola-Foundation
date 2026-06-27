// Implements a small in-game "shop" for maze cell background skins (colors),
// purchasable with in-game coins, with persisted unlock/selection state.
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';

// মাজের cell এর background রঙ পরিবর্তন করার ছোট shop — path color এর সাথে মিলিয়ে আলাদা feel দেয়
/// Describes a single purchasable cell background skin: its identifier,
/// display color, and coin cost to unlock.
class CellSkinOption {
  final String id;
  final Color color;
  final int cost;

  const CellSkinOption({required this.id, required this.color, required this.cost});
}

/// Static manager for cell skin catalog, unlock state, and selection.
/// Unlocking spends coins via [CoinManager]; the default skin is always
/// unlocked and free.
class CellSkinManager {
  // SharedPreferences keys: list of unlocked skin IDs, and the currently selected skin ID.
  static const _unlockedKey = 'mazebloom_unlocked_skins';
  static const _selectedKey = 'mazebloom_selected_skin';
  // Skin that is always available for free and used as the fallback.
  static const String defaultId = 'slate';

  // Catalog of all available skins and their coin costs.
  static const List<CellSkinOption> options = [
    CellSkinOption(id: defaultId, color: Color(0xFF1E1E3A), cost: 0),
    CellSkinOption(id: 'forest', color: Color(0xFF1B3A2B), cost: 20),
    CellSkinOption(id: 'ocean', color: Color(0xFF1A2E4A), cost: 30),
    CellSkinOption(id: 'plum', color: Color(0xFF3A1E3A), cost: 40),
    CellSkinOption(id: 'sunset', color: Color(0xFF4A2E1A), cost: 55),
  ];

  /// Looks up the [CellSkinOption] for [id], falling back to the first
  /// option (the default skin) if the id is unknown.
  static CellSkinOption optionFor(String id) =>
      options.firstWhere((o) => o.id == id, orElse: () => options.first);

  /// Returns the set of skin IDs the player has unlocked, always including
  /// [defaultId] since it's free and never needs to be purchased.
  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_unlockedKey) ?? [defaultId]).toSet()..add(defaultId);
  }

  /// Returns the currently selected skin ID, defaulting to [defaultId].
  static Future<String> getSelectedId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_selectedKey) ?? defaultId;
  }

  /// Convenience accessor returning the color of the currently selected skin.
  static Future<Color> getSelectedColor() async {
    return optionFor(await getSelectedId()).color;
  }

  /// Sets [id] as the active skin without affecting unlock/purchase state.
  static Future<void> select(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_selectedKey, id);
  }

  /// Unlocks and selects skin [id]. If already unlocked, simply selects it
  /// for free. Otherwise attempts to spend coins equal to the skin's cost
  /// via [CoinManager.spendCoins]; if the player has insufficient coins,
  /// the purchase fails and nothing changes. On success, persists the
  /// updated unlocked set and selects the skin.
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
