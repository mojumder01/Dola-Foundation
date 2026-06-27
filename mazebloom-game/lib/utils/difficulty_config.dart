import 'app_language.dart';

// তিনটা difficulty — প্রতিটার level অনুযায়ী shape এর cell সংখ্যা বাড়ে
enum Difficulty { easy, medium, hard }

class DifficultyConfig {
  // আগে ১৫টা তে capped ছিল — এখন endless, প্রতি difficulty তেই অসীম level
  // (UI তে একসাথে কতগুলো দেখানো হবে তার জন্য নিচের bufferAhead ব্যবহার হয়)
  static const int bufferAhead = 30;

  static String label(Difficulty d) {
    switch (d) {
      case Difficulty.easy:
        return tr('সহজ', 'Easy');
      case Difficulty.medium:
        return tr('মাঝারি', 'Medium');
      case Difficulty.hard:
        return tr('কঠিন', 'Hard');
    }
  }

  static String emoji(Difficulty d) {
    switch (d) {
      case Difficulty.easy:
        return '🌱';
      case Difficulty.medium:
        return '🌿';
      case Difficulty.hard:
        return '🌳';
    }
  }

  // Level index (0-based) থেকে কতগুলো cell এর shape বানাতে হবে তা হিসাব করে
  // (একটা cap দেওয়া আছে — না হলে levels যত এগোয়, shape তত বড় হতে হতে maze
  // generation/Hamiltonian-path খোঁজা ভীষণ ধীর হয়ে যায় আর গেম freeze/lag করে)
  static int cellsForLevel(Difficulty d, int levelIndex) {
    final base = switch (d) {
      Difficulty.easy => 8,
      Difficulty.medium => 16,
      Difficulty.hard => 26,
    };
    final step = switch (d) {
      Difficulty.easy => 1,
      Difficulty.medium => 2,
      Difficulty.hard => 3,
    };
    final cap = switch (d) {
      Difficulty.easy => 40,
      Difficulty.medium => 55,
      Difficulty.hard => 70,
    };
    return (base + (levelIndex * step)).clamp(base, cap);
  }

  // প্রতি difficulty + level এর জন্য একটা unique deterministic seed
  static int seedForLevel(Difficulty d, int levelIndex) {
    return d.index * 10000 + levelIndex;
  }
}
