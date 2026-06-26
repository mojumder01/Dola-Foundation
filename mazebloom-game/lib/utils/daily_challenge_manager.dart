import 'package:shared_preferences/shared_preferences.dart';
import '../models/grid_shape.dart';
import 'shape_factory.dart';

// প্রতিদিন একটা fixed shape — তারিখ থেকে seed বানানো হয় বলে সবার phone এ একই shape আসে
class DailyChallengeManager {
  static const _completedKey = 'mazebloom_daily_completed_date';

  static int _seedForDate(DateTime date) {
    return date.year * 10000 + date.month * 100 + date.day;
  }

  static String _dateKey(DateTime date) =>
      '${date.year}-${date.month}-${date.day}';

  static GridShape todaysShape() {
    final now = DateTime.now();
    final seed = _seedForDate(now);
    // দিনের cell সংখ্যা একটু ঘোরাফেরা করে যাতে প্রতিদিন আলাদা অনুভূতি হয়
    final targetCells = 14 + (seed % 12);
    return ShapeFactory.generate(targetCells: targetCells, seed: seed);
  }

  static Future<bool> isCompletedToday() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_completedKey);
    return saved == _dateKey(DateTime.now());
  }

  static Future<void> markCompletedToday() async {
    final prefs = await SharedPreferences.getInstance();
    final now = DateTime.now();
    final yesterday = now.subtract(const Duration(days: 1));
    final lastCompleted = prefs.getString(_completedKey);

    // গতকাল না খেললে streak ভেঙে যায়, খেললে continue হয়
    final streakContinues = lastCompleted == _dateKey(yesterday);
    final current = await getStreak();
    await prefs.setInt('mazebloom_daily_streak', streakContinues ? current + 1 : 1);
    await prefs.setString(_completedKey, _dateKey(now));
  }

  // কতদিন ধরে পরপর daily challenge সমাধান করছে — streak system (Part 3/4 এ reward এ ব্যবহার হবে)
  static Future<int> getStreak() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('mazebloom_daily_streak') ?? 0;
  }
}
