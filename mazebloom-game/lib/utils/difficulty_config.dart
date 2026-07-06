// Centralizes difficulty-related configuration: labels, emoji, and the
// formulas that scale maze size and seed per difficulty and level index.
import 'package:flutter/material.dart';
import 'app_language.dart';
import 'shape_factory.dart';

// তিনটা difficulty — প্রতিটার level অনুযায়ী shape এর cell সংখ্যা বাড়ে
/// The three selectable difficulty tiers; each scales maze size differently
/// across levels (see DifficultyConfig.cellsForLevel).
enum Difficulty { easy, medium, hard }

/// Provides display metadata (label/emoji) and level-scaling formulas
/// (maze size, seed) for each Difficulty tier.
class DifficultyConfig {
  // আগে ১৫টা তে capped ছিল — এখন endless, প্রতি difficulty তেই অসীম level
  // (UI তে একসাথে কতগুলো দেখানো হবে তার জন্য নিচের bufferAhead ব্যবহার হয়)
  // Number of upcoming levels to pre-render/show in the level-select UI,
  // since levels are now endless rather than capped at a fixed count.
  static const int bufferAhead = 30;

  /// Returns the localized display label (Bangla/English) for a difficulty.
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

  /// Returns the emoji icon representing a difficulty tier.
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

  // আগে তিনটা difficulty বাটনেই একই purple-blue color ছিল, easy/medium/hard
  // আলাদা করা যেত না — এখন প্রতিটার নিজের রঙ (সবুজ=সহজ, কমলা=মাঝারি, লাল=কঠিন)
  /// Returns the gradient colors representing a difficulty tier's button on
  /// the home screen (green=easy, amber/orange=medium, red=hard), so the
  /// three difficulty buttons are visually distinct instead of identical.
  static List<Color> colors(Difficulty d) {
    switch (d) {
      case Difficulty.easy:
        return const [Color(0xFF66BB6A), Color(0xFF2E7D32)];
      case Difficulty.medium:
        return const [Color(0xFFFFA726), Color(0xFFEF6C00)];
      case Difficulty.hard:
        return const [Color(0xFFEF5350), Color(0xFFB71C1C)];
    }
  }

  // Level index (0-based) থেকে কতগুলো cell এর shape বানাতে হবে তা হিসাব করে
  // (একটা cap দেওয়া আছে — না হলে levels যত এগোয়, shape তত বড় হতে হতে maze
  // generation/Hamiltonian-path খোঁজা ভীষণ ধীর হয়ে যায় আর গেম freeze/lag করে)
  /// Computes maze size (cell count) for a difficulty + level index:
  /// `base + levelIndex * step`, clamped to a per-difficulty cap. The cap
  /// exists because very large shapes make maze generation / Hamiltonian
  /// path search extremely slow, which would freeze or lag the game.
  static int cellsForLevel(Difficulty d, int levelIndex) {
    // Starting cell count at level 0 for each tier
    final base = switch (d) {
      Difficulty.easy => 8,
      Difficulty.medium => 16,
      Difficulty.hard => 26,
    };
    // Cell-count growth per additional level
    final step = switch (d) {
      Difficulty.easy => 1,
      Difficulty.medium => 2,
      Difficulty.hard => 3,
    };
    // Maximum cell count allowed for this tier, to bound generation cost
    final cap = switch (d) {
      Difficulty.easy => 40,
      Difficulty.medium => 55,
      Difficulty.hard => 70,
    };
    return (base + (levelIndex * step)).clamp(base, cap);
  }

  // প্রতি difficulty + level এর জন্য একটা unique deterministic seed
  /// Derives a unique, deterministic seed per difficulty + level so the
  /// same maze is generated for that combination on every device.
  static int seedForLevel(Difficulty d, int levelIndex) {
    return d.index * 10000 + levelIndex;
  }

  // আগে প্রতি difficulty মাত্র ২টা style এর মধ্যে alternate করতো, তাই এক-লেভেল
  // পরপরই একই রকম shape ফিরে আসতো আর maze গুলো একঘেয়ে/একই রকম লাগতো। এখন প্রতি
  // difficulty তেই ৫টা style ই ঘুরিয়ে-ফিরিয়ে আসে (শুধু difficulty অনুযায়ী ভিন্ন
  // ক্রমে শুরু হয়) — ফলে পরপর ৫টা level সবসময় আলাদা ধরনের দেখায়, আর seed ও প্রতি
  // level এ বদলায় বলে একই style এর দুটো level-ও আলাদা shape পায়।
  /// Returns the shape style for a difficulty + level index by cycling
  /// through all five styles (in a difficulty-appropriate order), so five
  /// consecutive levels are always visually distinct families instead of
  /// alternating between only two. Combined with the per-level [seedForLevel],
  /// even two levels that land on the same style get different shapes.
  static ShapeStyle styleForLevel(Difficulty d, int levelIndex) {
    final styles = switch (d) {
      Difficulty.easy =>
        const [ShapeStyle.blob, ShapeStyle.spiral, ShapeStyle.snake, ShapeStyle.cross, ShapeStyle.branchy],
      Difficulty.medium =>
        const [ShapeStyle.snake, ShapeStyle.cross, ShapeStyle.spiral, ShapeStyle.branchy, ShapeStyle.blob],
      Difficulty.hard =>
        const [ShapeStyle.branchy, ShapeStyle.spiral, ShapeStyle.cross, ShapeStyle.snake, ShapeStyle.blob],
    };
    return styles[levelIndex % styles.length];
  }
}
