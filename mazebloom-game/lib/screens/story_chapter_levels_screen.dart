// Story Mode level-select screen for a single chapter: lists the chapter's
// levels with sequential unlock and theme-aware maze generation.
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../utils/app_language.dart';
import '../utils/culture_theme.dart';
import '../utils/progress_manager.dart';
import '../utils/shape_factory.dart';
import 'game_screen.dart';
import '../widgets/app_background.dart';

// একটা chapter এর ভেতরের সব level — আগে chapter এ একটাই maze ছিল,
// এখন এখান থেকে একাধিক maze বেছে খেলা যায় (sequential unlock)
/// Shows the level grid within a single Story Mode chapter (identified by
/// [chapterIndex]), where levels unlock sequentially as the player
/// progresses.
class StoryChapterLevelsScreen extends StatefulWidget {
  final int chapterIndex;

  const StoryChapterLevelsScreen({super.key, required this.chapterIndex});

  @override
  State<StoryChapterLevelsScreen> createState() => _StoryChapterLevelsScreenState();
}

/// Tracks unlocked-level progress for the chapter and generates maze shapes
/// themed to that chapter when a level is opened.
class _StoryChapterLevelsScreenState extends State<StoryChapterLevelsScreen> {
  int _unlockedCount = 1;
  bool _loading = true;
  bool _opening = false;

  // Resolves the CultureTheme (colors, maze style, seeds) for this chapter.
  CultureTheme get _theme => StoryJourney.chapters[widget.chapterIndex];

  @override
  void initState() {
    super.initState();
    _load();
  }

  /// Loads how many levels are unlocked within this chapter.
  Future<void> _load() async {
    final unlocked = await ProgressManager.getUnlockedStoryLevelCount(widget.chapterIndex);
    setState(() {
      _unlockedCount = unlocked;
      _loading = false;
    });
  }

  /// Generates the chapter-themed maze shape for [levelIndex] and pushes
  /// [GameScreen] in story mode. Guards against double taps via [_opening]
  /// and refreshes unlock state on return.
  Future<void> _openLevel(int levelIndex) async {
    if (_opening) return;
    setState(() => _opening = true);

    final theme = _theme;
    final shape = await compute(
      generateShapeInBackground,
      ShapeGenRequest(
        targetCells: theme.cellsForLevel(levelIndex),
        seed: theme.seedForLevel(levelIndex),
        style: theme.styleForLevel(levelIndex),
      ),
    );

    if (!mounted) return;
    setState(() => _opening = false);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(
          shape: shape,
          mode: GameMode.story,
          theme: theme,
          storyChapterIndex: widget.chapterIndex,
          storyLevelIndex: levelIndex,
        ),
      ),
    ).then((_) => _load());
  }

  /// Builds the header (back button, chapter title/emoji, description) and
  /// the level grid styled with the chapter's theme colors, plus a loading
  /// overlay while a maze is being generated.
  @override
  Widget build(BuildContext context) {
    final theme = _theme;
    return Scaffold(
      body: AppBackground(
        gradientColors: theme.colors,
        child: SafeArea(
          child: Stack(
            children: [
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            '${theme.emoji} ${theme.displayTitle}',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                    child: Text(
                      theme.displayDescription,
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                  ),
                  Expanded(
                    child: _loading
                        ? const Center(child: CircularProgressIndicator())
                        : GridView.builder(
                            padding: const EdgeInsets.all(20),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 4,
                              mainAxisSpacing: 14,
                              crossAxisSpacing: 14,
                            ),
                            itemCount: StoryJourney.levelsPerChapter,
                            itemBuilder: (context, index) {
                              final unlocked = index < _unlockedCount;
                              return GestureDetector(
                                onTap: unlocked && !_opening ? () => _openLevel(index) : null,
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: unlocked ? LinearGradient(colors: theme.colors) : null,
                                    color: unlocked ? null : Colors.white.withOpacity(0.06),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Center(
                                    child: unlocked
                                        ? Text(
                                            '${index + 1}',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          )
                                        : const Icon(Icons.lock, color: Colors.white38, size: 18),
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
              if (_opening)
                Positioned.fill(
                  child: Container(
                    color: Colors.black.withOpacity(0.55),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const CircularProgressIndicator(color: Color(0xFF7C4DFF)),
                          const SizedBox(height: 12),
                          Text(
                            tr('মেজ তৈরি হচ্ছে...', 'Building maze...'),
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
