import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/grid_shape.dart';

// মূল গেমবোর্ড — শেপ দেখায়, আঙুল দিয়ে drag করে path আঁকা যায়
class MazeBoard extends StatefulWidget {
  final GridShape shape;
  final List<Point<int>> path; // বর্তমান traced path (parent থেকে আসে)
  final Point<int>? hintCell; // hint হিসেবে highlight করার cell
  final void Function(List<Point<int>> newPath) onPathChanged;
  final void Function() onStuck; // dead-end এ পড়লে — life কমাতে হবে
  final Color pathColor;
  final Color cellColor;

  const MazeBoard({
    super.key,
    required this.shape,
    required this.path,
    required this.onPathChanged,
    required this.onStuck,
    this.hintCell,
    this.pathColor = const Color(0xFF7C4DFF),
    this.cellColor = const Color(0xFF1E1E3A),
  });

  @override
  State<MazeBoard> createState() => _MazeBoardState();
}

class _MazeBoardState extends State<MazeBoard> with SingleTickerProviderStateMixin {
  double _cellSize = 0;
  Offset _boardOffset = Offset.zero; // shape কে center করার জন্য padding
  late final AnimationController _hintPulse;

  @override
  void initState() {
    super.initState();
    _hintPulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 700))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _hintPulse.dispose();
    super.dispose();
  }

  // আঙুলের position থেকে কোন grid cell এ আছে বের করো
  Point<int>? _cellFromOffset(Offset local) {
    if (_cellSize <= 0) return null;
    final adjusted = local - _boardOffset;
    final col = (adjusted.dx / _cellSize).floor();
    final row = (adjusted.dy / _cellSize).floor();
    if (row < 0 || col < 0 || row >= widget.shape.rows || col >= widget.shape.cols) {
      return null;
    }
    final p = Point(row, col);
    return widget.shape.contains(p) ? p : null;
  }

  bool _isAdjacent(Point<int> a, Point<int> b) {
    final dr = (a.x - b.x).abs();
    final dc = (a.y - b.y).abs();
    return (dr + dc) == 1;
  }

  // নতুন cell এ touch/drag হলে কী হবে তার সব লজিক এখানে
  void _handleTouch(Offset local) {
    final cell = _cellFromOffset(local);
    if (cell == null) return;

    final path = List<Point<int>>.from(widget.path);

    if (path.isEmpty) {
      // প্রথম touch — path শুরু করো
      widget.onPathChanged([cell]);
      return;
    }

    if (cell == path.last) return; // একই cell এ আছে, কিছু করার নেই

    // আগের cell এ ফিরে গেলে — backtrack (undo) হিসেবে ধরো
    if (path.length >= 2 && cell == path[path.length - 2]) {
      path.removeLast();
      widget.onPathChanged(path);
      return;
    }

    // path এর মধ্যে আগের কোনো cell ধরলে — সেই পর্যন্ত truncate করো
    final idx = path.indexOf(cell);
    if (idx != -1) {
      widget.onPathChanged(path.sublist(0, idx + 1));
      return;
    }

    // নতুন cell — adjacent এবং আগে visit করা হয়নি হলে যুক্ত করো
    if (_isAdjacent(cell, path.last) && !path.contains(cell)) {
      path.add(cell);
      widget.onPathChanged(path);
      HapticFeedback.selectionClick(); // প্রতিটা নতুন cell এ ছোট vibration feedback

      // সম্পূর্ণ হয়ে গেলে আর check করার দরকার নেই
      if (path.length == widget.shape.totalCells) {
        HapticFeedback.mediumImpact();
        return;
      }

      // নতুন end cell থেকে কোনো unvisited neighbor আছে কিনা — না থাকলে dead-end
      final hasMove = _neighbors(cell).any(
        (n) => widget.shape.contains(n) && !path.contains(n),
      );
      if (!hasMove) {
        HapticFeedback.heavyImpact();
        widget.onStuck();
      }
    }
  }

  List<Point<int>> _neighbors(Point<int> p) => [
        Point(p.x - 1, p.y),
        Point(p.x + 1, p.y),
        Point(p.x, p.y - 1),
        Point(p.x, p.y + 1),
      ];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Cell size — শেপ এর rows/cols অনুযায়ী যতটা জায়গায় ফিট হয়
        final maxW = constraints.maxWidth;
        final maxH = constraints.maxHeight;
        _cellSize = min(maxW / widget.shape.cols, maxH / widget.shape.rows);

        final boardW = _cellSize * widget.shape.cols;
        final boardH = _cellSize * widget.shape.rows;
        _boardOffset = Offset((maxW - boardW) / 2, (maxH - boardH) / 2);

        // panEnabled: false রাখায় এক-আঙুলের drag trace করার জন্য child এ চলে যায়,
        // আর দুই-আঙুলের pinch gesture zoom এর জন্য InteractiveViewer ধরে নেয়
        return InteractiveViewer(
          panEnabled: false,
          scaleEnabled: true,
          minScale: 1.0,
          maxScale: 2.5,
          child: GestureDetector(
            onPanStart: (details) => _handleTouch(details.localPosition),
            onPanUpdate: (details) => _handleTouch(details.localPosition),
            child: AnimatedBuilder(
              animation: _hintPulse,
              builder: (context, _) => CustomPaint(
                size: Size(maxW, maxH),
                painter: _MazePainter(
                  shape: widget.shape,
                  path: widget.path,
                  cellSize: _cellSize,
                  boardOffset: _boardOffset,
                  hintCell: widget.hintCell,
                  hintPulse: _hintPulse.value,
                  pathColor: widget.pathColor,
                  cellColor: widget.cellColor,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

// Grid cell এবং আঁকা path draw করার painter
class _MazePainter extends CustomPainter {
  final GridShape shape;
  final List<Point<int>> path;
  final double cellSize;
  final Offset boardOffset;
  final Point<int>? hintCell;
  final double hintPulse; // 0.0–1.0, animation এর বর্তমান মান
  final Color pathColor;
  final Color cellColor;

  _MazePainter({
    required this.shape,
    required this.path,
    required this.cellSize,
    required this.boardOffset,
    required this.hintPulse,
    required this.pathColor,
    required this.cellColor,
    this.hintCell,
  });

  Offset _centerOf(Point<int> p) => Offset(
        boardOffset.dx + p.y * cellSize + cellSize / 2,
        boardOffset.dy + p.x * cellSize + cellSize / 2,
      );

  @override
  void paint(Canvas canvas, Size size) {
    final cellPaint = Paint()..color = cellColor;
    final inset = cellSize * 0.08;

    // ১. শেপ এর সব cell — হালকা background box
    for (final cell in shape.cells) {
      final rect = Rect.fromLTWH(
        boardOffset.dx + cell.y * cellSize + inset,
        boardOffset.dy + cell.x * cellSize + inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(rect, Radius.circular(cellSize * 0.18)),
        cellPaint,
      );
    }

    // ২. Hint cell — সোনালি highlight
    if (hintCell != null) {
      final rect = Rect.fromLTWH(
        boardOffset.dx + hintCell!.y * cellSize + inset,
        boardOffset.dy + hintCell!.x * cellSize + inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(rect, Radius.circular(cellSize * 0.18)),
        Paint()..color = Colors.amber.withOpacity(0.35 + hintPulse * 0.35),
      );
    }

    // ৩. আঁকা path — connected line হিসেবে
    if (path.isNotEmpty) {
      final linePaint = Paint()
        ..color = pathColor
        ..strokeWidth = cellSize * 0.32
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke;

      final pathShape = Path();
      pathShape.moveTo(_centerOf(path.first).dx, _centerOf(path.first).dy);
      for (int i = 1; i < path.length; i++) {
        final c = _centerOf(path[i]);
        pathShape.lineTo(c.dx, c.dy);
      }
      canvas.drawPath(pathShape, linePaint);

      // শুরুর বিন্দু — সবুজ dot
      canvas.drawCircle(_centerOf(path.first), cellSize * 0.22, Paint()..color = const Color(0xFF4CAF50));

      // শেষ বিন্দু (বর্তমান আঙুলের জায়গা) — সাদা dot
      canvas.drawCircle(_centerOf(path.last), cellSize * 0.22, Paint()..color = Colors.white);
    }
  }

  @override
  bool shouldRepaint(covariant _MazePainter oldDelegate) {
    return oldDelegate.path != path ||
        oldDelegate.hintCell != hintCell ||
        oldDelegate.hintPulse != hintPulse ||
        oldDelegate.pathColor != pathColor ||
        oldDelegate.cellColor != cellColor;
  }
}
