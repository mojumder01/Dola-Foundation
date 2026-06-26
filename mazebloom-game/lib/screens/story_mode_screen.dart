import 'package:flutter/material.dart';
import '../utils/culture_theme.dart';
import '../utils/progress_manager.dart';
import '../utils/shape_factory.dart';
import 'game_screen.dart';

// বাংলাদেশের সংস্কৃতি ঘুরে দেখার journey — chapter ধরে ধরে unlock হয়
class StoryModeScreen extends StatefulWidget {
  const StoryModeScreen({super.key});

  @override
  State<StoryModeScreen> createState() => _StoryModeScreenState();
}

class _StoryModeScreenState extends State<StoryModeScreen> {
  int _unlockedCount = 1;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final unlocked = await ProgressManager.getUnlockedStoryCount();
    setState(() {
      _unlockedCount = unlocked;
      _loading = false;
    });
  }

  void _openChapter(int index) {
    final theme = StoryJourney.chapters[index];
    final shape = ShapeFactory.generate(targetCells: theme.targetCells, seed: theme.seed);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(
          shape: shape,
          mode: GameMode.story,
          theme: theme,
          storyChapterIndex: index,
        ),
      ),
    ).then((_) => _load());
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
                    const Text(
                      '🇧🇩 সংস্কৃতির যাত্রা',
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : ListView.builder(
                        padding: const EdgeInsets.all(20),
                        itemCount: StoryJourney.chapters.length,
                        itemBuilder: (context, index) {
                          final theme = StoryJourney.chapters[index];
                          final unlocked = index < _unlockedCount;
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 14),
                            child: GestureDetector(
                              onTap: unlocked ? () => _openChapter(index) : null,
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  gradient: unlocked ? LinearGradient(colors: theme.colors) : null,
                                  color: unlocked ? null : Colors.white.withOpacity(0.06),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      unlocked ? theme.emoji : '🔒',
                                      style: const TextStyle(fontSize: 26),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            unlocked ? theme.title : 'পরবর্তী অধ্যায়',
                                            style: TextStyle(
                                              color: unlocked ? Colors.white : Colors.white38,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 15,
                                            ),
                                          ),
                                          if (unlocked)
                                            Text(
                                              theme.description,
                                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                                            ),
                                        ],
                                      ),
                                    ),
                                    if (unlocked) const Icon(Icons.chevron_right, color: Colors.white),
                                  ],
                                ),
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
