// Manages the "daily challenge" feature: generates a deterministic maze shape
// for the current day (optionally festival-themed) and tracks completion/streaks.
import 'package:shared_preferences/shared_preferences.dart';
import '../models/grid_shape.dart';
import 'shape_factory.dart';
import 'culture_theme.dart';

// প্রতিদিন একটা fixed shape — তারিখ থেকে seed বানানো হয় বলে সবার phone এ একই shape আসে
/// Handles generation of the daily challenge maze (same shape for every
/// player on a given date) plus completion tracking and streak counting.
class DailyChallengeManager {
  static const _completedKey = 'mazebloom_daily_completed_date';

  /// Builds a deterministic seed from the calendar date so every device
  /// generates the same daily shape on the same day.
  static int _seedForDate(DateTime date) {
    return date.year * 10000 + date.month * 100 + date.day;
  }

  static String _dateKey(DateTime date) =>
      '${date.year}-${date.month}-${date.day}';

  // আজ কোনো উৎসব থাকলে সেই থিম দেওয়া হয় — না থাকলে null (সাধারণ daily challenge)
  /// Returns today's festival theme if today is a recognized festival date,
  /// otherwise null (meaning the regular/non-themed daily challenge applies).
  static CultureTheme? todaysFestivalTheme() {
    return FestivalCalendar.themeForDate(DateTime.now());
  }

  /// Produces today's maze shape: festival-themed (fixed size/seed from the
  /// theme) when a festival is active, otherwise a date-seeded shape with a
  /// slightly varying size so each regular day still feels distinct.
  static GridShape todaysShape() {
    final now = DateTime.now();
    final festival = todaysFestivalTheme();
    if (festival != null) {
      // উৎসবের দিনে থিমের seed/size দিয়ে শেপ বানানো হয় — তাও deterministic, সবার জন্য একই
      return ShapeFactory.generate(
        targetCells: festival.targetCells,
        seed: festival.seed,
        style: festival.styleForLevel(now.day),
      );
    }
    final seed = _seedForDate(now);
    // দিনের cell সংখ্যা একটু ঘোরাফেরা করে যাতে প্রতিদিন আলাদা অনুভূতি হয়
    final targetCells = 14 + (seed % 12);
    // shape style ও দিনভেদে ঘোরে — না হলে daily challenge সবসময় একই ধরনের blob দেখাতো
    const styleCycle = [ShapeStyle.blob, ShapeStyle.snake, ShapeStyle.cross, ShapeStyle.spiral, ShapeStyle.branchy];
    final style = styleCycle[now.day % styleCycle.length];
    return ShapeFactory.generate(targetCells: targetCells, seed: seed, style: style);
  }

  /// Checks whether the player has already completed today's challenge,
  /// based on the locally stored last-completed date.
  static Future<bool> isCompletedToday() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_completedKey);
    return saved == _dateKey(DateTime.now());
  }

  /// Records today's challenge as completed and updates the streak: the
  /// streak increments only if yesterday was also completed (consecutive
  /// days), otherwise it resets to 1 since the chain was broken.
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
  /// Returns the player's current consecutive-day completion streak.
  static Future<int> getStreak() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('mazebloom_daily_streak') ?? 0;
  }
}
