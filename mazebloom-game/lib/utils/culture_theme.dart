// This file defines cultural theme presets (Bangladeshi culture motifs) used to
// visually skin mazes across Story/Journey mode and festival-based daily challenges.
import 'package:flutter/material.dart';
import 'app_language.dart';
import 'shape_factory.dart';

// বাংলা সংস্কৃতির থিম — গল্প/journey mode এবং উৎসব-ভিত্তিক daily challenge এর জন্য।
// শেপ সবসময় ShapeFactory দিয়ে procedurally generate হয় (তাই solvability guaranteed),
// কিন্তু নাম, রঙ, ইমোজি আর cell-size দিয়ে প্রতিটাকে আলাদা সাংস্কৃতিক রূপ দেওয়া হয়।
// আগে প্রতি chapter এ একটাই fixed maze ছিল ("only one game per section" feedback) —
// এখন প্রতিটা chapter এ অনেকগুলো level আছে, আর style ভিন্ন রাখা হয়েছে যাতে maze design
// আরও বৈচিত্র্যময়/আকর্ষণীয় লাগে।
// English: A cultural theme (e.g. "Bangladesh Rickshaw") used to skin a maze —
// shapes are always procedurally generated via ShapeFactory (so solvability is
// guaranteed); this class only supplies cosmetic data (name, colors, emoji,
// base cell count, seed, shape style) plus per-sub-level scaling helpers.
/// Represents a single cultural theme: localized title/description, emoji,
/// color palette, base maze size/seed, and shape style. Used both for
/// Story/Journey chapters and festival-specific daily challenges.
class CultureTheme {
  final String id;
  final String title;
  final String titleEn;
  final String emoji;
  final String description;
  final String descriptionEn;
  // Gradient/accent colors applied to the maze UI for this theme
  final List<Color> colors;
  // Base maze size (cell count) for level 0 of this theme
  final int targetCells;
  // Base deterministic seed; combined with level index for per-level seeds
  final int seed;
  final ShapeStyle style;

  const CultureTheme({
    required this.id,
    required this.title,
    required this.titleEn,
    required this.emoji,
    required this.description,
    required this.descriptionEn,
    required this.colors,
    required this.targetCells,
    required this.seed,
    this.style = ShapeStyle.blob,
  });

  /// Localized title selected via current app language (Bangla/English).
  String get displayTitle => tr(title, titleEn);
  /// Localized description selected via current app language (Bangla/English).
  String get displayDescription => tr(description, descriptionEn);

  // chapter এর ভেতরের level (0-based) অনুযায়ী cell সংখ্যা বাড়তে থাকে
  /// Computes the maze size (cell count) for a given level within this
  /// theme's chapter — grows linearly (+6 cells per level) so later levels
  /// in the same chapter are progressively larger/harder.
  int cellsForLevel(int levelIndex) => targetCells + levelIndex * 6;

  // আগে chapter এর সব level এ এই একটাই fixed style ব্যবহার হতো, তাই ৫টা level
  // একই রকম দেখাতো — এখন level index অনুযায়ী [style] আর একটা দ্বিতীয় সম্পর্কিত
  // style এর মধ্যে ঘোরে, আর chapter ভেদে cycle এর শুরুর ধাপও আলাদা (seed দিয়ে অফসেট)
  /// Returns the shape style for a level within this chapter, alternating
  /// between this theme's base [style] and a complementary one so the 5
  /// levels in a chapter don't all look like the same maze family. The
  /// starting phase of the alternation is offset by [seed] so different
  /// chapters don't all switch styles on the same level index.
  ShapeStyle styleForLevel(int levelIndex) {
    final complement = switch (style) {
      ShapeStyle.blob => ShapeStyle.spiral,
      ShapeStyle.snake => ShapeStyle.cross,
      ShapeStyle.branchy => ShapeStyle.spiral,
      ShapeStyle.spiral => ShapeStyle.blob,
      ShapeStyle.cross => ShapeStyle.snake,
    };
    return (levelIndex + seed) % 2 == 0 ? style : complement;
  }

  // প্রতিটা sub-level এর জন্য আলাদা deterministic seed
  /// Derives a unique, deterministic seed per sub-level so every player
  /// sees the same maze for a given theme + level combination.
  int seedForLevel(int levelIndex) => seed * 100 + levelIndex;
}

