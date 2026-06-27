// Main menu screen of the app: entry point for picking a game mode
// (difficulty-based levels, Daily Challenge, Culture Journey/story mode,
// Unlimited mode), and for navigating to Gallery, Rewards, and Profile.
import 'package:flutter/material.dart';
import '../utils/difficulty_config.dart';
import '../utils/daily_challenge_manager.dart';
import '../utils/shape_factory.dart';
import '../utils/coin_manager.dart';
import '../utils/lives_manager.dart';
import '../utils/app_language.dart';
import '../utils/profile_manager.dart';
import '../utils/login_streak_manager.dart';
import '../services/ad_service.dart';
import 'game_screen.dart';
import 'level_select_screen.dart';
import 'story_mode_screen.dart';
import 'gallery_screen.dart';
import 'rewards_screen.dart';
import 'profile_screen.dart';
import '../widgets/app_background.dart';

// মূল মেনু — Levels (৩টা difficulty), Daily Challenge, Unlimited mode বেছে নেওয়ার জায়গা
/// Stateful screen widget for the home/main menu. Logic and data loading
/// live in [_HomeScreenState].
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

/// State for [HomeScreen]. Loads player progress/currency on init, checks
/// for a daily login reward, and exposes navigation handlers to every
/// other screen reachable from the main menu.
class _HomeScreenState extends State<HomeScreen> {
  // whether today's Daily Challenge is already completed
  bool _dailyDone = false;
  // current daily-challenge streak length
  int _streak = 0;
  int _coins = 0;
  // extra lives stored for Unlimited mode
  int _bankedLives = 0;
  String _avatar = ProfileManager.defaultAvatar;
  String? _name;

  @override
  void initState() {
    super.initState();
    _loadData();
    _checkLoginReward();
  }

