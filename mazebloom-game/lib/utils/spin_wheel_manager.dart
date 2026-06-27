import 'package:shared_preferences/shared_preferences.dart';

// দিনে সর্বোচ্চ ৩ বার spin — প্রথমটা ফ্রি, পরের ২টা বিজ্ঞাপন দেখে পাওয়া যায়
// This file manages the daily reward-wheel spin allowance and persists the
// spin count/date across app restarts using SharedPreferences.

/// Tracks and limits how many times the player can spin the reward wheel
/// per day (one free spin plus ad-gated extra spins), and exposes the
/// fixed reward values for the wheel segments.
class SpinWheelManager {
  // SharedPreferences key for last spin date
  static const _dateKey = 'mazebloom_spin_date';
  // SharedPreferences key for spins used that day
  static const _countKey = 'mazebloom_spin_count';
  static const int maxSpinsPerDay = 3;
  static const int freeSpinsPerDay = 1;

  // চাকার অংশগুলো — সমান probability, ছোট reward বেশি ঘন ঘন আসুক তার জন্য duplicate রাখা হয়েছে
  // Reward values for each wheel segment (equal probability per index;
  // smaller rewards are duplicated so they appear more frequently overall).
  static const List<int> wheelRewards = [10, 20, 15, 50, 10, 30, 100, 15];

  /// Builds a simple "YYYY-M-D" key representing today's date, used to
  /// detect when the spin counter should reset for a new day.
  static String _todayKey() {
    final now = DateTime.now();
    return '${now.year}-${now.month}-${now.day}';
  }

  /// Returns how many spins have been used today. If the stored date does
  /// not match today's date, the counter is considered reset (returns 0).
  static Future<int> spinsUsedToday() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getString(_dateKey) != _todayKey()) return 0;
    return prefs.getInt(_countKey) ?? 0;
  }

  /// True if the player still has their free daily spin available.
  static Future<bool> hasFreeSpinLeft() async => (await spinsUsedToday()) < freeSpinsPerDay;

  /// True if the player has any spins left today (free or ad-gated).
  static Future<bool> hasAnySpinLeft() async => (await spinsUsedToday()) < maxSpinsPerDay;

  /// Records that a spin was used: stores today's date and increments the
  /// daily spin counter in SharedPreferences.
  static Future<void> recordSpin() async {
    final prefs = await SharedPreferences.getInstance();
    final used = await spinsUsedToday();
    await prefs.setString(_dateKey, _todayKey());
    await prefs.setInt(_countKey, used + 1);
  }

  /// Maps an arbitrary random seed to a valid index into [wheelRewards].
  static int randomRewardIndex(int randomSeed) => randomSeed % wheelRewards.length;
}
