// Tracks player progression: how many levels are unlocked per difficulty,
// plus separate progression tracking for Story/Journey mode chapters/levels.
// All state is persisted in SharedPreferences using per-difficulty/chapter keys.
import 'package:shared_preferences/shared_preferences.dart';
import 'difficulty_config.dart';

// কোন difficulty তে কয়টা level unlock হয়েছে — SharedPreferences এ save থাকে
/// Persists and queries level-unlock progress, both for the standard
/// per-difficulty level lists and for Story/Journey mode's chapters/levels.
class ProgressManager {
  // Builds the SharedPreferences key for a given difficulty's unlock count,
  // e.g. "mazebloom_unlocked_easy".
  static String _key(Difficulty d) => 'mazebloom_unlocked_${d.name}';

  /// Returns how many levels are unlocked for the given difficulty.
  /// Defaults to 1 because the first level is always unlocked.
  static Future<int> getUnlockedCount(Difficulty d) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_key(d)) ?? 1; // প্রথম level সবসময় unlock থাকে
  }

  /// Unlocks the next level after [completedLevelIndex] (0-based) is finished,
  /// for the given difficulty. Only increases the unlocked count — never
  /// decreases it, and there is no upper cap (progression is endless).
  static Future<void> unlockNext(Difficulty d, int completedLevelIndex) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = await getUnlockedCount(d);
    final nextUnlocked = completedLevelIndex + 2; // 0-based completed -> পরের level
    if (nextUnlocked > unlocked) {
      await prefs.setInt(_key(d), nextUnlocked); // endless — কোনো upper cap নেই
    }
  }

  /// Returns whether the given 0-based level index is currently unlocked
  /// for the given difficulty.
  static Future<bool> isUnlocked(Difficulty d, int levelIndex) async {
    final unlocked = await getUnlockedCount(d);
    return levelIndex < unlocked;
  }

  // Story/Journey mode এর chapter unlock — difficulty এর বাইরে আলাদা progression
  // SharedPreferences key tracking how many story chapters are unlocked.
  static const _storyKey = 'mazebloom_unlocked_story';

  /// Returns how many Story mode chapters are unlocked (defaults to 1).
  static Future<int> getUnlockedStoryCount() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_storyKey) ?? 1;
  }

  /// Unlocks the next story chapter after [completedChapterIndex] is
  /// finished, clamped so it never exceeds [totalChapters].
  static Future<void> unlockNextStoryChapter(int completedChapterIndex, int totalChapters) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = await getUnlockedStoryCount();
    final nextUnlocked = completedChapterIndex + 2;
    if (nextUnlocked > unlocked) {
      await prefs.setInt(_storyKey, nextUnlocked.clamp(1, totalChapters));
    }
  }

  // প্রতিটা chapter এর ভেতরে এখন একাধিক level আছে — সেগুলোর unlock state আলাদাভাবে রাখা হয়
  // Builds the per-chapter SharedPreferences key for level-unlock counts.
  static String _storyLevelKey(int chapterIndex) => 'mazebloom_story_level_$chapterIndex';

  /// Returns how many levels are unlocked within the given story chapter
  /// (defaults to 1).
  static Future<int> getUnlockedStoryLevelCount(int chapterIndex) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_storyLevelKey(chapterIndex)) ?? 1;
  }

  /// Unlocks the next level within a story chapter after
  /// [completedLevelIndex] is finished, clamped to [levelsPerChapter].
  static Future<void> unlockNextStoryLevel(int chapterIndex, int completedLevelIndex, int levelsPerChapter) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = await getUnlockedStoryLevelCount(chapterIndex);
    final nextUnlocked = completedLevelIndex + 2;
    if (nextUnlocked > unlocked) {
      await prefs.setInt(_storyLevelKey(chapterIndex), nextUnlocked.clamp(1, levelsPerChapter));
    }
  }

  // Unlimited mode এর streak আগে শুধু in-memory ছিল, app থেকে বের হয়ে আবার ঢুকলে
  // ০ থেকে শুরু হতো — এখন persist করা হয় যাতে session এর মাঝে count মনে থাকে
  static const _unlimitedStreakKey = 'mazebloom_unlimited_streak';

  /// Returns the player's saved Unlimited-mode streak (shapes solved without
  /// losing all lives), so resuming Unlimited mode continues where they left
  /// off instead of restarting from 0.
  static Future<int> getUnlimitedStreak() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_unlimitedStreakKey) ?? 0;
  }

  /// Persists the current Unlimited-mode streak; call after each shape solved
  /// and when the streak resets to 0 (lives exhausted, "Start Over" chosen).
  static Future<void> setUnlimitedStreak(int streak) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_unlimitedStreakKey, streak);
  }
}
