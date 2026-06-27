// Manages the game screen's background: a catalog of preset gradients plus
// one slot for a custom device photo, with serial unlocking via coins or
// by reaching certain player levels.
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';
import 'difficulty_config.dart';
import 'progress_manager.dart';

// গেম স্ক্রিনের background — কিছু আগে থেকে বানানো gradient, আর একটা স্লট নিজের ফোনের ছবি দিয়ে customize করার জন্য
/// Describes a single selectable background: either a preset gradient or
/// the special custom-photo slot, with its unlock cost/conditions.
class MazeBackgroundOption {
  final String id;
  final List<Color> colors;
  final int cost;
  final bool isLight; // light theme হলে true — dark এর সাথে combo দেখানোর জন্য
  final bool isCustomPhoto; // true হলে device থেকে বাছা ছবি — কয়েন লাগে না, কিন্তু আগে ছবি বাছতে হবে
  final int? unlockLevel; // এই level এ পৌঁছালে কয়েন না লাগিয়েই আনলক হয়ে যায়

  const MazeBackgroundOption({
    required this.id,
    required this.colors,
    required this.cost,
    this.isLight = false,
    this.isCustomPhoto = false,
    this.unlockLevel,
  });
}

/// Manages the catalog of background options, their serial unlock order,
/// purchasing with coins, free unlocks by player level, and the custom
/// photo background slot. State is persisted via SharedPreferences.
class MazeBackgroundManager {
  // SharedPreferences key storing the list of unlocked background ids.
  static const _unlockedKey = 'mazebloom_unlocked_bg';
  // SharedPreferences key storing the currently selected background id.
  static const _selectedKey = 'mazebloom_selected_bg';
  // SharedPreferences key storing the filesystem path of the custom photo.
  static const _customPathKey = 'mazebloom_custom_bg_path';
  static const String defaultId = 'default';
  static const String customId = 'custom_photo';

