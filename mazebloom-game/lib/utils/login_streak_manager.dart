// Manages the daily login-streak reward system: tracks consecutive daily
// app opens and grants an escalating coin reward on a repeating 7-day cycle.
import 'package:shared_preferences/shared_preferences.dart';

// রোজ অ্যাপ খুললে — শুধু খোলার জন্যই — বাড়তে থাকা coin reward, ৭ দিনের চক্রে
/// Tracks and rewards consecutive daily app opens with escalating coin
/// bonuses on a repeating 7-day cycle. Persists state via SharedPreferences.
class LoginStreakManager {
  // Date string (yyyy-M-d) of the last day a reward was claimed.
  static const _lastClaimKey = 'mazebloom_login_last_claim';
  // Current consecutive-day streak count.
  static const _streakKey = 'mazebloom_login_streak';

  // Coin reward for each day of the 7-day cycle (index 0 = day 1, etc.).
  static const List<int> _cycleRewards = [5, 10, 15, 20, 25, 30, 50];

  /// Builds a simple yyyy-M-d string key used to compare calendar days
  /// (ignores time-of-day so the streak resets/advances at midnight).
  static String _dateKey(DateTime date) => '${date.year}-${date.month}-${date.day}';

  /// Returns the coin reward for a given day in the streak cycle, wrapping
  /// around every 7 days (e.g. day 8 reuses day 1's reward).
  static int rewardForDay(int dayInCycle) => _cycleRewards[(dayInCycle - 1) % _cycleRewards.length];

  // আজকে এখনো claim করা না হলে streak বাড়িয়ে coin reward রিটার্ন করে, claim করা থাকলে null
  /// Claims today's login reward if it hasn't been claimed yet.
  /// If the last claim was yesterday, the streak continues (increments);
  /// otherwise (gap of more than one day, or first ever claim) it resets to 1.
  /// Returns null if today's reward was already claimed.
  static Future<({int streak, int coins})?> claimIfDue() async {
    final prefs = await SharedPreferences.getInstance();
    final now = DateTime.now();
    final today = _dateKey(now);
    final lastClaim = prefs.getString(_lastClaimKey);
    if (lastClaim == today) return null;

    final yesterday = _dateKey(now.subtract(const Duration(days: 1)));
    final continuing = lastClaim == yesterday;
    final current = prefs.getInt(_streakKey) ?? 0;
    final nextStreak = continuing ? current + 1 : 1;
    final coins = rewardForDay(nextStreak);

    await prefs.setString(_lastClaimKey, today);
    await prefs.setInt(_streakKey, nextStreak);
    return (streak: nextStreak, coins: coins);
  }

  /// Returns the current persisted streak count (0 if never claimed).
  static Future<int> getStreak() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_streakKey) ?? 0;
  }
}