  // রোজ অ্যাপ খোলার জন্য — শুধু খোলার জন্যই — coin reward, ৭ দিনের চক্রে বাড়তে থাকে
  /// Claims the daily login reward (if due) and shows a celebratory dialog.
  /// Runs once per app open; awards coins on a rolling 7-day streak cycle
  /// and re-loads screen data afterward so the new coin total is reflected.
  Future<void> _checkLoginReward() async {
    final reward = await LoginStreakManager.claimIfDue();
    if (reward == null) return;
    await CoinManager.addCoins(reward.coins);
    await _loadData();
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text(
          tr('🔥 দৈনিক বোনাস!', '🔥 Daily Login Bonus!'),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Text(
          tr('${reward.streak} দিনের streak! 🪙${reward.coins} পেয়েছো।',
              '${reward.streak}-day streak! You got 🪙${reward.coins}.'),
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(tr('ঠিক আছে', 'OK'), style: const TextStyle(color: Color(0xFF7C4DFF))),
          ),
        ],
      ),
    );
  }

  /// Reloads all player-facing data shown on the home screen (daily
  /// challenge status, streak, coins, banked lives, avatar, name) from
  /// their respective managers and triggers a rebuild via [setState].
  Future<void> _loadData() async {
    final done = await DailyChallengeManager.isCompletedToday();
    final streak = await DailyChallengeManager.getStreak();
    final coins = await CoinManager.getCoins();
    final lives = await LivesManager.getBankedLives();
    final avatar = await ProfileManager.getAvatar();
    final name = await ProfileManager.getName();
    setState(() {
      _dailyDone = done;
      _streak = streak;
      _coins = coins;
      _bankedLives = lives;
      _avatar = avatar;
      _name = name;
    });
  }

  /// Navigates to the Gallery screen; reloads home data on return since
  /// achievements/rewards earned there can affect home screen state.
  void _openGallery() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const GalleryScreen())).then((_) => _loadData());
  }

  /// Navigates to the Rewards screen; reloads home data on return (e.g.
  /// coins or banked lives may have changed).
  void _openRewards() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const RewardsScreen())).then((_) => _loadData());
  }

  /// Navigates to the Profile screen; reloads home data on return (e.g.
  /// avatar or name may have changed).
  void _openProfile() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())).then((_) => _loadData());
  }

  /// Starts the Daily Challenge flow. If already completed today, shows an
  /// informational dialog instead of re-opening the same maze (the daily
  /// shape is deterministic per-day, so replaying it would be pointless).
  /// Otherwise launches [GameScreen] with today's shape/theme in daily mode.
  void _openDailyChallenge() {
    if (_dailyDone) {
      // আজকেরটা আগেই শেষ — পুরোনো maze আবার না দেখিয়ে শুধু জানিয়ে দাও কালকে আসতে হবে
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          backgroundColor: const Color(0xFF1A1A2E),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Text(
            tr('🏆 আজকেরটা শেষ!', '🏆 Already done for today!'),
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          content: Text(
            tr('🔥 $_streak দিনের streak। নতুন একটা unique চ্যালেঞ্জের জন্য কালকে আবার আসো!',
                "🔥 $_streak day streak. Come back tomorrow for a brand-new challenge!"),
            style: const TextStyle(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(tr('ঠিক আছে', 'OK'), style: const TextStyle(color: Color(0xFF7C4DFF))),
            ),
          ],
        ),
      );
      return;
    }
    final shape = DailyChallengeManager.todaysShape();
    final festivalTheme = DailyChallengeManager.todaysFestivalTheme();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(shape: shape, mode: GameMode.daily, theme: festivalTheme),
      ),
    ).then((_) => _loadData());
  }

  /// Navigates to the Culture Journey (story mode) screen.
  void _openStoryMode() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const StoryModeScreen()));
  }

  /// Generates a fresh random shape and starts a new Unlimited-mode game
  /// (play until lives run out).
  void _openUnlimited() {
    final shape = ShapeFactory.generate(targetCells: 10);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(shape: shape, mode: GameMode.unlimited),
      ),
    );
  }

  /// Opens the bottom sheet that lets the player quickly buy an extra life
  /// (via ad or coins) without leaving the home screen for the full
  /// Rewards screen.
  void _openLifeQuickBuy() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _LifeQuickBuySheet(
        bankedLives: _bankedLives,
        onChanged: _loadData,
        onOpenRewards: () {
          Navigator.pop(context);
          _openRewards();
        },
      ),
    );
  }

  /// Navigates to the level-select screen filtered to the given [d]ifficulty.
  void _openDifficulty(Difficulty d) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => LevelSelectScreen(difficulty: d)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 16),
                _buildTopBar(),
                const SizedBox(height: 16),
                const Text('🌸', style: TextStyle(fontSize: 70)),
                const SizedBox(height: 12),
                const Text(
                  'Maze Bloom',
                  style: TextStyle(
                    fontSize: 38,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  tr('পুরো শেপ একটানা path দিয়ে পূরণ করো', 'Trace the whole shape in one continuous path'),
                  style: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 14),
                ),
                if (_name != null && _name!.trim().isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Text(
                    '$_avatar ${tr('আবার দেখা হলো', 'Welcome back')}, ${_name!.trim()}!',
                    style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                ],
                const SizedBox(height: 36),

                _dailyChallengeCard(),
                const SizedBox(height: 14),

                _modeButton(
                  '🇧🇩 ${tr('সংস্কৃতির যাত্রা', 'Culture Journey')}',
                  tr('বাংলাদেশের রিকশা, ইলিশ, শাপলা ঘুরে আসো',
                      "Explore Bangladesh's rickshaws, hilsa, and water lilies"),
                  const [Color(0xFF26A69A), Color(0xFF00695C)],
                  _openStoryMode,
                ),
                const SizedBox(height: 14),

                _modeButton(
                  '♾️ ${tr('আনলিমিটেড মোড', 'Unlimited Mode')}',
                  tr('যতদূর পারো খেলো, লাইফ ফুরালে শেষ', 'Play as far as you can — ends when your lives run out'),
                  const [Color(0xFFFF7043), Color(0xFFFF5252)],
                  _openUnlimited,
                ),
                const SizedBox(height: 24),

                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    tr('লেভেল', 'Levels'),
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                ...Difficulty.values.map(
                  (d) => Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: _modeButton(
                      '${DifficultyConfig.emoji(d)} ${DifficultyConfig.label(d)}',
                      tr('অসীম সংখ্যক লেভেল', 'Endless levels'),
                      const [Color(0xFF7C4DFF), Color(0xFF448AFF)],
                      () => _openDifficulty(d),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Builds the top status bar: coin count, banked-lives counter (tap to
  /// quick-buy), avatar/profile shortcut, gallery shortcut, and rewards
  /// shortcut.
  Widget _buildTopBar() {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              const Text('🪙', style: TextStyle(fontSize: 16)),
              const SizedBox(width: 6),
              Text('$_coins', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: _openLifeQuickBuy,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Text('❤️', style: TextStyle(fontSize: 16)),
                const SizedBox(width: 6),
                Text('$_bankedLives', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                const SizedBox(width: 4),
                const Icon(Icons.add_circle, color: Colors.white70, size: 16),
              ],
            ),
          ),
        ),
        const Spacer(),
        GestureDetector(
          onTap: _openProfile,
          child: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: Text(_avatar, style: const TextStyle(fontSize: 18)),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: _openGallery,
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Text('🌺', style: TextStyle(fontSize: 18)),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: _openRewards,
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Text('🎁', style: TextStyle(fontSize: 18)),
          ),
        ),
      ],
    );
  }

  /// Builds the Daily Challenge card. Visual style (colors/icon/text)
  /// depends on whether today's challenge is completed and whether a
  /// festival theme is active for today.
  Widget _dailyChallengeCard() {
    final festival = DailyChallengeManager.todaysFestivalTheme();
    // আজকেরটা শেষ হয়ে গেলে — সোনালি "completed" look, না হলে festival/সবুজ gradient
    final doneColors = const [Color(0xFFFFD54F), Color(0xFFFF8F00)];
    final colors = _dailyDone ? doneColors : (festival?.colors ?? const [Color(0xFF4CAF50), Color(0xFF2E7D32)]);
    return GestureDetector(
      onTap: _openDailyChallenge,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: colors),
          borderRadius: BorderRadius.circular(18),
          border: _dailyDone ? Border.all(color: Colors.white.withOpacity(0.5), width: 1.5) : null,
          boxShadow: [
            BoxShadow(color: colors.first.withOpacity(0.45), blurRadius: 22, spreadRadius: _dailyDone ? 1 : 0),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(_dailyDone ? 0.25 : 0.15),
                shape: BoxShape.circle,
              ),
              child: Text(_dailyDone ? '🏆' : (festival?.emoji ?? '📅'), style: const TextStyle(fontSize: 26)),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        festival != null
                            ? tr('${festival.displayTitle} স্পেশাল!', '${festival.displayTitle} Special!')
                            : tr('দৈনিক চ্যালেঞ্জ', 'Daily Challenge'),
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      if (_dailyDone) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            tr('✓ সম্পন্ন', '✓ Done'),
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    _dailyDone
                        ? tr('🔥 $_streak দিনের streak — কালকে আবার আসো!', '🔥 $_streak day streak — come back tomorrow!')
                        : tr('🔥 $_streak দিনের streak — আজকে খেলো', '🔥 $_streak day streak — play today'),
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
            Icon(_dailyDone ? Icons.replay : Icons.chevron_right, color: Colors.white),
          ],
        ),
      ),
    );
  }

  /// Generic gradient button used for the various game-mode entry points
  /// (Culture Journey, Unlimited, each difficulty level) on the home screen.
  Widget _modeButton(String title, String subtitle, List<Color> colors, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 18),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: colors),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [BoxShadow(color: colors.first.withOpacity(0.4), blurRadius: 16)],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white),
          ],
        ),
      ),
    );
  }
}

