// Screen that displays the level grid for a chosen Difficulty (easy/medium/hard)
// in classic (non-story) mode, showing locked/unlocked state for each level.
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../utils/difficulty_config.dart';
import '../utils/progress_manager.dart';
import '../utils/shape_factory.dart';
import '../utils/app_language.dart';
import 'game_screen.dart';
import '../widgets/app_background.dart';

// একটা difficulty এর সব level এর grid — lock/unlock অবস্থা দেখায়
/// Stateful widget that renders the level-selection grid for [difficulty].
/// Delegates all state (unlock progress, loading/opening flags) to
/// [_LevelSelectScreenState].
class LevelSelectScreen extends StatefulWidget {
  final Difficulty difficulty;

  const LevelSelectScreen({super.key, required this.difficulty});

  @override
  State<LevelSelectScreen> createState() => _LevelSelectScreenState();
}

/// Holds the unlocked-level count for [LevelSelectScreen.difficulty] and
/// drives maze generation when a level tile is tapped.
class _LevelSelectScreenState extends State<LevelSelectScreen> {
  int _unlockedCount = 1;
  bool _loading = true;
  bool _opening = false; // shape generate হওয়ার সময় একই tile-এ একাধিকবার tap আটকাতে

  @override
  void initState() {
    super.initState();
    _load();
  }

  /// Loads the number of unlocked levels for this difficulty from
  /// persistent storage and refreshes the UI.
  Future<void> _load() async {
    final unlocked = await ProgressManager.getUnlockedCount(widget.difficulty);
    setState(() {
      _unlockedCount = unlocked;
      _loading = false;
    });
  }

  /// Generates the maze shape for [levelIndex] and navigates to [GameScreen].
  /// Guards against double-taps via [_opening], and refreshes unlock state
  /// (via [_load]) once the player returns from the game.
  Future<void> _openLevel(int levelIndex) async {
    if (_opening) return;
    setState(() => _opening = true);

    final cells = DifficultyConfig.cellsForLevel(widget.difficulty, levelIndex);
    final seed = DifficultyConfig.seedForLevel(widget.difficulty, levelIndex);
    final style = DifficultyConfig.styleForLevel(widget.difficulty, levelIndex);
    // Hard difficulty এর বড় shape এ Hamiltonian-path backtracking অনেকক্ষণ লাগতে
    // পারে — compute() দিয়ে background isolate এ চালানো হয় যাতে UI thread না
    // আটকায় এবং Android ANR/force-close না হয়
    final shape = await compute(
      generateShapeInBackground,
      ShapeGenRequest(targetCells: cells, seed: seed, style: style),
    );

    if (!mounted) return;
    setState(() => _opening = false);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(
          shape: shape,
          mode: GameMode.level,
          difficulty: widget.difficulty,
          levelIndex: levelIndex,
        ),
      ),
    ).then((_) => _load()); // ফিরে এসে unlock state রিফ্রেশ করো
  }

  /// Builds the back button, difficulty header, level grid, and a loading
  /// overlay shown while a maze shape is being generated.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
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
                    Text(
                      '${DifficultyConfig.emoji(widget.difficulty)} ${DifficultyConfig.label(widget.difficulty)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
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
                        // endless — unlocked levels + একটা buffer of আসন্ন (locked) level দেখানো হয়,
                        // unlock হতে থাকলে এই সংখ্যাও বাড়তে থাকে — কখনো শেষ হয় না
                        itemCount: _unlockedCount + DifficultyConfig.bufferAhead,
                        itemBuilder: (context, index) {
                          final unlocked = index < _unlockedCount;
                          return GestureDetector(
                            onTap: unlocked && !_opening ? () => _openLevel(index) : null,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: unlocked
                                    ? const LinearGradient(
                                        colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)],
                                      )
                                    : null,
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
