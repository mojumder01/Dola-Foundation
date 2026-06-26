import 'package:shared_preferences/shared_preferences.dart';
import 'difficulty_config.dart';

// কোন difficulty তে কয়টা level unlock হয়েছে — SharedPreferences এ save থাকে
class ProgressManager {
  static String _key(Difficulty d) => 'mazebloom_unlocked_${d.name}';

  static Future<int> getUnlockedCount(Difficulty d) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_key(d)) ?? 1; // প্রথম level সবসময় unlock থাকে
  }

  static Future<void> unlockNext(Difficulty d, int completedLevelIndex) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = await getUnlockedCount(d);
    final nextUnlocked = completedLevelIndex + 2; // 0-based completed -> পরের level
    if (nextUnlocked > unlocked) {
      await prefs.setInt(_key(d), nextUnlocked); // endless — কোনো upper cap নেই
    }
  }

  static Future<bool> isUnlocked(Difficulty d, int levelIndex) async {
    final unlocked = await getUnlockedCount(d);
    return levelIndex < unlocked;
  }

  // Story/Journey mode এর chapter unlock — difficulty এর বাইরে আলাদা progression
  static const _storyKey = 'mazebloom_unlocked_story';

  static Future<int> getUnlockedStoryCount() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_storyKey) ?? 1;
  }

  static Future<void> unlockNextStoryChapter(int completedChapterIndex, int totalChapters) async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = await getUnlockedStoryCount();
    final nextUnlocked = completedChapterIndex + 2;
    if (nextUnlocked > unlocked) {
      await prefs.setInt(_storyKey, nextUnlocked.clamp(1, totalChapters));
    }
  }
}
