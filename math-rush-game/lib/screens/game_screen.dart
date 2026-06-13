import 'dart:async';
import 'package:flutter/material.dart';
import '../models/question.dart';
import '../utils/question_generator.dart';
import 'result_screen.dart';

// মূল gameplay screen — এখানেই প্রশ্ন দেখায় আর উত্তর দেওয়া যায়
class GameScreen extends StatefulWidget {
  final Difficulty difficulty;

  const GameScreen({super.key, required this.difficulty});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen>
    with SingleTickerProviderStateMixin {
  // মোট ১০টা প্রশ্ন প্রতি গেমে
  static const int _totalQuestions = 10;

  // প্রতি প্রশ্নে ১০ সেকেন্ড সময়
  static const int _timePerQuestion = 10;

  late List<Question> _questions; // গেমের সব প্রশ্ন
  int _currentIndex = 0; // এখন কোন প্রশ্নে আছি
  int _score = 0; // মোট স্কোর
  int _timeLeft = _timePerQuestion; // বাকি সময়
  Timer? _timer; // countdown timer
  int? _selectedOption; // user কোনটায় tap করেছে
  bool _answered = false; // এই প্রশ্নের উত্তর দেওয়া হয়েছে কিনা

  // উত্তর দেওয়ার পর ঠিক/ভুলের animation
  late AnimationController _feedbackController;
  late Animation<double> _feedbackAnimation;

  @override
  void initState() {
    super.initState();

    // Difficulty অনুযায়ী ১০টা প্রশ্ন বানাও
    _questions = QuestionGenerator.generateSet(widget.difficulty);

    // Feedback animation — সঠিক/ভুল হলে screen একটু pulse করবে
    _feedbackController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _feedbackAnimation = Tween<double>(begin: 1, end: 1.05).animate(
      CurvedAnimation(parent: _feedbackController, curve: Curves.easeOut),
    );

    // প্রথম প্রশ্নের timer শুরু করো
    _startTimer();
  }

  // প্রতি সেকেন্ডে timer কমাও
  void _startTimer() {
    _timer?.cancel(); // আগের timer থাকলে বন্ধ করো
    _timeLeft = _timePerQuestion;

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return; // Screen বন্ধ হয়ে গেলে কিছু করো না

      setState(() {
        if (_timeLeft > 0) {
          _timeLeft--;
        } else {
          // সময় শেষ — উত্তর দেয়নি, পরের প্রশ্নে যাও
          timer.cancel();
          _handleTimeout();
        }
      });
    });
  }

  // সময় শেষ হলে — ভুল হিসেবে ধরো, পরের প্রশ্নে যাও
  void _handleTimeout() {
    if (_answered) return; // ইতোমধ্যে উত্তর দিলে কিছু করো না
    setState(() {
      _answered = true;
      _selectedOption = null; // কোনো selection নেই
    });

    // ১ সেকেন্ড দেখাও তারপর পরের প্রশ্ন
    Future.delayed(const Duration(milliseconds: 800), _nextQuestion);
  }

  // User কোনো option এ tap করলে
  void _handleAnswer(int chosen) {
    if (_answered) return; // একবার উত্তর দিলে আর নেওয়া হবে না

    _timer?.cancel(); // Timer বন্ধ করো

    final current = _questions[_currentIndex];
    final isCorrect = chosen == current.correctAnswer;

    setState(() {
      _answered = true;
      _selectedOption = chosen;

      if (isCorrect) {
        // সঠিক উত্তরে base score + সময়ের bonus
        // বেশি দ্রুত উত্তর দিলে বেশি পয়েন্ট
        _score += 100 + (_timeLeft * 5);
        _feedbackController.forward(from: 0); // pulse animation
      }
    });

    // ৮০০ms পরে পরের প্রশ্নে যাও
    Future.delayed(const Duration(milliseconds: 800), _nextQuestion);
  }

  // পরের প্রশ্নে যাও অথবা গেম শেষ করো
  void _nextQuestion() {
    if (!mounted) return;

    if (_currentIndex + 1 >= _totalQuestions) {
      // সব প্রশ্ন শেষ — result screen এ যাও
      _goToResult();
      return;
    }

    setState(() {
      _currentIndex++;
      _answered = false;
      _selectedOption = null;
    });

    _startTimer(); // নতুন প্রশ্নের জন্য timer reset
  }

  // Result screen এ navigate করো
  void _goToResult() {
    _timer?.cancel();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => ResultScreen(
          score: _score,
          difficulty: widget.difficulty,
          totalQuestions: _totalQuestions,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel(); // Screen বন্ধ হলে timer leak করা ঠিক না
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final current = _questions[_currentIndex];

    // Timer এর রং — সময় কম হলে লাল হয়ে যাবে (danger বোঝাতে)
    final timerColor = _timeLeft <= 3
        ? const Color(0xFFF44336) // লাল
        : _timeLeft <= 5
            ? const Color(0xFFFFC107) // হলুদ
            : const Color(0xFF4CAF50); // সবুজ

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
                // Top bar — score, question counter, quit button
                _buildTopBar(),

                const SizedBox(height: 24),

                // Timer + progress bar
                _buildTimerSection(timerColor),

                const SizedBox(height: 32),

                // প্রশ্ন দেখানোর card
                _buildQuestionCard(current),

                const SizedBox(height: 32),

                // ৪টা উত্তরের option
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
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

  // উপরের bar — score, question number, back button
  Widget _buildTopBar() {
    return Row(
      children: [
        // Quit button
        GestureDetector(
          onTap: () => _showQuitDialog(),
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

        // প্রশ্ন কতটা হলো
        Text(
          '${_currentIndex + 1} / $_totalQuestions',
          style: const TextStyle(
            color: Color(0xFFB0BEC5),
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),

        const Spacer(),

        // স্কোর
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)],
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '⭐ $_score',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ),
      ],
    );
  }

  // গোল timer + progress bar
  Widget _buildTimerSection(Color color) {
    return Column(
      children: [
        // Progress bar — সময় কমলে bar ছোট হয়
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: LinearProgressIndicator(
            value: _timeLeft / _timePerQuestion,
            minHeight: 8,
            backgroundColor: Colors.white.withOpacity(0.1),
            valueColor: AlwaysStoppedAnimation(color),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '⏱ $_timeLeft সেকেন্ড বাকি',
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            Text(
              'সঠিক হলে +${100 + (_timeLeft * 5)} pts',
              style: TextStyle(color: color.withOpacity(0.7), fontSize: 12),
            ),
          ],
        ),
      ],
    );
  }

  // প্রশ্নের card
  Widget _buildQuestionCard(Question question) {
    return ScaleTransition(
      scale: _feedbackAnimation,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
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
    // এই button এর state কি?
    final isSelected = _selectedOption == option;
    final isCorrect = option == question.correctAnswer;

    Color bgColor;
    Color borderColor;

    if (!_answered) {
      // এখনো উত্তর দেয়নি — default style
      bgColor = Colors.white.withOpacity(0.08);
      borderColor = Colors.white.withOpacity(0.2);
    } else if (isCorrect) {
      // সঠিক উত্তর — সবুজ
      bgColor = const Color(0xFF4CAF50).withOpacity(0.3);
      borderColor = const Color(0xFF4CAF50);
    } else if (isSelected) {
      // ভুল উত্তরে tap করেছে — লাল
      bgColor = const Color(0xFFF44336).withOpacity(0.3);
      borderColor = const Color(0xFFF44336);
    } else {
      // অন্য ভুল option — fade করে দাও
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
              // সঠিক/ভুলের icon উত্তর দেওয়ার পর দেখাও
              if (_answered && isCorrect)
                const Text('✓ ', style: TextStyle(color: Color(0xFF4CAF50), fontSize: 20)),
              if (_answered && isSelected && !isCorrect)
                const Text('✗ ', style: TextStyle(color: Color(0xFFF44336), fontSize: 20)),
              Text(
                '$option',
                style: TextStyle(
                  color: _answered && !isCorrect && !isSelected
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
    _timer?.cancel(); // Dialog open হলে timer pause করো

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
              // Dialog বন্ধ করো, timer আবার চালু করো
              Navigator.pop(context);
              _startTimer();
            },
            child: const Text('না, খেলবো'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // dialog বন্ধ
              Navigator.pop(context); // game screen বন্ধ
            },
            child: const Text('হ্যাঁ, বের হবো', style: TextStyle(color: Color(0xFFF44336))),
          ),
        ],
      ),
    );
  }
}
