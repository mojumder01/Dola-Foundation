// This file implements the core gameplay screen for Maze Bloom.
// Responsibilities: rendering the current maze/shape (via MazeBoard), handling
// drag-to-trace path input, detecting win/loss conditions, advancing progression
// for each game mode (level, story, daily, unlimited), and wiring in the
// supporting economy/monetization systems (lives, coins, gems, hints, ads).
import 'dart:math';
import 'package:flutter/foundation.dart';
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
import '../utils/cell_skin_manager.dart';
import '../utils/maze_background_manager.dart';
import '../utils/hint_manager.dart';
import '../utils/feedback_service.dart';
import '../services/ad_service.dart';
import '../widgets/maze_board.dart';
import '../widgets/app_background.dart';

// গেম চারভাবে খেলা যায় — fixed level, daily challenge, unlimited (endless), অথবা story chapter
/// The four supported game modes. Each mode drives different progression and
/// win-dialog behavior in [_GameScreenState._onShapeSolved]:
/// - [level]: fixed difficulty-based levels with sequential unlock.
/// - [daily]: a single daily challenge shape, tracks completion streaks.
/// - [unlimited]: endless mode with increasing difficulty per solved shape.
/// - [story]: narrative chapters, each containing multiple levels.
enum GameMode { level, daily, unlimited, story }

// মূল gameplay screen — শেপ দেখায়, drag করে path আঁকতে হয়
/// The main gameplay screen widget (stateless config holder).
/// Displays a [GridShape] maze and lets the player trace a path through it
/// by dragging across cells. Actual mutable game state lives in
/// [_GameScreenState].
class GameScreen extends StatefulWidget {
  final GridShape shape;
  final GameMode mode;
  final Difficulty? difficulty; // mode == level হলে লাগবে
  final int? levelIndex; // mode == level হলে লাগবে
  final CultureTheme? theme; // mode == story/festival daily হলে — নাম, রঙ, ইমোজি দেখানোর জন্য
  final int? storyChapterIndex; // mode == story হলে লাগবে
  final int? storyLevelIndex; // mode == story হলে — chapter এর ভেতরের কোন level
  final int initialUnlimitedStreak; // mode == unlimited হলে — সেভ করা streak থেকে resume করার জন্য

  const GameScreen({
    super.key,
    required this.shape,
    this.mode = GameMode.level,
    this.difficulty,
    this.levelIndex,
    this.theme,
    this.storyChapterIndex,
    this.storyLevelIndex,
    this.initialUnlimitedStreak = 0,
  });

  @override
  State<GameScreen> createState() => _GameScreenState();
}

/// Holds all mutable state for a single gameplay session: the current shape,
/// the player's traced path, lives/streak counters, hint state, theming, and
/// the "generating next shape" loading flag. Methods on this class implement
/// input handling, win/loss detection, mode-specific progression, and the
/// dialogs/UI that surround the maze board.
class _GameScreenState extends State<GameScreen> {
  static const int _startingLives = 3;

  late GridShape _shape;
  List<Point<int>> _path = []; // cells visited so far, in order, for the current attempt
  int _lives = _startingLives;
  int _unlimitedStreak = 0; // unlimited mode এ কয়টা শেপ সমাধান হলো
  Point<int>? _hintCell; // cell to highlight as the next suggested move, or null if no hint active
  DateTime? _startTime; // speed bonus হিসাব করার জন্য
  bool _perfectRun = true; // এই attempt এ একবারও dead-end এ পড়েনি কিনা
  int _lastCoinsEarned = 0; // coins awarded for the most recently solved shape, shown in the win dialog
  Color _pathColor = const Color(0xFF7C4DFF);
  Color _cellColor = const Color(0xFF1E1E3A);
  List<Color>? _bgGradientColors;
  String? _bgImagePath;
  bool _bgIsLight = false;
  bool _freeHintAvailable = true; // whether today's single free hint has not yet been used
  bool _generating = false; // পরের shape generate হওয়ার সময় (background isolate এ) loading দেখানোর জন্য
  late int? _levelIndex; // level mode এ পরের level এ in-place এগিয়ে যাওয়ার জন্য
  late int? _storyChapterIndex; // story mode এ পরের chapter এ in-place এগিয়ে যাওয়ার জন্য
  late int? _storyLevelIndex; // story mode এ chapter এর ভেতরের পরের level এ এগিয়ে যাওয়ার জন্য
  late CultureTheme? _theme;

  /// Initializes session state from the widget's constructor params, starts the
  /// solve-time clock, and kicks off async loads for the player's saved
  /// cosmetic preferences (path/cell colors, background) and hint availability.
  @override
  void initState() {
    super.initState();
    _levelIndex = widget.levelIndex;
    _storyChapterIndex = widget.storyChapterIndex;
    _storyLevelIndex = widget.storyLevelIndex;
    _theme = widget.theme;
    _shape = widget.shape;
    _unlimitedStreak = widget.initialUnlimitedStreak;
    _startTime = DateTime.now();
    _loadPathColor();
    _loadHintStatus();
  }