  // dark আর light থিম পালাক্রমে রাখা হয়েছে — সবগুলোই একরকম dark থাকার অভিযোগ ঠিক করার জন্য।
  // serial unlock: এক একটা আগের option আনলক না করলে পরেরটা কেনা যায় না, আর দাম ক্রমান্বয়ে বাড়ে।
  // প্রতিটার একটা বিকল্প unlockLevel ও আছে — কয়েন না খরচ করেও সেই level এ পৌঁছালে ফ্রি আনলক হয়ে যায়।
  static const List<MazeBackgroundOption> options = [
    MazeBackgroundOption(id: defaultId, colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)], cost: 0),
    // football-field অনুপ্রাণিত হালকা সবুজ মাঠ — ব্যবহারকারীর পছন্দ হয়েছিল
    MazeBackgroundOption(
      id: 'meadow',
      colors: [Color(0xFFA5D6A7), Color(0xFF66BB6A), Color(0xFF388E3C)],
      cost: 40,
      isLight: true,
      unlockLevel: 3,
    ),
    MazeBackgroundOption(
      id: 'aurora',
      colors: [Color(0xFF1B2A4A), Color(0xFF2E5C4A), Color(0xFF4A1B5C)],
      cost: 80,
      unlockLevel: 6,
    ),
    // হালকা আকাশী-সাদা — আকাশের থিম
    MazeBackgroundOption(
      id: 'sky',
      colors: [Color(0xFFE1F5FE), Color(0xFF81D4FA), Color(0xFF4FC3F7)],
      cost: 160,
      isLight: true,
      unlockLevel: 9,
    ),
    MazeBackgroundOption(
      id: 'ember',
      colors: [Color(0xFF3A1414), Color(0xFF5C2E1B), Color(0xFF1A0E0E)],
      cost: 320,
      unlockLevel: 12,
    ),
    // হালকা বালু/মরুভূমি টোন
    MazeBackgroundOption(
      id: 'sand',
      colors: [Color(0xFFFFF3E0), Color(0xFFFFCC80), Color(0xFFFFA726)],
      cost: 640,
      isLight: true,
      unlockLevel: 15,
    ),
    MazeBackgroundOption(
      id: 'lagoon',
      colors: [Color(0xFF0E2A3A), Color(0xFF14525C), Color(0xFF0A1A2E)],
      cost: 1280,
      unlockLevel: 18,
    ),
    MazeBackgroundOption(id: customId, colors: [Color(0xFF1A1A2E), Color(0xFF16213E)], cost: 0, isCustomPhoto: true),
  ];

  /// Looks up a background option by id, falling back to the first option
  /// (default background) if the id isn't found.
  static MazeBackgroundOption optionFor(String id) =>
      options.firstWhere((o) => o.id == id, orElse: () => options.first);

  // serial order — default আর custom বাদে বাকিগুলো ক্রমানুসারে আনলক করতে হয়
  /// The subset of options that must be unlocked in sequence (excludes the
  /// always-free default and the separately-handled custom photo slot).
  static List<MazeBackgroundOption> get _serialOptions =>
      options.where((o) => o.id != defaultId && !o.isCustomPhoto).toList();

  // আগের সব serial option আনলক হয়ে থাকলেই এটা কেনা/আনলক করা যাবে
  /// Returns whether [id] can be purchased right now: true if it's the
  /// first item in the serial sequence, or if the option immediately
  /// preceding it in the sequence has already been unlocked.
  static bool isPurchasable(String id, Set<String> unlockedIds) {
    final serial = _serialOptions;
    final index = serial.indexWhere((o) => o.id == id);
    if (index <= 0) return true; // প্রথমটা সবসময় কেনা যায়
    return unlockedIds.contains(serial[index - 1].id);
  }

  // সর্বোচ্চ level (যেকোনো difficulty এর মধ্যে) দিয়ে level-ভিত্তিক ফ্রি আনলক চেক করা হয়
  /// Computes the player's highest unlocked level across all difficulties,
  /// used to determine which backgrounds should be freely unlocked by
  /// progression rather than purchased with coins.
  static Future<int> _highestUnlockedLevel() async {
    final counts = await Future.wait(
      Difficulty.values.map((d) => ProgressManager.getUnlockedCount(d)),
    );
    return counts.reduce((a, b) => a > b ? a : b);
  }

  // level দিয়ে যেগুলো ফ্রি আনলক হওয়ার কথা সেগুলো unlocked set এ যুক্ত করে দেয়
  /// Adds any background ids that should now be free-unlocked (because the
  /// player's highest level meets or exceeds their unlockLevel) to the
  /// unlocked set, persisting the change if anything was newly added.
  static Future<Set<String>> _applyLevelUnlocks(SharedPreferences prefs, Set<String> unlocked) async {
    final highest = await _highestUnlockedLevel();
    var changed = false;
    for (final o in options) {
      if (o.unlockLevel != null && highest >= o.unlockLevel! && !unlocked.contains(o.id)) {
        unlocked.add(o.id);
        changed = true;
      }
    }
    if (changed) await prefs.setStringList(_unlockedKey, unlocked.toList());
    return unlocked;
  }

  /// Returns the set of unlocked background ids, always including
  /// [defaultId], after applying any newly-earned level-based free unlocks.
  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = (prefs.getStringList(_unlockedKey) ?? [defaultId]).toSet()..add(defaultId);
    return _applyLevelUnlocks(prefs, unlocked);
  }

  /// Returns the currently selected background id, defaulting to [defaultId].
  static Future<String> getSelectedId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_selectedKey) ?? defaultId;
  }

  /// Persists the given background id as the currently selected background.
  static Future<void> select(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_selectedKey, id);
  }

  /// Returns the filesystem path of the saved custom photo background,
  /// or null if the player hasn't picked one yet.
  static Future<String?> getCustomPhotoPath() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_customPathKey);
  }

  /// Saves the path of a device photo chosen as the custom background,
  /// unlocks the custom-photo option, and selects it immediately.
  static Future<void> setCustomPhotoPath(String path) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_customPathKey, path);
    final unlocked = await getUnlockedIds();
    unlocked.add(customId);
    await prefs.setStringList(_unlockedKey, unlocked.toList());
    await select(customId);
  }

  /// Attempts to purchase (or, if already unlocked, simply select) the
  /// given background id using coins. The custom-photo option can't be
  /// purchased this way (only via [setCustomPhotoPath]), and a background
  /// can't be bought until its predecessor in the serial sequence is
  /// unlocked. Returns true on success.
  static Future<bool> purchase(String id) async {
    final option = optionFor(id);
    if (option.isCustomPhoto) return false; // এটা ছবি বাছার মাধ্যমেই আনলক হয়

    final unlocked = await getUnlockedIds();
    if (unlocked.contains(id)) {
      await select(id);
      return true;
    }
    if (!isPurchasable(id, unlocked)) return false; // আগের serial option আগে আনলক করতে হবে

    final spent = await CoinManager.spendCoins(option.cost);
    if (!spent) return false;

    final prefs = await SharedPreferences.getInstance();
    unlocked.add(id);
    await prefs.setStringList(_unlockedKey, unlocked.toList());
    await select(id);
    return true;
  }
}
