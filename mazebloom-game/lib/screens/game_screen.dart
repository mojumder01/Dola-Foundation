import 'dart:math';
import 'package:flutter/material.dart';
import '../models/grid_shape.dart';
import '../utils/maze_generator.dart';
import '../utils/shape_factory.dart';
import '../utils/difficulty_config.dart';
import '../utils/progress_manager.dart';
import '../utils/daily_challenge_manager.dart';
import '../utils/culture_theme.dart';
import '../utils/coin_manager.dart';
import '../utils/gem_manager.dart';
import '../utils/reward_calculator.dart';
import '../utils/lives_manager.dart';
import '../utils/achievement_manager.dart';
import '../utils/app_language.dart';
import '../utils/path_color_manager.dart';
import '../utils/hint_manager.dart';
import '../utils/feedback_service.dart';
import '../services/ad_service.dart';
import '../widgets/maze_board.dart';
import '../widgets/app_background.dart';

// গেম চারভাবে খেলা যায় — fixed level, daily challenge, unlimited (endless), অথবা story chapter
enum GameMode { level, daily, unlimited, story }

// মূল gameplay screen — শেপ দেখায়, drag করে path আঁকতে হয়
class GameScreen extends StatefulWidget {
  final GridShape shape;
  final GameMode mode;
  final Difficulty? difficulty; // mode == level হলে লাগবে
  final int? levelIndex; // mode == level হলে লাগবে
  final CultureTheme? theme; // mode == story/festival daily হলে — নাম, রঙ, ইমোজি দেখানোর জন্য
  final int? storyChapterIndex; // mode == story হলে লাগবে

  const GameScreen({
    super.key,
    required this.shape,
    this.mode = GameMode.level,
    this.difficulty,
    this.levelIndex,
    this.theme,
    this.storyChapterIndex,
  });

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  static const int _startingLives = 3;

  late GridShape _shape;
  List<Point<int>> _path = [];
  int _lives = _startingLives;
  int _unlimitedStreak = 0; // unlimited mode এ কয়টা শেপ সমাধান হলো
  Point<int>? _hintCell;
  DateTime? _startTime; // speed bonus হিসাব করার জন্য
  bool _perfectRun = true; // এই attempt এ একবারও dead-end এ পড়েনি কিনা
  int _lastCoinsEarned = 0;
  Color _pathColor = const Color(0xFF7C4DFF);
  bool _freeHintAvailable = true;
  late int? _levelIndex; // level mode এ পরের level এ in-place এগিয়ে যাওয়ার জন্য
  late int? _storyChapterIndex; // story mode এ পরের chapter এ in-place এগিয়ে যাওয়ার জন্য
  late CultureTheme? _theme;

  @override
  void initState() {
    super.initState();
    _levelIndex = widget.levelIndex;
    _storyChapterIndex = widget.storyChapterIndex;
    _theme = widget.theme;
    _shape = widget.shape;
    _startTime = DateTime.now();
    _loadPathColor();
    _loadHintStatus();
  }

  Future<void> _loadPathColor() async {
    final color = await PathColorManager.getSelectedColor();
    if (mounted) setState(() => _pathColor = color);
  }

  Future<void> _loadHintStatus() async {
    final hasFree = await HintManager.hasFreeHintToday();
    if (mounted) setState(() => _freeHintAvailable = hasFree);
  }

  void _onPathChanged(List<Point<int>> newPath) {
    if (newPath.length > _path.length) FeedbackService.tap();
    setState(() {
      _path = newPath;
      _hintCell = null; // নতুন move হলে আগের hint বাতিল
    });

    if (newPath.length == _shape.totalCells) {
      FeedbackService.win();
      _onShapeSolved();
    }
  }

  void _onStuck() {
    FeedbackService.fail();
    setState(() {
      _lives--;
      _perfectRun = false;
    });

    if (_lives <= 0) {
      _handleLivesExhausted();
    } else {
      // ছোট delay দিয়ে বুঝিয়ে দাও dead-end হয়েছে, তারপর path reset করো
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(tr('😬 এই পথে আর যাওয়া যাচ্ছে না! আবার চেষ্টা করো।', "😬 No way forward from here! Try again.")),
          backgroundColor: const Color(0xFFF44336),
          duration: const Duration(seconds: 1),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      Future.delayed(const Duration(milliseconds: 600), () {
        if (mounted) setState(() => _path = []);
      });
    }
  }

