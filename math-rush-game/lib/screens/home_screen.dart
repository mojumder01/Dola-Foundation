import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/question_generator.dart';
import '../utils/score_manager.dart';
import 'game_screen.dart';

// প্রথম screen — গেম শুরুর আগে যেটা দেখা যায়
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  // Default difficulty easy — পরে user change করতে পারবে
  Difficulty _selectedDifficulty = Difficulty.easy;

  // তিনটা difficulty এর high score
  int _easyHigh = 0;
  int _mediumHigh = 0;
  int _hardHigh = 0;

  // Title animation এর জন্য controller
  late AnimationController _titleController;
  late Animation<double> _titleAnimation;

  @override
  void initState() {
    super.initState();

    // Title bounce animation setup
    _titleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true); // বারবার up-down করবে

    _titleAnimation = Tween<double>(begin: 0, end: -10).animate(
      CurvedAnimation(parent: _titleController, curve: Curves.easeInOut),
    );

    // Phone থেকে saved score load করো
    _loadScores();
  }

  // সব difficulty এর high score একসাথে load করো
  Future<void> _loadScores() async {
    final easy = await ScoreManager.getHighScore(Difficulty.easy);
    final medium = await ScoreManager.getHighScore(Difficulty.medium);
    final hard = await ScoreManager.getHighScore(Difficulty.hard);

    // setState দিলে Flutter UI আবার build করে, নতুন data দেখায়
    setState(() {
      _easyHigh = easy;
      _mediumHigh = medium;
      _hardHigh = hard;
    });
  }

  @override
  void dispose() {
    // Screen বন্ধ হলে animation controller মেমোরি থেকে মুছো
    _titleController.dispose();
    super.dispose();
  }

  // Game screen এ যাও, শেষে ফিরে এলে score reload করো
  Future<void> _startGame() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(difficulty: _selectedDifficulty),
      ),
    );

    // গেম শেষে ফিরে এলে new high score থাকতে পারে
    _loadScores();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Gradient background — dark purple to dark blue
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 40),

                // Animated title
                AnimatedBuilder(
                  animation: _titleAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, _titleAnimation.value),
                      child: child,
                    );
                  },
                  child: Column(
                    children: [
                      // গেমের emoji logo
                      const Text(
                        '🧮',
                        style: TextStyle(fontSize: 70),
                      ),
                      const SizedBox(height: 12),
                      // গেমের নাম
                      const Text(
                        'Math Rush',
                        style: TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                      const Text(
                        'গণিত চ্যালেঞ্জ',
                        style: TextStyle(
                          fontSize: 16,
                          color: Color(0xFFB0BEC5),
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 40),

                // High Score Card
                _buildHighScoreCard(),

                const SizedBox(height: 32),

                // Difficulty selector
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'কঠিনতা বেছে নাও',
                    style: TextStyle(
                      color: Color(0xFFB0BEC5),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                _buildDifficultySelector(),

                const SizedBox(height: 40),

                // Start Game button
                _buildStartButton(),

                const Spacer(),

                // Footer info
                const Text(
                  '১০টি প্রশ্ন • সময়সীমা ১০ সেকেন্ড • সর্বোচ্চ ১৫০০ পয়েন্ট',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF607D8B), fontSize: 12),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // তিনটা difficulty এর best score একটা card এ দেখাও
  Widget _buildHighScoreCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        // Glass effect — background এর উপর আবছা card
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          const Text(
            '🏆 সর্বোচ্চ স্কোর',
            style: TextStyle(
              color: Colors.amber,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _scoreColumn('সহজ', _easyHigh, const Color(0xFF4CAF50)),
              _divider(),
              _scoreColumn('মাঝারি', _mediumHigh, const Color(0xFFFFC107)),
              _divider(),
              _scoreColumn('কঠিন', _hardHigh, const Color(0xFFF44336)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _scoreColumn(String label, int score, Color color) {
    return Column(
      children: [
        Text(
          '$score',
          style: TextStyle(
            color: color,
            fontSize: 26,
            fontWeight: FontWeight.w900,
          ),
        ),
        Text(label, style: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 12)),
      ],
    );
  }

  Widget _divider() {
    return Container(width: 1, height: 40, color: Colors.white.withOpacity(0.2));
  }

  // তিনটা difficulty button
  Widget _buildDifficultySelector() {
    return Row(
      children: [
        _difficultyButton('সহজ', Difficulty.easy, const Color(0xFF4CAF50)),
        const SizedBox(width: 12),
        _difficultyButton('মাঝারি', Difficulty.medium, const Color(0xFFFFC107)),
        const SizedBox(width: 12),
        _difficultyButton('কঠিন', Difficulty.hard, const Color(0xFFF44336)),
      ],
    );
  }

  Widget _difficultyButton(String label, Difficulty diff, Color color) {
    final isSelected = _selectedDifficulty == diff;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedDifficulty = diff),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            // Selected হলে solid, না হলে transparent
            color: isSelected ? color : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : color,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // বড় Start বাটন
  Widget _buildStartButton() {
    return GestureDetector(
      onTap: _startGame,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          // Purple gradient button
          gradient: const LinearGradient(
            colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)],
          ),
          borderRadius: BorderRadius.circular(18),
          // Glow effect
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF7C4DFF).withOpacity(0.5),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.play_arrow_rounded, color: Colors.white, size: 28),
            SizedBox(width: 8),
            Text(
              'খেলা শুরু করো',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
