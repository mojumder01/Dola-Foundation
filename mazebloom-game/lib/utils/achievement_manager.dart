import 'package:shared_preferences/shared_preferences.dart';

class Achievement {
  final String id;
  final String title;
  final String emoji;
  final String description;

  const Achievement({
    required this.id,
    required this.title,
    required this.emoji,
    required this.description,
  });
}

// খেলার মধ্যে unlock করা যায় এমন badge গুলো — মোসাইক গ্যালারিতে দেখানো হয়
class AchievementManager {
  static const List<Achievement> all = [
    Achievement(
      id: 'first_bloom',
      title: 'প্রথম ফুল',
      emoji: '🌸',
      description: 'তোমার প্রথম শেপ সমাধান করেছো',
    ),
    Achievement(
      id: 'speed_bloom',
      title: 'বাজ গতি',
      emoji: '⚡',
      description: '১০ সেকেন্ডের মধ্যে একটা শেপ শেষ করেছো',
    ),
    Achievement(
      id: 'perfect_bloom',
      title: 'নির্ভুল হাত',
      emoji: '✨',
      description: 'একবারও আটকে না গিয়ে শেপ সমাধান করেছো',
    ),
    Achievement(
      id: 'streak_master',
      title: 'স্ট্রিক মাস্টার',
      emoji: '🔥',
      description: '৭ দিন ধরে পরপর Daily Challenge সমাধান করেছো',
    ),
    Achievement(
      id: 'culture_explorer',
      title: 'সংস্কৃতি অভিযাত্রী',
      emoji: '🇧🇩',
      description: 'সংস্কৃতির যাত্রার সব অধ্যায় শেষ করেছো',
    ),
    Achievement(
      id: 'unlimited_legend',
      title: 'অসীমের বীর',
      emoji: '🏆',
      description: 'Unlimited mode এ একটানা ১০টা শেপ সমাধান করেছো',
    ),
  ];

  static String get _key => 'mazebloom_unlocked_achievements';

  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_key) ?? []).toSet();
  }

  // নতুন unlock হলে true রিটার্ন করে — UI তে celebration দেখানোর জন্য কাজে লাগবে
  static Future<bool> unlock(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = (prefs.getStringList(_key) ?? []).toSet();
    if (unlocked.contains(id)) return false;
    unlocked.add(id);
    await prefs.setStringList(_key, unlocked.toList());
    return true;
  }
}
