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
import '../utils/reward_calculator.dart';
import '../utils/lives_manager.dart';
import '../utils/achievement_manager.dart';
import '../services/ad_service.dart';
import '../widgets/maze_board.dart';

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
  bool _isSolvable = true; // shape generate করার সময়েই check হয়
  DateTime? _startTime; // speed bonus হিসাব করার জন্য
  bool _perfectRun = true; // এই attempt এ একবারও dead-end এ পড়েনি কিনা
  int _lastCoinsEarned = 0;

  @override
  void initState() {
    super.initState();
    _shape = widget.shape;
    _startTime = DateTime.now();
    _checkSolvable();
  }

  void _checkSolvable() {
    final solution = MazeGenerator.findHamiltonianPath(_shape);
    _isSolvable = solution != null;
  }

  void _onPathChanged(List<Point<int>> newPath) {
    setState(() {
      _path = newPath;
      _hintCell = null; // নতুন move হলে আগের hint বাতিল
    });

    if (newPath.length == _shape.totalCells) {
      _onShapeSolved();
    }
  }

  void _onStuck() {
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
          content: const Text('😬 এই পথে আর যাওয়া যাচ্ছে না! আবার চেষ্টা করো।'),
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

  // Hint button — বর্তমান path থেকে পরের সঠিক move দেখায়
  void _useHint() {
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
        const SnackBar(content: Text('এই path থেকে আর সমাধান সম্ভব না — restart করো।')),
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

    await AchievementManager.unlock('first_bloom');
    if (elapsed <= 10) await AchievementManager.unlock('speed_bloom');
    if (_perfectRun) await AchievementManager.unlock('perfect_bloom');

    switch (widget.mode) {
      case GameMode.level:
        if (widget.difficulty != null && widget.levelIndex != null) {
          await ProgressManager.unlockNext(widget.difficulty!, widget.levelIndex!);
        }
        _showWinDialog();
        break;
      case GameMode.daily:
        await DailyChallengeManager.markCompletedToday();
        final streak = await DailyChallengeManager.getStreak();
        if (streak >= 7) await AchievementManager.unlock('streak_master');
        _showWinDialog();
        break;
      case GameMode.unlimited:
        setState(() => _unlimitedStreak++);
        if (_unlimitedStreak >= 10) await AchievementManager.unlock('unlimited_legend');
        _showUnlimitedWinDialog();
        break;
      case GameMode.story:
        if (widget.storyChapterIndex != null) {
          await ProgressManager.unlockNextStoryChapter(
            widget.storyChapterIndex!,
            StoryJourney.chapters.length,
          );
          if (widget.storyChapterIndex == StoryJourney.chapters.length - 1) {
            await AchievementManager.unlock('culture_explorer');
          }
        }
        _showWinDialog();
        break;
    }
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
    _checkSolvable();
  }

  void _showWinDialog() {
    final elapsed = DateTime.now().difference(_startTime!).inSeconds;
    final theme = widget.theme;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          theme != null ? '${theme.emoji} ${theme.title} সম্পন্ন!' : '🎉 সমাধান হয়েছে!',
          style: const TextStyle(color: Colors.white),
        ),
        content: Text(
          'সময় লেগেছে: $elapsed সেকেন্ড\n🪙 +$_lastCoinsEarned coins পেয়েছো',
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
            child: const Text('হোম এ ফিরো'),
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
        title: Text('🎉 শেপ #$_unlimitedStreak সমাধান!', style: const TextStyle(color: Colors.white)),
        content: Text(
          'সময় লেগেছে: $elapsed সেকেন্ড\n🪙 +$_lastCoinsEarned coins পেয়েছো\nচলো, পরের শেপটা একটু কঠিন!',
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('থামো'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _loadNextUnlimitedShape();
            },
            child: const Text('চালিয়ে যাও', style: TextStyle(color: Color(0xFF7C4DFF))),
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
        title: const Text('জীবন শেষ! 💔', style: TextStyle(color: Colors.white)),
        content: Text(
          bankedLives > 0
              ? 'তোমার ব্যাংকে $bankedLives টা extra life আছে — চালিয়ে যাবে?'
              : 'একটা বিজ্ঞাপন দেখে continue করতে পারো।',
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _showGameOverDialog();
            },
            child: const Text('থামো'),
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
              child: const Text('ব্যাংক থেকে লাইফ নাও', style: TextStyle(color: Color(0xFF7C4DFF))),
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
              child: const Text('📺 বিজ্ঞাপন দেখো', style: TextStyle(color: Colors.amber)),
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
        title: const Text('জীবন শেষ! 💔', style: TextStyle(color: Colors.white)),
        content: Text(
          widget.mode == GameMode.unlimited
              ? 'মোট $_unlimitedStreak টা শেপ সমাধান করেছো! আবার শুরু করতে চাও?'
              : 'আর কোনো লাইফ নেই। আবার শুরু করতে চাও?',
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.popUntil(context, (route) => route.isFirst),
            child: const Text('হোম এ ফিরো'),
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
            child: const Text('আবার খেলো', style: TextStyle(color: Color(0xFF7C4DFF))),
          ),
        ],
      ),
    );
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
              _buildTopBar(),
              const SizedBox(height: 12),
              if (!_isSolvable)
                const Padding(
                  padding: EdgeInsets.all(12),
                  child: Text(
                    '⚠️ এই shape টা সমাধানযোগ্য না — ডেভেলপার কে জানাও',
                    style: TextStyle(color: Colors.redAccent),
                  ),
                ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: MazeBoard(
                    shape: _shape,
                    path: _path,
                    hintCell: _hintCell,
                    onPathChanged: _onPathChanged,
                    onStuck: _onStuck,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(
                  '${_path.length} / ${_shape.totalCells} ঘর পূরণ হয়েছে',
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
          if (widget.theme != null)
            Expanded(
              child: Text(
                '${widget.theme!.emoji} ${widget.theme!.title}',
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
              child: const Row(
                children: [
                  Icon(Icons.lightbulb, color: Colors.amber, size: 16),
                  SizedBox(width: 6),
                  Text('Hint', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
