import 'package:flutter/material.dart';
import '../utils/question_generator.dart';
import '../utils/score_manager.dart';
import 'home_screen.dart';
import 'game_screen.dart';

// গেম শেষ হলে এই screen দেখায় — score, high score, retry option
class ResultScreen extends StatefulWidget {
  final int score;
  final Difficulty difficulty;
  final int totalQuestions;

  const ResultScreen({
    super.key,
    required this.score,
    required this.difficulty,
    required this.totalQuestions,
  });

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen>
    with SingleTickerProviderStateMixin {
  bool _isNewHighScore = false;

  // Score count-up animation — 0 থেকে final score পর্যন্ত বাড়বে
  late AnimationController _scoreController;
  late Animation<int> _scoreAnimation;

  @override
  void initState() {
    super.initState();

    // Score animation — 1.5 সেকেন্ডে 0 থেকে final score
    _scoreController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _scoreAnimation = IntTween(begin: 0, end: widget.score).animate(
      CurvedAnimation(parent: _scoreController, curve: Curves.easeOut),
    );

    // High score check করো তারপর animation চালু করো
    _checkAndSaveScore();
  }

  Future<void> _checkAndSaveScore() async {
    final isNew = await ScoreManager.saveIfHighScore(
      widget.difficulty,
      widget.score,
    );

    if (mounted) {
      setState(() => _isNewHighScore = isNew);
      _scoreController.forward(); // এখন animation শুরু করো
    }
  }

  @override
  void dispose() {
    _scoreController.dispose();
    super.dispose();
  }

  // Score এর ভিত্তিতে কতটা ভালো করেছো — emoji + message
  String get _performanceEmoji {
    final maxScore = widget.totalQuestions * 150; // max possible score
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

  // Difficulty এর বাংলা নাম
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

                // Performance emoji — বড় করে দেখাও
                Text(_performanceEmoji, style: const TextStyle(fontSize: 80)),

                const SizedBox(height: 16),

                // গেম শেষ লেখা
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

                const SizedBox(height: 32),

                // Score card
                _buildScoreCard(),

                const SizedBox(height: 24),

                // New High Score badge — নতুন record হলে দেখাবে
                if (_isNewHighScore) _buildNewHighScoreBadge(),

                const Spacer(),

                // Retry এবং Home button
                _buildActionButtons(context),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Main score display card
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

          // Animated score — 0 থেকে বাড়তে বাড়তে final score এ পৌঁছায়
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

          // Score breakdown — base + bonus
          _buildScoreBreakdown(),
        ],
      ),
    );
  }

  // Score এর হিসাব দেখাও
  Widget _buildScoreBreakdown() {
    // মোট score থেকে breakdown বের করা কঠিন (timer bonus মিলিয়ে আছে)
    // তাই শুধু total দেখাই
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
        Text(label, style: const TextStyle(color: Color(0xFF607D8B), fontSize: 11)),
      ],
    );
  }

  // New High Score badge — চকচকে দেখাবে
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

  // নিচের দুটো button
  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        // আবার খেলো — same difficulty তে
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
            // সব screen সরিয়ে শুধু home রাখো
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

  // Difficulty অনুযায়ী রং
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
