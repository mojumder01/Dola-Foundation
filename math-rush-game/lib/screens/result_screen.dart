import 'package:flutter/material.dart';
import '../utils/question_generator.dart';
import '../utils/score_manager.dart';
import 'home_screen.dart';
import 'game_screen.dart';

// গেম শেষ হলে এই screen দেখায় — score, coins earned, high score, retry option
class ResultScreen extends StatefulWidget {
  final int score;
  final Difficulty difficulty;
  final int totalQuestions;
  final int coinsEarned; // এই game এ মোট coins আয় (net — power-up খরচ বাদ)

  const ResultScreen({
    super.key,
    required this.score,
    required this.difficulty,
    required this.totalQuestions,
    required this.coinsEarned,
  });

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen>
    with SingleTickerProviderStateMixin {
  bool _isNewHighScore = false;

  // Score count-up animation
  late AnimationController _scoreController;
  late Animation<int> _scoreAnimation;

  @override
  void initState() {
    super.initState();

    _scoreController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _scoreAnimation = IntTween(begin: 0, end: widget.score).animate(
      CurvedAnimation(parent: _scoreController, curve: Curves.easeOut),
    );

    _checkAndSaveScore();
  }

  Future<void> _checkAndSaveScore() async {
    final isNew = await ScoreManager.saveIfHighScore(
      widget.difficulty,
      widget.score,
    );

    if (mounted) {
      setState(() => _isNewHighScore = isNew);
      _scoreController.forward();
    }
  }

  @override
  void dispose() {
    _scoreController.dispose();
    super.dispose();
  }

  String get _performanceEmoji {
    final maxScore = widget.totalQuestions * 150;
    final percent = widget.score / maxScore;

    if (percent >= 0.9) return '🏆';
    if (percent >= 0.7) return '🌟';
    if (percent >= 0.5) return '👍';
    if (percent >= 0.3) return '😅';
    return '💪';
  }

  String get _performanceMessage {
    final maxScore = widget.totalQuestions * 150;
    final percent = widget.score / maxScore;

    if (percent >= 0.9) return 'অসাধারণ! তুমি চ্যাম্পিয়ন!';
    if (percent >= 0.7) return 'দারুণ! খুব ভালো করেছো!';
    if (percent >= 0.5) return 'ভালো! আরো practice করো।';
    if (percent >= 0.3) return 'চেষ্টা করতে থাকো!';
    return 'পরেরবার আরো ভালো করবে!';
  }

  String get _difficultyName {
    switch (widget.difficulty) {
      case Difficulty.easy:
        return 'সহজ';
      case Difficulty.medium:
        return 'মাঝারি';
      case Difficulty.hard:
        return 'কঠিন';
    }
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
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const SizedBox(height: 20),

                Text(_performanceEmoji, style: const TextStyle(fontSize: 80)),

                const SizedBox(height: 16),

                const Text(
                  'গেম শেষ!',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  _performanceMessage,
                  style: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 16),
                ),

                const SizedBox(height: 28),

                // Score card
                _buildScoreCard(),

                const SizedBox(height: 16),

                // Coins earned this game
                _buildCoinsEarnedBadge(),

                const SizedBox(height: 12),

                // New high score badge
                if (_isNewHighScore) _buildNewHighScoreBadge(),

                const Spacer(),

                _buildActionButtons(context),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScoreCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.12)),
      ),
      child: Column(
        children: [
          const Text(
            'তোমার স্কোর',
            style: TextStyle(color: Color(0xFFB0BEC5), fontSize: 14),
          ),
          const SizedBox(height: 12),

          // Animated score count-up
          AnimatedBuilder(
            animation: _scoreAnimation,
            builder: (_, __) => Text(
              '${_scoreAnimation.value}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 72,
                fontWeight: FontWeight.w900,
                height: 1,
              ),
            ),
          ),

          const SizedBox(height: 8),

          // Difficulty badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: _difficultyColor().withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _difficultyColor()),
            ),
            child: Text(
              'কঠিনতা: $_difficultyName',
              style: TextStyle(
                color: _difficultyColor(),
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ),

          const SizedBox(height: 20),
          _buildScoreBreakdown(),
        ],
      ),
    );
  }

  Widget _buildScoreBreakdown() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _statItem('সর্বোচ্চ সম্ভব', '${widget.totalQuestions * 150}'),
        const SizedBox(width: 24),
        _statItem('তুমি পেয়েছ', '${widget.score}'),
        const SizedBox(width: 24),
        _statItem(
          'শতাংশ',
          '${((widget.score / (widget.totalQuestions * 150)) * 100).round()}%',
        ),
      ],
    );
  }

  Widget _statItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Color(0xFF607D8B), fontSize: 11),
        ),
      ],
    );
  }

  // এই গেমে কত coins আয় হলো
  Widget _buildCoinsEarnedBadge() {
    final isPositive = widget.coinsEarned > 0;
    final isNegative = widget.coinsEarned < 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.amber.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🪙', style: TextStyle(fontSize: 22)),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isPositive
                    ? '+${widget.coinsEarned} coins আয় করেছো!'
                    : isNegative
                        ? '${widget.coinsEarned} coins (power-up ব্যবহার করেছো)'
                        : 'এই গেমে coins সমান হয়েছে',
                style: TextStyle(
                  color: isPositive ? Colors.amber : const Color(0xFFB0BEC5),
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const Text(
                'প্রতি সঠিক উত্তরে 🪙1 • Ad দেখো 🪙15',
                style: TextStyle(color: Color(0xFF607D8B), fontSize: 11),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // New High Score badge
  Widget _buildNewHighScoreBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFD700), Color(0xFFFF8C00)],
        ),
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFD700).withOpacity(0.5),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('🏆', style: TextStyle(fontSize: 20)),
          SizedBox(width: 8),
          Text(
            'নতুন সর্বোচ্চ রেকর্ড!',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        // আবার খেলো
        GestureDetector(
          onTap: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => GameScreen(difficulty: widget.difficulty),
              ),
            );
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)],
              ),
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF7C4DFF).withOpacity(0.5),
                  blurRadius: 20,
                ),
              ],
            ),
            child: const Center(
              child: Text(
                '🔄 আবার খেলো',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),

        const SizedBox(height: 14),

        // Home screen এ ফিরে যাও
        GestureDetector(
          onTap: () {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (_) => const HomeScreen()),
              (_) => false,
            );
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: const Center(
              child: Text(
                '🏠 হোম এ ফিরে যাও',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Color _difficultyColor() {
    switch (widget.difficulty) {
      case Difficulty.easy:
        return const Color(0xFF4CAF50);
      case Difficulty.medium:
        return const Color(0xFFFFC107);
      case Difficulty.hard:
        return const Color(0xFFF44336);
    }
  }
}
