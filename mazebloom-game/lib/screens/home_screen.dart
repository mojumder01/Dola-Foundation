import 'package:flutter/material.dart';
import '../utils/difficulty_config.dart';
import '../utils/daily_challenge_manager.dart';
import '../utils/shape_factory.dart';
import '../utils/coin_manager.dart';
import '../utils/app_language.dart';
import '../utils/profile_manager.dart';
import 'game_screen.dart';
import 'level_select_screen.dart';
import 'story_mode_screen.dart';
import 'gallery_screen.dart';
import 'rewards_screen.dart';
import 'profile_screen.dart';

// মূল মেনু — Levels (৩টা difficulty), Daily Challenge, Unlimited mode বেছে নেওয়ার জায়গা
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _dailyDone = false;
  int _streak = 0;
  int _coins = 0;
  String _avatar = ProfileManager.defaultAvatar;
  String? _name;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final done = await DailyChallengeManager.isCompletedToday();
    final streak = await DailyChallengeManager.getStreak();
    final coins = await CoinManager.getCoins();
    final avatar = await ProfileManager.getAvatar();
    final name = await ProfileManager.getName();
    setState(() {
      _dailyDone = done;
      _streak = streak;
      _coins = coins;
      _avatar = avatar;
      _name = name;
    });
  }

  void _openGallery() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const GalleryScreen())).then((_) => _loadData());
  }

  void _openRewards() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const RewardsScreen())).then((_) => _loadData());
  }

  void _openProfile() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())).then((_) => _loadData());
  }

  void _openDailyChallenge() {
    final shape = DailyChallengeManager.todaysShape();
    final festivalTheme = DailyChallengeManager.todaysFestivalTheme();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(shape: shape, mode: GameMode.daily, theme: festivalTheme),
      ),
    ).then((_) => _loadData());
  }

  void _openStoryMode() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const StoryModeScreen()));
  }

  void _openUnlimited() {
    final shape = ShapeFactory.generate(targetCells: 10);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(shape: shape, mode: GameMode.unlimited),
      ),
    );
  }

  void _openDifficulty(Difficulty d) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => LevelSelectScreen(difficulty: d)),
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
          onTap: () {
            AppLanguage.instance.toggle();
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(
              AppLanguage.instance.isBangla ? 'বাং' : 'EN',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
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

  Widget _dailyChallengeCard() {
    final festival = DailyChallengeManager.todaysFestivalTheme();
    return GestureDetector(
      onTap: _openDailyChallenge,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: festival?.colors ?? const [Color(0xFF4CAF50), Color(0xFF2E7D32)],
          ),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: (festival?.colors.first ?? const Color(0xFF4CAF50)).withOpacity(0.4),
              blurRadius: 20,
            ),
          ],
        ),
        child: Row(
          children: [
            Text(_dailyDone ? '✅' : (festival?.emoji ?? '📅'), style: const TextStyle(fontSize: 28)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    festival != null
                        ? tr('${festival.displayTitle} স্পেশাল!', '${festival.displayTitle} Special!')
                        : tr('দৈনিক চ্যালেঞ্জ', 'Daily Challenge'),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                    _dailyDone
                        ? tr('আজকেরটা সমাধান হয়েছে! 🔥 $_streak দিনের streak', "Today's done! 🔥 $_streak day streak")
                        : tr('🔥 $_streak দিনের streak — আজকে খেলো', '🔥 $_streak day streak — play today'),
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white),
          ],
        ),
      ),
    );
  }

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