// Home থেকেই সরাসরি extra life নেওয়ার ছোট quick-buy sheet — পুরো Rewards screen এ যেতে হয় না
/// Bottom sheet widget that lets the player quickly acquire an extra
/// "banked" life either by watching a rewarded ad or by spending coins,
/// without navigating away from the home screen.
class _LifeQuickBuySheet extends StatefulWidget {
  final int bankedLives;
  // called after a successful purchase to refresh parent state
  final VoidCallback onChanged;
  final VoidCallback onOpenRewards;

  const _LifeQuickBuySheet({
    required this.bankedLives,
    required this.onChanged,
    required this.onOpenRewards,
  });

  @override
  State<_LifeQuickBuySheet> createState() => _LifeQuickBuySheetState();
}

/// State for [_LifeQuickBuySheet]. Tracks the current coin cost for the
/// next life (which scales via [LivesManager]) and a busy flag while an ad
/// is loading/playing.
class _LifeQuickBuySheetState extends State<_LifeQuickBuySheet> {
  // fallback shown until the real cost loads
  int _lifeCoinCost = 150;
  // true while a rewarded ad is being requested/shown
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    LivesManager.getNextCoinCost().then((cost) {
      if (mounted) setState(() => _lifeCoinCost = cost);
    });
  }

  /// Shows a rewarded ad; on success grants a banked life and closes the
  /// sheet, on failure re-enables the button and surfaces the reason.
  Future<void> _watchAd() async {
    setState(() => _busy = true);
    AdService.showRewardedAd(
      onRewarded: () async {
        await LivesManager.addBankedLife();
        widget.onChanged();
        if (mounted) Navigator.pop(context);
      },
      onFailed: (reason) {
        if (mounted) {
          setState(() => _busy = false);
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(reason)));
        }
      },
    );
  }

  /// Validates the life bank isn't full and the player has enough coins,
  /// then spends coins, records the purchase (for cost scaling), grants a
  /// banked life, and closes the sheet.
  Future<void> _buyWithCoins() async {
    if (widget.bankedLives >= LivesManager.maxBankedLives) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('ব্যাংক পূর্ণ — আর লাইফ ধরে না', 'Bank is full — no room for more lives'))),
      );
      return;
    }
    final spent = await CoinManager.spendCoins(_lifeCoinCost);
    if (!spent) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
      );
      return;
    }
    await LivesManager.recordCoinPurchase();
    await LivesManager.addBankedLife();
    widget.onChanged();
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      decoration: const BoxDecoration(
        color: Color(0xFF1A1A2E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '❤️ ${tr('Extra Life নাও', 'Get an Extra Life')}',
            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          Text(
            tr('ব্যাংকে: ${widget.bankedLives} / ${LivesManager.maxBankedLives}',
                'Banked: ${widget.bankedLives} / ${LivesManager.maxBankedLives}'),
            style: const TextStyle(color: Colors.white60, fontSize: 12),
          ),
          const SizedBox(height: 20),
          GestureDetector(
            onTap: _busy ? null : _watchAd,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFFFB300), Color(0xFFFF8F00)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  tr('📺 বিজ্ঞাপন দেখে নাও', '📺 Watch an ad'),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: _buyWithCoins,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFEF5350), Color(0xFFB71C1C)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  tr('🪙 $_lifeCoinCost কয়েন দিয়ে নাও', '🪙 Buy for $_lifeCoinCost coins'),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: widget.onOpenRewards,
            child: Center(
              child: Text(
                tr('আরও সুবিধার জন্য Rewards দেখো ➜', 'See more perks in Rewards ➜'),
                style: const TextStyle(color: Colors.white54, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