  /// Loads the player's selected path color, cell skin color, and maze
  /// background (including any custom photo) from persisted settings, then
  /// applies them via `setState` once loaded.
  Future<void> _loadPathColor() async {
    final color = await PathColorManager.getSelectedColor();
    final cellColor = await CellSkinManager.getSelectedColor();
    final bgId = await MazeBackgroundManager.getSelectedId();
    final bgOption = MazeBackgroundManager.optionFor(bgId);
    final customPath = bgOption.isCustomPhoto ? await MazeBackgroundManager.getCustomPhotoPath() : null;
    if (mounted) {
      setState(() {
        _pathColor = color;
        _cellColor = cellColor;
        _bgGradientColors = bgOption.colors;
        _bgImagePath = customPath;
        _bgIsLight = bgOption.isLight;
      });
    }
  }

  /// Checks whether the player has already used today's free hint and updates
  /// [_freeHintAvailable] accordingly.
  Future<void> _loadHintStatus() async {
    final hasFree = await HintManager.hasFreeHintToday();
    if (mounted) setState(() => _freeHintAvailable = hasFree);
  }

  /// Callback from [MazeBoard] whenever the player's dragged path changes.
  /// Plays tap feedback on forward progress, clears any active hint (since the
  /// board state changed), and triggers win handling once every cell in the
  /// shape has been visited (path length equals total cell count).
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

  /// Callback from [MazeBoard] when the player's path reaches a dead end
  /// (no unvisited adjacent cell remains). Deducts one life and marks the run
  /// as no longer "perfect". If lives are exhausted, hands off to
  /// [_handleLivesExhausted]; otherwise shows a brief snackbar and resets the
  /// path after a short delay so the player can retry the same shape.
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
  /// Handles the hint button tap. If the free daily hint hasn't been used yet,
  /// consumes it and reveals a hint immediately; otherwise shows the paywall
  /// dialog offering an ad or coin-based hint purchase.
  Future<void> _useHint() async {
    if (_freeHintAvailable) {
      await HintManager.consumeFreeHint();
      setState(() => _freeHintAvailable = false);
      _revealHint();
      return;
    }
    _showHintPaywall();
  }

  /// Displays the dialog shown once the free daily hint is used up, letting
  /// the player choose between spending coins or watching a rewarded ad to
  /// unlock another hint via [_revealHint].
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