// Story/Journey mode — বাংলাদেশের সংস্কৃতি ঘুরে দেখার একটা ধারাবাহিক যাত্রা
/// Story/Journey mode: an ordered sequence of cultural "chapters" (each a
/// CultureTheme) the player progresses through, each containing multiple levels.
class StoryJourney {
  // প্রতিটা chapter (section) এ এখন একটার বদলে একাধিক maze খেলা যায়
  /// Number of playable levels contained within each chapter.
  static const int levelsPerChapter = 5;

  static const List<CultureTheme> chapters = [
    CultureTheme(
      id: 'rickshaw',
      title: 'ঢাকার রিকশা',
      titleEn: 'Dhaka Rickshaw',
      emoji: '🛺',
      description: 'রঙ-বেরঙের রিকশায় শহর ঘোরার গল্প',
      descriptionEn: 'A ride through the city on colorful rickshaws',
      colors: [Color(0xFFFFC107), Color(0xFFFF8F00)],
      targetCells: 12,
      seed: 501,
      style: ShapeStyle.blob,
    ),
    CultureTheme(
      id: 'shapla',
      title: 'শাপলার বিল',
      titleEn: 'Water Lily Marsh',
      emoji: '🌼',
      description: 'জাতীয় ফুল শাপলায় ভরা গ্রামের বিল',
      descriptionEn: "A village marsh full of the national flower, the water lily",
      colors: [Color(0xFF26C6DA), Color(0xFF00838F)],
      targetCells: 16,
      seed: 502,
      style: ShapeStyle.snake,
    ),
    CultureTheme(
      id: 'ilish',
      title: 'ইলিশের দেশ',
      titleEn: 'Land of Hilsa',
      emoji: '🐟',
      description: 'পদ্মার ইলিশ আর জেলেদের নৌকা',
      descriptionEn: 'Hilsa fish of the Padma and fishermen\'s boats',
      colors: [Color(0xFF42A5F5), Color(0xFF1565C0)],
      targetCells: 20,
      seed: 503,
      style: ShapeStyle.branchy,
    ),
    CultureTheme(
      id: 'boishakh',
      title: 'বৈশাখী মেলা',
      titleEn: 'Boishakhi Fair',
      emoji: '🎉',
      description: 'পহেলা বৈশাখের মঙ্গল শোভাযাত্রা',
      descriptionEn: "Pohela Boishakh's Mangal Shobhajatra procession",
      colors: [Color(0xFFEF5350), Color(0xFFB71C1C)],
      targetCells: 24,
      seed: 504,
      style: ShapeStyle.snake,
    ),
    CultureTheme(
      id: 'nakshi',
      title: 'নকশী কাঁথা',
      titleEn: 'Nakshi Kantha',
      emoji: '🧵',
      description: 'হাতে সেলাই করা ঐতিহ্যবাহী নকশী কাঁথার নকশা',
      descriptionEn: 'Traditional hand-stitched Nakshi Kantha embroidery patterns',
      colors: [Color(0xFFAB47BC), Color(0xFF6A1B9A)],
      targetCells: 28,
      seed: 505,
      style: ShapeStyle.branchy,
    ),
    CultureTheme(
      id: 'shadhinota',
      title: 'বিজয়ের দিন',
      titleEn: 'Victory Day',
      emoji: '🇧🇩',
      description: 'লাল-সবুজ পতাকা আর বিজয়ের গর্ব',
      descriptionEn: 'The red-green flag and the pride of victory',
      colors: [Color(0xFF66BB6A), Color(0xFF2E7D32)],
      targetCells: 32,
      seed: 506,
      style: ShapeStyle.branchy,
    ),
  ];
}

// বছরের নির্দিষ্ট তারিখে বিশেষ উৎসব থিম — daily challenge কে সেদিন এই থিমে সাজানো হয়
/// Maps specific calendar dates (month-day) to a special festival CultureTheme,
/// so the daily challenge is automatically re-skinned on Bangladeshi festival days.
class FestivalCalendar {
  /// Returns the festival theme for the given date, or null if the date is
  /// not a recognized festival (in which case the regular daily challenge applies).
  static CultureTheme? themeForDate(DateTime date) {
    final key = '${date.month}-${date.day}';
    switch (key) {
      case '4-14': // পহেলা বৈশাখ
        return StoryJourney.chapters[3];
      case '3-26': // স্বাধীনতা দিবস
        return StoryJourney.chapters[5];
      case '12-16': // বিজয় দিবস
        return StoryJourney.chapters[5];
      case '2-21': // ভাষা শহীদ দিবস (নকশী কাঁথা থিমে শ্রদ্ধা)
        return StoryJourney.chapters[4];
      default:
        return null;
    }
  }
}
