// Tracks the player's free daily hint allowance; hints beyond the free
// quota must be unlocked by watching an ad or spending coins (see callers).
import 'package:shared_preferences/shared_preferences.dart';

// দিনে একটা hint ফ্রি — তারপরের গুলো বিজ্ঞাপন দেখে বা coin খরচ করে পেতে হয়
/// Manages the once-per-day free hint: tracks the last date a free hint
/// was used so it resets automatically at midnight (date comparison only,
/// no explicit timer needed).
class HintManager {
  static const _usedDateKey = 'mazebloom_hint_used_date';
  static const int freeHintsPerDay = 1;
  // Coin price for a hint once the free daily hint is used
  static const int hintCoinCost = 10;

  static String _dateKey(DateTime date) => '${date.year}-${date.month}-${date.day}';

  /// Returns true if the free hint for today has not yet been used —
  /// determined by comparing today's date key to the stored last-used date.
  static Future<bool> hasFreeHintToday() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_usedDateKey);
    return saved != _dateKey(DateTime.now());
  }

  /// Marks today's free hint as used; it becomes available again once the
  /// stored date no longer matches "today" (i.e. after midnight).
  static Future<void> consumeFreeHint() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_usedDateKey, _dateKey(DateTime.now()));
  }
}
