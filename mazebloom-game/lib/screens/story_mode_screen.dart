// Story Mode entry screen: lists chapters representing a journey through
// Bangladeshi culture, unlocked one at a time as the player progresses.
import 'package:flutter/material.dart';
import '../utils/app_language.dart';
import '../utils/culture_theme.dart';
import '../utils/progress_manager.dart';
import 'story_chapter_levels_screen.dart';
import '../widgets/app_background.dart';

// বাংলাদেশের সংস্কৃতি ঘুরে দেখার journey — chapter ধরে ধরে unlock হয়
/// Top-level Story Mode screen showing the list of chapters (each a
/// [CultureTheme]) with their locked/unlocked state.
class StoryModeScreen extends StatefulWidget {
  const StoryModeScreen({super.key});

  @override
  State<StoryModeScreen> createState() => _StoryModeScreenState();
}

/// Tracks how many story chapters are unlocked and handles navigation into
/// a chapter's level list.
class _StoryModeScreenState extends State<StoryModeScreen> {
  int _unlockedCount = 1;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  /// Loads the number of unlocked story chapters from persistent storage.
  Future<void> _load() async {
    final unlocked = await ProgressManager.getUnlockedStoryCount();
    setState(() {
      _unlockedCount = unlocked;
      _loading = false;
    });
  }

  /// Navigates to [StoryChapterLevelsScreen] for the chapter at [index] and
  /// refreshes unlock state once the player returns (chapter unlocks may
  /// have changed by completing levels).
  void _openChapter(int index) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => StoryChapterLevelsScreen(chapterIndex: index)),
    ).then((_) => _load());
  }

  /// Builds the header and the scrollable list of chapter cards, each
  /// showing its theme emoji/title/description when unlocked, or a locked
  /// placeholder otherwise.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
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
                      tr('🇧🇩 সংস্কৃতির যাত্রা', '🇧🇩 Culture Journey'),
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
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
                                            unlocked ? theme.displayTitle : tr('পরবর্তী অধ্যায়', 'Next chapter'),
                                            style: TextStyle(
                                              color: unlocked ? Colors.white : Colors.white38,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 15,
                                            ),
                                          ),
                                          if (unlocked)
                                            Text(
                                              theme.displayDescription,
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
