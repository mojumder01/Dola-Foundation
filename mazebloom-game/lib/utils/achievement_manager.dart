// Defines the catalog of in-game achievements (bilingual titles/descriptions)
// and persists which ones the player has unlocked via SharedPreferences.
import 'package:shared_preferences/shared_preferences.dart';
import 'app_language.dart';

/// Immutable definition of a single achievement, with both Bengali (default)
/// and English text so the UI can localize via [tr]/[displayTitle]/[displayDescription].
class Achievement {
  // Stable identifier used as the SharedPreferences storage key/value.
  final String id;
  final String title;
  final String titleEn;
  final String emoji;
  final String description;
  final String descriptionEn;

  const Achievement({
    required this.id,
    required this.title,
    required this.titleEn,
    required this.emoji,
    required this.description,
    required this.descriptionEn,
  });

  /// Title text localized to the app's current language.
  String get displayTitle => tr(title, titleEn);
  /// Description text localized to the app's current language.
  String get displayDescription => tr(description, descriptionEn);
}

// খেলার মধ্যে unlock করা যায় এমন badge গুলো — মোসাইক গ্যালারিতে দেখানো হয়
/// Static manager for the achievement catalog and unlock state. Achievements
/// unlocked here are surfaced as badges in the mosaic gallery UI.
class AchievementManager {
  // Full catalog of achievements available in the game and the
  // condition each one represents (unlock thresholds are enforced by
  // callers elsewhere in the app, e.g. on level completion or streak checks).
  static const List<Achievement> all = [
    Achievement(
      id: 'first_bloom',
      title: 'প্রথম ফুল',
      titleEn: 'First Bloom',
      emoji: '🌸',
      description: 'তোমার প্রথম শেপ সমাধান করেছো',
      descriptionEn: 'Solved your first shape',
    ),
    Achievement(
      id: 'speed_bloom',
      title: 'বাজ গতি',
      titleEn: 'Lightning Speed',
      emoji: '⚡',
      description: '১০ সেকেন্ডের মধ্যে একটা শেপ শেষ করেছো',
      descriptionEn: 'Finished a shape within 10 seconds',
    ),
    Achievement(
      id: 'perfect_bloom',
      title: 'নির্ভুল হাত',
      titleEn: 'Flawless Hand',
      emoji: '✨',
      description: 'একবারও আটকে না গিয়ে শেপ সমাধান করেছো',
      descriptionEn: 'Solved a shape without getting stuck once',
    ),
    Achievement(
      id: 'streak_master',
      title: 'স্ট্রিক মাস্টার',
      titleEn: 'Streak Master',
      emoji: '🔥',
      description: '৭ দিন ধরে পরপর Daily Challenge সমাধান করেছো',
      descriptionEn: 'Solved the Daily Challenge for 7 days in a row',
    ),
    Achievement(
      id: 'culture_explorer',
      title: 'সংস্কৃতি অভিযাত্রী',
      titleEn: 'Culture Explorer',
      emoji: '🇧🇩',
      description: 'সংস্কৃতির যাত্রার সব অধ্যায় শেষ করেছো',
      descriptionEn: 'Finished every chapter of the Culture Journey',
    ),
    Achievement(
      id: 'unlimited_legend',
      title: 'অসীমের বীর',
      titleEn: 'Endless Legend',
      emoji: '🏆',
      description: 'Unlimited mode এ একটানা ১০টা শেপ সমাধান করেছো',
      descriptionEn: 'Solved 10 shapes in a row in Unlimited mode',
    ),
  ];

  // SharedPreferences key storing the list of unlocked achievement IDs.
  static String get _key => 'mazebloom_unlocked_achievements';

  /// Returns the set of achievement IDs the player has unlocked so far.
  static Future<Set<String>> getUnlockedIds() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_key) ?? []).toSet();
  }

  // নতুন unlock হলে true রিটার্ন করে — UI তে celebration দেখানোর জন্য কাজে লাগবে
  /// Marks achievement [id] as unlocked and persists it. Returns true only
  /// if this is a newly-unlocked achievement (false if already unlocked),
  /// so the caller can decide whether to show a celebration/notification.
  static Future<bool> unlock(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = (prefs.getStringList(_key) ?? []).toSet();
    if (unlocked.contains(id)) return false;
    unlocked.add(id);
    await prefs.setStringList(_key, unlocked.toList());
    return true;
  }
}
