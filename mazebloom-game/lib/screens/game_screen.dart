import 'dart:math';
import 'package:flutter/material.dart';
import '../models/grid_shape.dart';
import '../utils/maze_generator.dart';
import '../widgets/maze_board.dart';

// মূল gameplay screen — শেপ দেখায়, drag করে path আঁকতে হয়
class GameScreen extends StatefulWidget {
  final GridShape shape;

  const GameScreen({super.key, required this.shape});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  static const int _startingLives = 3;

  List<Point<int>> _path = [];
  int _lives = _startingLives;
  Point<int>? _hintCell;
  bool _isSolvable = true; // shape generate করার সময়েই check হয়
  DateTime? _startTime; // speed bonus হিসাব করার জন্য (Part 4 এ কাজে লাগবে)

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now();

    // Shape টা আসলেই সমাধানযোগ্য কিনা যাচাই করো (load এর সময় একবার)
    final solution = MazeGenerator.findHamiltonianPath(widget.shape);
    _isSolvable = solution != null;
  }

  void _onPathChanged(List<Point<int>> newPath) {
    setState(() {
      _path = newPath;
      _hintCell = null; // নতুন move হলে আগের hint বাতিল
    });

    if (newPath.length == widget.shape.totalCells) {
      _showWinDialog();
    }
  }

  void _onStuck() {
    setState(() {
      _lives--;
    });

    if (_lives <= 0) {
      _showGameOverDialog();
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
      final solution = MazeGenerator.findHamiltonianPath(widget.shape);
      if (solution != null) {
        setState(() => _hintCell = solution.first);
      }
      return;
    }

    final visited = _path.toSet();
    final continuation = MazeGenerator.findContinuation(widget.shape, visited, _path.last);

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
    });
  }

  void _showWinDialog() {
    final elapsed = DateTime.now().difference(_startTime!).inSeconds;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('🎉 সমাধান হয়েছে!', style: TextStyle(color: Colors.white)),
        content: Text(
          'সময় লেগেছে: $elapsed সেকেন্ড',
          style: const TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('হোম এ ফিরো'),
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
        content: const Text(
          'আর কোনো লাইফ নেই। আবার শুরু করতে চাও?',
          style: TextStyle(color: Color(0xFFB0BEC5)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('হোম এ ফিরো'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _lives = _startingLives;
                _path = [];
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
                    shape: widget.shape,
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
                  '${_path.length} / ${widget.shape.totalCells} ঘর পূরণ হয়েছে',
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
