import 'dart:async';
import 'package:flutter/material.dart';
import '../models/question.dart';
import '../utils/question_generator.dart';
import '../utils/coin_manager.dart';
import 'result_screen.dart';

// মূল gameplay screen
class GameScreen extends StatefulWidget {
  final Difficulty difficulty;

  const GameScreen({super.key, required this.difficulty});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen>
    with SingleTickerProviderStateMixin {
  static const int _totalQuestions = 10;
  static const int _timePerQuestion = 10;

  // Power-up costs
  static const int _extraTimeCost = 5; // ⏰ +5 সেকেন্ড
  static const int _hintCost = 3;      // 💡 2টা ভুল option বাদ দেয়

  late List<Question> _questions;
  int _currentIndex = 0;
  int _score = 0;
  int _timeLeft = _timePerQuestion;
  Timer? _timer;
  int? _selectedOption;
  bool _answered = false;

  // Coin tracking
  int _coins = 0;
  int _coinsEarnedThisGame = 0; // গেমে মোট কত coins আয় হলো

  // Hint state — কোন options eliminate হয়েছে
  final Set<int> _eliminatedOptions = {};
  bool _hintUsedThisQuestion = false;

  // উত্তরের feedback animation
  late AnimationController _feedbackController;
  late Animation<double> _feedbackAnimation;

  @override
  void initState() {
    super.initState();
    _questions = QuestionGenerator.generateSet(widget.difficulty);

    _feedbackController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _feedbackAnimation = Tween<double>(begin: 1, end: 1.05).animate(
      CurvedAnimation(parent: _feedbackController, curve: Curves.easeOut),
    );

    _loadCoins();
    _startTimer();
  }

  Future<void> _loadCoins() async {
    final coins = await CoinManager.getCoins();
    if (mounted) setState(() => _coins = coins);
  }

  void _startTimer() {
    _timer?.cancel();
    _timeLeft = _timePerQuestion;

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      setState(() {
        if (_timeLeft > 0) {
          _timeLeft--;
        } else {
          timer.cancel();
          _handleTimeout();
        }
      });
    });
  }

  void _handleTimeout() {
    if (_answered) return;
    setState(() {
      _answered = true;
      _selectedOption = null;
    });
    Future.delayed(const Duration(milliseconds: 800), _nextQuestion);
  }

  void _handleAnswer(int chosen) {
    if (_answered) return;
    if (_eliminatedOptions.contains(chosen)) return; // Hint এ বাদ দেওয়া option

    _timer?.cancel();

    final current = _questions[_currentIndex];
    final isCorrect = chosen == current.correctAnswer;

    setState(() {
      _answered = true;
      _selectedOption = chosen;
      if (isCorrect) {
        _score += 100 + (_timeLeft * 5);
        _feedbackController.forward(from: 0);

        // প্রতি সঠিক উত্তরে 1 coin আয়
        _coinsEarnedThisGame += 1;
        _coins += 1;
      }
    });

    if (isCorrect) {
      // Coin সেভ করো (background এ)
      CoinManager.addCoins(1);
    }

    Future.delayed(const Duration(milliseconds: 800), _nextQuestion);
  }

  // ⏰ Power-up: +5 সেকেন্ড যোগ করো
  Future<void> _useExtraTime() async {
    if (_answered || _coins < _extraTimeCost) return;

    final spent = await CoinManager.spendCoins(_extraTimeCost);
    if (!spent || !mounted) return;

    setState(() {
      _coins -= _extraTimeCost;
      _coinsEarnedThisGame -= _extraTimeCost; // net earnings থেকে বাদ দাও
      _timeLeft = (_timeLeft + 5).clamp(0, 30); // max 30 সেকেন্ড
    });

    // Snackbar feedback
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('⏰ +5 সেকেন্ড যোগ হয়েছে!'),
        backgroundColor: const Color(0xFF7C4DFF),
        duration: const Duration(seconds: 1),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  // 💡 Power-up: ২টা ভুল option বাদ দাও
  Future<void> _useHint() async {
    if (_answered || _hintUsedThisQuestion || _coins < _hintCost) return;

    final current = _questions[_currentIndex];
    final spent = await CoinManager.spendCoins(_hintCost);
    if (!spent || !mounted) return;

    // সঠিক ছাড়া ২টা ভুল option বেছে নাও
    final wrongOptions = current.options
        .where((o) => o != current.correctAnswer)
        .take(2)
        .toSet();

    setState(() {
      _coins -= _hintCost;
      _coinsEarnedThisGame -= _hintCost;
      _eliminatedOptions.addAll(wrongOptions);
      _hintUsedThisQuestion = true;
    });
  }

  void _nextQuestion() {
    if (!mounted) return;

    if (_currentIndex + 1 >= _totalQuestions) {
      _goToResult();
      return;
    }

    setState(() {
      _currentIndex++;
      _answered = false;
      _selectedOption = null;
      _eliminatedOptions.clear();
      _hintUsedThisQuestion = false;
    });

    _startTimer();
  }

  void _goToResult() {
    _timer?.cancel();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => ResultScreen(
          score: _score,
          difficulty: widget.difficulty,
          totalQuestions: _totalQuestions,
          coinsEarned: _coinsEarnedThisGame,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final current = _questions[_currentIndex];

    final timerColor = _timeLeft <= 3
        ? const Color(0xFFF44336)
        : _timeLeft <= 5
            ? const Color(0xFFFFC107)
            : const Color(0xFF4CAF50);

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
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                _buildTopBar(),
                const SizedBox(height: 16),
                _buildTimerSection(timerColor),
                const SizedBox(height: 16),

                // Power-up buttons
                _buildPowerUps(),

                const SizedBox(height: 20),

                // প্রশ্নের card
                _buildQuestionCard(current),

                const SizedBox(height: 24),

                // ৪টা উত্তরের option
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 14,
                    crossAxisSpacing: 14,
                    childAspectRatio: 2.5,
                    physics: const NeverScrollableScrollPhysics(),
                    children: current.options
                        .map((opt) => _buildOptionButton(opt, current))
                        .toList(),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // উপরের bar — quit, question counter, score + coin balance
  Widget _buildTopBar() {
    return Row(
      children: [
        GestureDetector(
          onTap: _showQuitDialog,
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.close, color: Colors.white, size: 20),
          ),
        ),

        const Spacer(),

        Text(
          '${_currentIndex + 1} / $_totalQuestions',
          style: const TextStyle(
            color: Color(0xFFB0BEC5),
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),

        const Spacer(),

        // Score
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)],
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            '⭐ $_score',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
        ),

        const SizedBox(width: 8),

        // Coin balance
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            color: Colors.amber.withOpacity(0.15),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.amber.withOpacity(0.5)),
          ),
          child: Text(
            '🪙 $_coins',
            style: const TextStyle(
              color: Colors.amber,
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
        ),
      ],
    );
  }

  // Timer bar
  Widget _buildTimerSection(Color color) {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: LinearProgressIndicator(
            value: _timeLeft / _timePerQuestion,
            minHeight: 8,
            backgroundColor: Colors.white.withOpacity(0.1),
            valueColor: AlwaysStoppedAnimation(color),
          ),
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '⏱ $_timeLeft সেকেন্ড বাকি',
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
            Text(
              'সঠিক হলে +${100 + (_timeLeft * 5)} pts + 🪙1',
              style: TextStyle(color: color.withOpacity(0.7), fontSize: 11),
            ),
          ],
        ),
      ],
    );
  }

  // Power-up buttons row
  Widget _buildPowerUps() {
    final canExtraTime = !_answered && _coins >= _extraTimeCost;
    final canHint = !_answered && !_hintUsedThisQuestion && _coins >= _hintCost;

    return Row(
      children: [
        // ⏰ Extra Time
        Expanded(
          child: _powerUpButton(
            emoji: '⏰',
            label: '+5 সেকেন্ড',
            cost: _extraTimeCost,
            enabled: canExtraTime,
            onTap: _useExtraTime,
            color: const Color(0xFF7C4DFF),
          ),
        ),
        const SizedBox(width: 12),
        // 💡 Hint
        Expanded(
          child: _powerUpButton(
            emoji: '💡',
            label: 'Hint',
            cost: _hintCost,
            enabled: canHint,
            onTap: _useHint,
            color: const Color(0xFF00BFA5),
          ),
        ),
      ],
    );
  }

  Widget _powerUpButton({
    required String emoji,
    required String label,
    required int cost,
    required bool enabled,
    required VoidCallback onTap,
    required Color color,
  }) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: enabled ? color.withOpacity(0.15) : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: enabled ? color.withOpacity(0.6) : Colors.white.withOpacity(0.1),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(emoji, style: TextStyle(fontSize: 16, color: enabled ? null : const Color(0x44ffffff))),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: enabled ? Colors.white : Colors.white38,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              '🪙$cost',
              style: TextStyle(
                color: enabled ? Colors.amber : Colors.amber.withOpacity(0.3),
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // প্রশ্নের card
  Widget _buildQuestionCard(Question question) {
    return ScaleTransition(
      scale: _feedbackAnimation,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 24),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
        ),
        child: Text(
          question.questionText,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 44,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
          ),
        ),
      ),
    );
  }

  // একটা উত্তরের বাটন
  Widget _buildOptionButton(int option, Question question) {
    final isSelected = _selectedOption == option;
    final isCorrect = option == question.correctAnswer;
    final isEliminated = _eliminatedOptions.contains(option);

    Color bgColor;
    Color borderColor;

    if (isEliminated) {
      // Hint এ বাদ দেওয়া — স্পষ্টভাবে disabled
      bgColor = Colors.white.withOpacity(0.03);
      borderColor = Colors.white.withOpacity(0.07);
    } else if (!_answered) {
      bgColor = Colors.white.withOpacity(0.08);
      borderColor = Colors.white.withOpacity(0.2);
    } else if (isCorrect) {
      bgColor = const Color(0xFF4CAF50).withOpacity(0.3);
      borderColor = const Color(0xFF4CAF50);
    } else if (isSelected) {
      bgColor = const Color(0xFFF44336).withOpacity(0.3);
      borderColor = const Color(0xFFF44336);
    } else {
      bgColor = Colors.white.withOpacity(0.04);
      borderColor = Colors.white.withOpacity(0.1);
    }

    return GestureDetector(
      onTap: () => _handleAnswer(option),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: 2),
        ),
        child: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (isEliminated)
                const Text('✗ ', style: TextStyle(color: Colors.white24, fontSize: 18)),
              if (_answered && isCorrect)
                const Text('✓ ', style: TextStyle(color: Color(0xFF4CAF50), fontSize: 20)),
              if (_answered && isSelected && !isCorrect)
                const Text('✗ ', style: TextStyle(color: Color(0xFFF44336), fontSize: 20)),
              Text(
                '$option',
                style: TextStyle(
                  color: isEliminated
                      ? Colors.white24
                      : _answered && !isCorrect && !isSelected
                          ? Colors.white.withOpacity(0.4)
                          : Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // গেম ছেড়ে যাওয়ার confirm dialog
  void _showQuitDialog() {
    _timer?.cancel();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('গেম ছেড়ে যাবে?', style: TextStyle(color: Colors.white)),
        content: const Text(
          'এখন বের হলে স্কোর সেভ হবে না।',
          style: TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _startTimer();
            },
            child: const Text('না, খেলবো'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text(
              'হ্যাঁ, বের হবো',
              style: TextStyle(color: Color(0xFFF44336)),
            ),
          ),
        ],
      ),
    );
  }
}
