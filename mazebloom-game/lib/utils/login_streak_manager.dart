import 'package:shared_preferences/shared_preferences.dart';

// রোজ অ্যাপ খুললে — শুধু খোলার জন্যই — বাড়তে থাকা coin reward, ৭ দিনের চক্রে
class LoginStreakManager {
  static const _lastClaimKey = 'mazebloom_login_last_claim';
  static const _streakKey = 'mazebloom_login_streak';

  static const List<int> _cycleRewards = [5, 10, 15, 20, 25, 30, 50];

  static String _dateKey(DateTime date) => '${date.year}-${date.month}-${date.day}';

  static int rewardForDay(int dayInCycle) => _cycleRewards[(dayInCycle - 1) % _cycleRewards.length];

  // আজকে এখনো claim করা না হলে streak বাড়িয়ে coin reward রিটার্ন করে, claim করা থাকলে null
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

  static Future<int> getStreak() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_streakKey) ?? 0;
  }
}
