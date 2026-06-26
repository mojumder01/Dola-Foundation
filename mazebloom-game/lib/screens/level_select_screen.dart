import 'package:flutter/material.dart';
import '../utils/difficulty_config.dart';
import '../utils/progress_manager.dart';
import '../utils/shape_factory.dart';
import 'game_screen.dart';

// একটা difficulty এর সব level এর grid — lock/unlock অবস্থা দেখায়
class LevelSelectScreen extends StatefulWidget {
  final Difficulty difficulty;

  const LevelSelectScreen({super.key, required this.difficulty});

  @override
  State<LevelSelectScreen> createState() => _LevelSelectScreenState();
}

class _LevelSelectScreenState extends State<LevelSelectScreen> {
  int _unlockedCount = 1;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final unlocked = await ProgressManager.getUnlockedCount(widget.difficulty);
    setState(() {
      _unlockedCount = unlocked;
      _loading = false;
    });
  }

  void _openLevel(int levelIndex) {
    final cells = DifficultyConfig.cellsForLevel(widget.difficulty, levelIndex);
    final seed = DifficultyConfig.seedForLevel(widget.difficulty, levelIndex);
    final style = switch (widget.difficulty) {
      Difficulty.easy => ShapeStyle.blob,
      Difficulty.medium => ShapeStyle.snake,
      Difficulty.hard => ShapeStyle.branchy,
    };
    final shape = ShapeFactory.generate(targetCells: cells, seed: seed, style: style);

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
          ),
        ),
        child: SafeArea(
          child: Column(
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
                            onTap: unlocked ? () => _openLevel(index) : null,
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
        ),
      ),
    );
  }
}