  // Hint button — দিনে একটা ফ্রি, তারপর ad দেখে বা coin দিয়ে নিতে হয়
  Future<void> _useHint() async {
    if (_freeHintAvailable) {
      await HintManager.consumeFreeHint();
      setState(() => _freeHintAvailable = false);
      _revealHint();
      return;
    }
    _showHintPaywall();
  }

  void _showHintPaywall() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        title: Text(
          tr('আজকের ফ্রি hint শেষ', "Today's free hint is used up"),
          style: const TextStyle(color: Colors.white),
        ),
        content: Text(
          tr('বিজ্ঞাপন দেখে বা ${HintManager.hintCoinCost} কয়েন দিয়ে আরেকটা hint নাও',
              'Watch an ad or spend ${HintManager.hintCoinCost} coins for another hint'),
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(tr('বাতিল', 'Cancel'), style: const TextStyle(color: Colors.white54)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final spent = await CoinManager.spendCoins(HintManager.hintCoinCost);
              if (spent) {
                _revealHint();
              } else if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
                );
              }
            },
            child: Text(
              '🪙 ${HintManager.hintCoinCost} ${tr('কয়েন দিয়ে নাও', 'Use coins')}',
              style: const TextStyle(color: Color(0xFF7C4DFF)),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              AdService.showRewardedAd(
                onRewarded: _revealHint,
                onFailed: (reason) {
                  if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(reason)));
                },
              );
            },
            child: Text('📺 ${tr('বিজ্ঞাপন দেখো', 'Watch ad')}', style: const TextStyle(color: Colors.amber)),
          ),
        ],
      ),
    );
  }

  void _revealHint() {
    if (_path.isEmpty) {
      // path শুরুই হয়নি — solvable হলে যেকোনো cell থেকেই শুরু করা যায়,
      // তাই hint হিসেবে generate করা solution এর প্রথম cell দেখাও
      final solution = MazeGenerator.findHamiltonianPath(_shape);
      if (solution != null) {
        setState(() => _hintCell = solution.first);
      }
      return;
    }

    final visited = _path.toSet();
    final continuation = MazeGenerator.findContinuation(_shape, visited, _path.last);

    if (continuation != null && continuation.isNotEmpty) {
      setState(() => _hintCell = continuation.first);
    } else {
      // বর্তমান path থেকে আর সমাধান সম্ভব না — dead-end এ পড়ে গেছো
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('এই path থেকে আর সমাধান সম্ভব না — restart করো।', 'No solution is possible from this path — restart.'))),
      );
    }
  }

  void _restart() {
    setState(() {
      _path = [];
      _hintCell = null;
      _perfectRun = true;
    });
  }

  Future<void> _onShapeSolved() async {
    final elapsed = DateTime.now().difference(_startTime!).inSeconds;
    final coins = RewardCalculator.calculate(
      totalCells: _shape.totalCells,
      elapsedSeconds: elapsed,
      perfectRun: _perfectRun,
    );
    await CoinManager.addCoins(coins);
    _lastCoinsEarned = coins;

    await _unlockAchievement('first_bloom');
    if (elapsed <= 10) await _unlockAchievement('speed_bloom');
    if (_perfectRun) await _unlockAchievement('perfect_bloom');

    AdService.maybeShowInterstitial();

    switch (widget.mode) {
      case GameMode.level:
        if (widget.difficulty != null && _levelIndex != null) {
          await ProgressManager.unlockNext(widget.difficulty!, _levelIndex!);
        }
        _showWinDialog(onNext: _loadNextLevel, nextLabel: tr('পরের Level ➜', 'Next Level ➜'));
        break;
      case GameMode.daily:
        await DailyChallengeManager.markCompletedToday();
        final streak = await DailyChallengeManager.getStreak();
        if (streak >= 7) await _unlockAchievement('streak_master');
        _showWinDialog();
        break;
      case GameMode.unlimited:
        setState(() => _unlimitedStreak++);
        if (_unlimitedStreak >= 10) await _unlockAchievement('unlimited_legend');
        _showUnlimitedWinDialog();
        break;
      case GameMode.story:
        final chapterIndex = _storyChapterIndex;
        var hasNext = false;
        if (chapterIndex != null) {
          await ProgressManager.unlockNextStoryChapter(chapterIndex, StoryJourney.chapters.length);
          hasNext = chapterIndex < StoryJourney.chapters.length - 1;
          if (!hasNext) await _unlockAchievement('culture_explorer');
        }
        _showWinDialog(
          onNext: hasNext ? _loadNextStoryChapter : null,
          nextLabel: tr('পরের অধ্যায় ➜', 'Next Chapter ➜'),
        );
        break;
    }
  }

  // নতুন achievement unlock হলে বিরল gem currency reward দেয়
  Future<void> _unlockAchievement(String id) async {
    final isNew = await AchievementManager.unlock(id);
    if (isNew) await GemManager.addGems(5);
  }

  // Unlimited mode এ — পরের shape টা একটু কঠিন আকারে generate করে in-place চালিয়ে যাওয়া হয়
  void _loadNextUnlimitedShape() {
    final nextCells = 10 + (_unlimitedStreak * 2).clamp(0, 30);
    final style = _unlimitedStreak < 4
        ? ShapeStyle.blob
        : (_unlimitedStreak < 9 ? ShapeStyle.snake : ShapeStyle.branchy);
    final next = ShapeFactory.generate(targetCells: nextCells, style: style);
    setState(() {
      _shape = next;
      _path = [];
      _hintCell = null;
      _startTime = DateTime.now();
      _perfectRun = true;
    });
  }

  // Level mode এ জিতলে পরের level টা in-place লোড হয় — হোমে ফিরে আসার বদলে
  void _loadNextLevel() {
    final difficulty = widget.difficulty;
    if (difficulty == null) return;
    final nextIndex = (_levelIndex ?? 0) + 1;
    final cells = DifficultyConfig.cellsForLevel(difficulty, nextIndex);
    final seed = DifficultyConfig.seedForLevel(difficulty, nextIndex);
    final style = switch (difficulty) {
      Difficulty.easy => ShapeStyle.blob,
      Difficulty.medium => ShapeStyle.snake,
      Difficulty.hard => ShapeStyle.branchy,
    };
    final shape = ShapeFactory.generate(targetCells: cells, seed: seed, style: style);
    setState(() {
      _shape = shape;
      _levelIndex = nextIndex;
      _path = [];
      _hintCell = null;
      _startTime = DateTime.now();
      _perfectRun = true;
    });
  }

  // Story mode এ জিতলে পরের chapter টা in-place লোড হয় — শেষ chapter হলে আর এগোনোর কিছু নেই
  void _loadNextStoryChapter() {
    final nextIndex = (_storyChapterIndex ?? 0) + 1;
    if (nextIndex >= StoryJourney.chapters.length) return;
    final theme = StoryJourney.chapters[nextIndex];
    final shape = ShapeFactory.generate(targetCells: theme.targetCells, seed: theme.seed);
    setState(() {
      _shape = shape;
      _theme = theme;
      _storyChapterIndex = nextIndex;
      _path = [];
      _hintCell = null;
      _startTime = DateTime.now();
      _perfectRun = true;
    });
  }

  void _showWinDialog({VoidCallback? onNext, String? nextLabel}) {
    final elapsed = DateTime.now().difference(_startTime!).inSeconds;
    final theme = _theme;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          theme != null
              ? '${theme.emoji} ${theme.displayTitle} ${tr('সম্পন্ন!', 'Complete!')}'
              : tr('🎉 সমাধান হয়েছে!', '🎉 Solved!'),
          style: const TextStyle(color: Colors.white),
        ),
        content: Text(
          tr(
            'সময় লেগেছে: $elapsed সেকেন্ড\n🪙 +$_lastCoinsEarned coins পেয়েছো',
            'Time taken: $elapsed sec\n🪙 +$_lastCoinsEarned coins earned',
          ),
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
            child: Text(tr('হোম এ ফিরো', 'Back to Home')),
          ),
          if (onNext != null)
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                onNext();
              },
              child: Text(
                nextLabel ?? tr('পরের পর্ব ➜', 'Next ➜'),
                style: const TextStyle(color: Color(0xFF7C4DFF)),
              ),
            ),
        ],
      ),
    );
  }

  void _showUnlimitedWinDialog() {
    final elapsed = DateTime.now().difference(_startTime!).inSeconds;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          tr('🎉 শেপ #$_unlimitedStreak সমাধান!', '🎉 Shape #$_unlimitedStreak solved!'),
          style: const TextStyle(color: Colors.white),
        ),
        content: Text(
          tr(
            'সময় লেগেছে: $elapsed সেকেন্ড\n🪙 +$_lastCoinsEarned coins পেয়েছো\nচলো, পরের শেপটা একটু কঠিন!',
            'Time taken: $elapsed sec\n🪙 +$_lastCoinsEarned coins earned\nNext shape will be a bit harder!',
          ),
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(tr('থামো', 'Stop')),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _loadNextUnlimitedShape();
            },
            child: Text(tr('চালিয়ে যাও', 'Continue'), style: const TextStyle(color: Color(0xFF7C4DFF))),
          ),
        ],
      ),
    );
  }

  // লাইফ শেষ হয়ে গেলে — ব্যাংক করা লাইফ বা ad দেখে continue করার সুযোগ দাও
  Future<void> _handleLivesExhausted() async {
    final bankedLives = await LivesManager.getBankedLives();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(tr('জীবন শেষ! 💔', 'Out of lives! 💔'), style: const TextStyle(color: Colors.white)),
        content: Text(
          bankedLives > 0
              ? tr('তোমার ব্যাংকে $bankedLives টা extra life আছে — চালিয়ে যাবে?', 'You have $bankedLives banked extra life — continue?')
              : tr('একটা বিজ্ঞাপন দেখে continue করতে পারো।', 'You can watch an ad to continue.'),
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _showGameOverDialog();
            },
            child: Text(tr('থামো', 'Stop')),
          ),
          if (bankedLives > 0)
            TextButton(
              onPressed: () async {
                Navigator.pop(context);
                await LivesManager.useBankedLife();
                setState(() {
                  _lives = 1;
                  _path = [];
                });
              },
              child: Text(tr('ব্যাংক থেকে লাইফ নাও', 'Use banked life'), style: const TextStyle(color: Color(0xFF7C4DFF))),
            )
          else
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                AdService.showRewardedAd(
                  onRewarded: () {
                    setState(() {
                      _lives = 1;
                      _path = [];
                    });
                  },
                  onFailed: (reason) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(reason)));
                    }
                    _showGameOverDialog();
                  },
                );
              },
              child: Text(tr('📺 বিজ্ঞাপন দেখো', '📺 Watch ad'), style: const TextStyle(color: Colors.amber)),
            ),
        ],
      ),
    );
  }

  void _showGameOverDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(tr('জীবন শেষ! 💔', 'Out of lives! 💔'), style: const TextStyle(color: Colors.white)),
        content: Text(
          widget.mode == GameMode.unlimited
              ? tr('মোট $_unlimitedStreak টা শেপ সমাধান করেছো! আবার শুরু করতে চাও?', 'You solved $_unlimitedStreak shapes in total! Start over?')
              : tr('আর কোনো লাইফ নেই। আবার শুরু করতে চাও?', 'No lives left. Start over?'),
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
            child: Text(tr('হোম এ ফিরো', 'Back to Home')),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _lives = _startingLives;
                _path = [];
                _perfectRun = true;
                if (widget.mode == GameMode.unlimited) _unlimitedStreak = 0;
              });
            },
            child: Text(tr('আবার খেলো', 'Play again'), style: const TextStyle(color: Color(0xFF7C4DFF))),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Column(
            children: [
              _buildTopBar(),
              const SizedBox(height: 12),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: MazeBoard(
                    shape: _shape,
                    path: _path,
                    hintCell: _hintCell,
                    onPathChanged: _onPathChanged,
                    onStuck: _onStuck,
                    pathColor: _pathColor,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(
                  tr('${_path.length} / ${_shape.totalCells} ঘর পূরণ হয়েছে',
                      '${_path.length} / ${_shape.totalCells} cells filled'),
                  style: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 13),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        children: [
          // Back button
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

          const SizedBox(width: 10),

          // Restart button
          GestureDetector(
            onTap: _restart,
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.refresh, color: Colors.white, size: 20),
            ),
          ),

          const SizedBox(width: 10),

          // Theme title — story chapter বা festival daily challenge হলে দেখায়
          if (_theme != null)
            Expanded(
              child: Text(
                '${_theme!.emoji} ${_theme!.displayTitle}',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                overflow: TextOverflow.ellipsis,
              ),
            ),

          // Unlimited mode streak counter
          if (widget.mode == GameMode.unlimited)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '🔥 $_unlimitedStreak',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),

          const Spacer(),

          // Lives — হার্ট আইকন
          Row(
            children: List.generate(
              _startingLives,
              (i) => Icon(
                i < _lives ? Icons.favorite : Icons.favorite_border,
                color: const Color(0xFFF44336),
                size: 20,
              ),
            ),
          ),

          const Spacer(),

          // Hint button
          GestureDetector(
            onTap: _useHint,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.amber.withOpacity(0.5)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lightbulb, color: Colors.amber, size: 16),
                  const SizedBox(width: 6),
                  Text(
                    _freeHintAvailable ? tr('ফ্রি Hint', 'Free Hint') : '🪙${HintManager.hintCoinCost}',
                    style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