  // Hamiltonian-path/continuation খোঁজা backtracking-heavy — বড় shape এ main thread
  // ব্লক করে ANR ("Not Responding") হতে পারে, তাই compute() দিয়ে আলাদা isolate এ চালানো হয়
  /// Computes and shows the next suggested cell for the hint feature.
  ///
  /// Finding a Hamiltonian path (or a valid continuation from the current
  /// path) requires exhaustive backtracking search, which is CPU-heavy and
  /// would block the UI thread on larger shapes. `compute()` runs this work on
  /// a background isolate so the app stays responsive while the hint is
  /// calculated. Two cases are handled:
  /// - No path started yet: solve the shape from scratch and reveal its first cell.
  /// - Path in progress: search for a continuation from the last visited cell.
  Future<void> _revealHint() async {
    if (_path.isEmpty) {
      // path শুরুই হয়নি — solvable হলে যেকোনো cell থেকেই শুরু করা যায়,
      // তাই hint হিসেবে generate করা solution এর প্রথম cell দেখাও
      final solution = await compute(findHamiltonianPathInBackground, _shape);
      if (solution != null && mounted) {
        setState(() => _hintCell = solution.first);
      }
      return;
    }

    final visited = _path.toSet();
    final continuation = await compute(
      findContinuationInBackground,
      continuationRequest(_shape, visited, _path.last),
    );

    if (!mounted) return;
    if (continuation != null && continuation.isNotEmpty) {
      setState(() => _hintCell = continuation.first);
    } else {
      // বর্তমান path থেকে আর সমাধান সম্ভব না — dead-end এ পড়ে গেছো
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('এই path থেকে আর সমাধান সম্ভব না — restart করো।', 'No solution is possible from this path — restart.'))),
      );
    }
  }

  /// Resets the player's traced path on the current shape, clearing any
  /// active hint and re-arming the "perfect run" flag.
  void _restart() {
    setState(() {
      _path = [];
      _hintCell = null;
      _perfectRun = true;
    });
  }

  /// Central win-handling routine, invoked once [_onPathChanged] detects the
  /// shape is fully traced. Computes and awards coins based on elapsed time
  /// and whether the run was "perfect" (no dead-ends), unlocks relevant
  /// achievements (first solve, speed solve, perfect solve, mode-specific
  /// milestones), opportunistically shows an interstitial ad, and then
  /// branches per [GameMode] to update progression (unlocking next
  /// level/chapter, marking daily completion, bumping the unlimited streak)
  /// and show the appropriate win dialog.
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
        await ProgressManager.setUnlimitedStreak(_unlimitedStreak);
        if (_unlimitedStreak >= 10) await _unlockAchievement('unlimited_legend');
        _showUnlimitedWinDialog();
        break;
      case GameMode.story:
        final chapterIndex = _storyChapterIndex;
        final levelIndex = _storyLevelIndex;
        var hasNext = false;
        var nextLabel = tr('পরের Level ➜', 'Next Level ➜');
        if (chapterIndex != null && levelIndex != null) {
          final isLastLevelInChapter = levelIndex >= StoryJourney.levelsPerChapter - 1;
          if (isLastLevelInChapter) {
            await ProgressManager.unlockNextStoryChapter(chapterIndex, StoryJourney.chapters.length);
            hasNext = chapterIndex < StoryJourney.chapters.length - 1;
            nextLabel = tr('পরের অধ্যায় ➜', 'Next Chapter ➜');
            if (!hasNext) await _unlockAchievement('culture_explorer');
          } else {
            await ProgressManager.unlockNextStoryLevel(chapterIndex, levelIndex, StoryJourney.levelsPerChapter);
            hasNext = true;
          }
        }
        _showWinDialog(
          onNext: hasNext ? _loadNextStoryLevel : null,
          nextLabel: nextLabel,
        );
        break;
    }
  }

  // নতুন achievement unlock হলে বিরল gem currency reward দেয়
  /// Unlocks the achievement with the given [id] if not already unlocked, and
  /// grants a small gem reward (premium currency) the first time it's earned.
  /// Safe to call repeatedly — only newly-unlocked achievements pay out.
  Future<void> _unlockAchievement(String id) async {
    final isNew = await AchievementManager.unlock(id);
    if (isNew) await GemManager.addGems(5);
  }

  // Unlimited mode এ — পরের shape টা একটু কঠিন আকারে generate করে in-place চালিয়ে যাওয়া হয়
  // (generation compute() এ আলাদা isolate এ চলে যাতে main thread block হয়ে ANR না হয়)
  /// Generates and loads the next shape for Unlimited mode, scaling difficulty
  /// (cell count and shape style) with the current streak. Shape generation
  /// runs on a background isolate via `compute()` to avoid blocking the UI
  /// thread (and causing an ANR) for larger/more complex shapes; [_generating]
  /// is toggled to show a loading overlay while this happens.
  Future<void> _loadNextUnlimitedShape() async {
    setState(() => _generating = true);
    final nextCells = 10 + (_unlimitedStreak * 2).clamp(0, 30);
    // cycle through all shape families (instead of locking onto one style for
    // the rest of the run) so long Unlimited sessions don't keep showing the
    // same kind of maze over and over
    const styleCycle = [ShapeStyle.blob, ShapeStyle.snake, ShapeStyle.cross, ShapeStyle.spiral, ShapeStyle.branchy];
    final style = styleCycle[(_unlimitedStreak ~/ 3) % styleCycle.length];
    final next = await compute(generateShapeInBackground, ShapeGenRequest(targetCells: nextCells, style: style));
    if (!mounted) return;
    setState(() {
      _shape = next;
      _path = [];
      _hintCell = null;
      _startTime = DateTime.now();
      _perfectRun = true;
      _generating = false;
    });
  }

  // Level mode এ জিতলে পরের level টা in-place লোড হয় — হোমে ফিরে আসার বদলে
  /// Loads the next fixed level for Level mode in-place (without navigating
  /// back to the home screen). Derives the next shape's cell count, seed, and
  /// style from [DifficultyConfig] and the selected [Difficulty], then
  /// generates it on a background isolate via `compute()`.
  Future<void> _loadNextLevel() async {
    final difficulty = widget.difficulty;
    if (difficulty == null) return;
    setState(() => _generating = true);
    final nextIndex = (_levelIndex ?? 0) + 1;
    final cells = DifficultyConfig.cellsForLevel(difficulty, nextIndex);
    final seed = DifficultyConfig.seedForLevel(difficulty, nextIndex);
    final style = DifficultyConfig.styleForLevel(difficulty, nextIndex);
    final shape = await compute(
      generateShapeInBackground,
      ShapeGenRequest(targetCells: cells, seed: seed, style: style),
    );
    if (!mounted) return;
    setState(() {
      _shape = shape;
      _levelIndex = nextIndex;
      _path = [];
      _hintCell = null;
      _startTime = DateTime.now();
      _perfectRun = true;
      _generating = false;
    });
  }

  // Story mode এ জিতলে পরের level (একই chapter এ, অথবা chapter শেষ হলে পরের chapter এর
  // ১ম level) in-place লোড হয় — সব chapter এর সব level শেষ হলে আর এগোনোর কিছু নেই
  /// Loads the next Story mode level in-place: either the next level within
  /// the current chapter, or the first level of the next chapter once the
  /// current chapter is exhausted. No-ops if there are no more chapters left.
  /// Shape generation runs on a background isolate via `compute()`.
  Future<void> _loadNextStoryLevel() async {
    final currentChapter = _storyChapterIndex ?? 0;
    final currentLevel = _storyLevelIndex ?? 0;
    int nextChapter = currentChapter;
    int nextLevel = currentLevel + 1;
    if (nextLevel >= StoryJourney.levelsPerChapter) {
      nextChapter = currentChapter + 1;
      nextLevel = 0;
    }
    if (nextChapter >= StoryJourney.chapters.length) return;

    setState(() => _generating = true);
    final theme = StoryJourney.chapters[nextChapter];
    final shape = await compute(
      generateShapeInBackground,
      ShapeGenRequest(
        targetCells: theme.cellsForLevel(nextLevel),
        seed: theme.seedForLevel(nextLevel),
        style: theme.styleForLevel(nextLevel),
      ),
    );
    if (!mounted) return;
    setState(() {
      _shape = shape;
      _theme = theme;
      _storyChapterIndex = nextChapter;
      _storyLevelIndex = nextLevel;
      _path = [];
      _hintCell = null;
      _startTime = DateTime.now();
      _perfectRun = true;
      _generating = false;
    });
  }

  /// Shows the generic "shape solved" dialog with elapsed time and coins
  /// earned. If [onNext] is provided, a button is shown to advance to the
  /// next level/chapter using [nextLabel] as its text; otherwise only a
  /// "Back to Home" option is offered (used for Daily mode, which has no
  /// "next" step).
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

  /// Shows the Unlimited-mode-specific win dialog, which (unlike
  /// [_showWinDialog]) offers a "Continue" action that loads a harder shape
  /// via [_loadNextUnlimitedShape] instead of advancing a fixed level/chapter.
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
  /// Invoked when [_lives] reaches 0 (from [_onStuck]). Checks whether the
  /// player has any banked extra lives (earned/purchased separately) and
  /// offers to spend one to continue; if none are banked, offers a rewarded
  /// ad instead. Either path grants exactly one life and clears the path so
  /// the player can retry. If the player declines both options, falls back to
  /// [_showGameOverDialog].
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

  /// Shows the final "game over" dialog (no banked lives, ad declined/failed,
  /// or player chose to stop). Offers returning to home, or restarting the
  /// current attempt with lives and run-state reset (and the unlimited streak
  /// reset to 0, if applicable).
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
            onPressed: () async {
              Navigator.pop(context);
              setState(() {
                _lives = _startingLives;
                _path = [];
                _perfectRun = true;
                if (widget.mode == GameMode.unlimited) _unlimitedStreak = 0;
              });
              if (widget.mode == GameMode.unlimited) {
                await ProgressManager.setUnlimitedStreak(0);
              }
            },
            child: Text(tr('আবার খেলো', 'Play again'), style: const TextStyle(color: Color(0xFF7C4DFF))),
          ),
        ],
      ),
    );
  }

  /// Builds the screen layout: top bar (back/restart/hint buttons, lives,
  /// theme title, streak counter), the [MazeBoard] itself with an optional
  /// loading overlay while the next shape is generating, and a progress
  /// label showing cells filled out of the shape's total.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        gradientColors: _bgGradientColors,
        imagePath: _bgImagePath,
        isLight: _bgIsLight,
        child: SafeArea(
          child: Column(
            children: [
              _buildTopBar(),
              const SizedBox(height: 12),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Stack(
                    children: [
                      MazeBoard(
                        shape: _shape,
                        path: _path,
                        hintCell: _hintCell,
                        onPathChanged: _onPathChanged,
                        onStuck: _onStuck,
                        pathColor: _pathColor,
                        cellColor: _cellColor,
                      ),
                      // পরের shape background isolate এ generate হওয়ার সময় — UI thread
                      // আটকায় না, কিন্তু user কে বুঝাতে loading overlay দেখানো হয়
                      if (_generating)
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

  /// Builds the top bar row: back button, restart button, optional theme
  /// title (story/festival), unlimited-mode streak badge, life-heart icons,
  /// and the hint button (label switches between "Free Hint" and the coin
  /// cost depending on [_freeHintAvailable]).
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
