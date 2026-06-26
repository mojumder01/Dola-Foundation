import 'package:flutter/material.dart';
import '../utils/difficulty_config.dart';
import '../utils/daily_challenge_manager.dart';
import '../utils/shape_factory.dart';
import 'game_screen.dart';
import 'level_select_screen.dart';

// মূল মেনু — Levels (৩টা difficulty), Daily Challenge, Unlimited mode বেছে নেওয়ার জায়গা
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _dailyDone = false;
  int _streak = 0;

  @override
  void initState() {
    super.initState();
    _loadDailyStatus();
  }

  Future<void> _loadDailyStatus() async {
    final done = await DailyChallengeManager.isCompletedToday();
    final streak = await DailyChallengeManager.getStreak();
    setState(() {
      _dailyDone = done;
      _streak = streak;
    });
  }

  void _openDailyChallenge() {
    final shape = DailyChallengeManager.todaysShape();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(shape: shape, mode: GameMode.daily),
      ),
    ).then((_) => _loadDailyStatus());
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
                const SizedBox(height: 40),
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
                const Text(
                  'পুরো শেপ একটানা path দিয়ে পূরণ করো',
                  style: TextStyle(color: Color(0xFFB0BEC5), fontSize: 14),
                ),
                const SizedBox(height: 36),

                _dailyChallengeCard(),
                const SizedBox(height: 14),

                _modeButton(
                  '♾️ Unlimited Mode',
                  'যতদূর পারো খেলো, লাইফ ফুরালে শেষ',
                  const [Color(0xFFFF7043), Color(0xFFFF5252)],
                  _openUnlimited,
                ),
                const SizedBox(height: 24),

                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Levels',
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
                      '${DifficultyConfig.levelsPerDifficulty} টা লেভেল',
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

  Widget _dailyChallengeCard() {
    return GestureDetector(
      onTap: _openDailyChallenge,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF4CAF50), Color(0xFF2E7D32)]),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [BoxShadow(color: const Color(0xFF4CAF50).withOpacity(0.4), blurRadius: 20)],
        ),
        child: Row(
          children: [
            Text(_dailyDone ? '✅' : '📅', style: const TextStyle(fontSize: 28)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Daily Challenge',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                    _dailyDone ? 'আজকেরটা সমাধান হয়েছে! 🔥 $_streak দিনের streak' : '🔥 $_streak দিনের streak — আজকে খেলো',
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
