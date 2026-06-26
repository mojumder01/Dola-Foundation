import 'package:shared_preferences/shared_preferences.dart';

// দিনে একটা hint ফ্রি — তারপরের গুলো বিজ্ঞাপন দেখে বা coin খরচ করে পেতে হয়
class HintManager {
  static const _usedDateKey = 'mazebloom_hint_used_date';
  static const int freeHintsPerDay = 1;
  static const int hintCoinCost = 10;

  static String _dateKey(DateTime date) => '${date.year}-${date.month}-${date.day}';

  static Future<bool> hasFreeHintToday() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_usedDateKey);
    return saved != _dateKey(DateTime.now());
  }

  static Future<void> consumeFreeHint() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_usedDateKey, _dateKey(DateTime.now()));
  }
}
