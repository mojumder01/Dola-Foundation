import 'package:shared_preferences/shared_preferences.dart';

// দিনে সর্বোচ্চ ৩ বার spin — প্রথমটা ফ্রি, পরের ২টা বিজ্ঞাপন দেখে পাওয়া যায়
class SpinWheelManager {
  static const _dateKey = 'mazebloom_spin_date';
  static const _countKey = 'mazebloom_spin_count';
  static const int maxSpinsPerDay = 3;
  static const int freeSpinsPerDay = 1;

  // চাকার অংশগুলো — সমান probability, ছোট reward বেশি ঘন ঘন আসুক তার জন্য duplicate রাখা হয়েছে
  static const List<int> wheelRewards = [10, 20, 15, 50, 10, 30, 100, 15];

  static String _todayKey() {
    final now = DateTime.now();
    return '${now.year}-${now.month}-${now.day}';
  }

  static Future<int> spinsUsedToday() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getString(_dateKey) != _todayKey()) return 0;
    return prefs.getInt(_countKey) ?? 0;
  }

  static Future<bool> hasFreeSpinLeft() async => (await spinsUsedToday()) < freeSpinsPerDay;

  static Future<bool> hasAnySpinLeft() async => (await spinsUsedToday()) < maxSpinsPerDay;

  static Future<void> recordSpin() async {
    final prefs = await SharedPreferences.getInstance();
    final used = await spinsUsedToday();
    await prefs.setString(_dateKey, _todayKey());
    await prefs.setInt(_countKey, used + 1);
  }

  static int randomRewardIndex(int randomSeed) => randomSeed % wheelRewards.length;
}
