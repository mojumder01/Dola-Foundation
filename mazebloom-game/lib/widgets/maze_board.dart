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
  final TransformationController _transformController = TransformationController();
  bool _panEnabled = false;

  // shape.rows/cols আসলে generation এর সময়কার abstract grid size — শেপ সেই
  // grid এর যেকোনো কোণায় থাকতে পারে, পুরোটা ব্যবহার না করেও। আগে পুরো grid এর
  // জন্য canvas বানানো হতো, তাই শেপ একপাশে চাপা/ছোট দেখাতো আর zoom/pan করলেও
  // আসল শেপটা viewport এর বাইরে কাটা থাকতো। তাই শেপের নিজের bounding box (যতটুকু
  // cell আসলে আছে) ধরে trim করে নেওয়া হয় — এতে শেপ সবসময় ঠিক viewport এ ফিট হয়।
  int _minRow = 0, _minCol = 0, _boundRows = 1, _boundCols = 1;

  @override
  void initState() {
    super.initState();
    _computeBounds();
    // hint cell না থাকলে animation বন্ধ রাখা হয় — আগে এটা সবসময় চলতো, যার ফলে
    // বড় shape (Hard level) এও পুরো board প্রতি ফ্রেমে repaint হতো আর গেম স্লো/স্ট্যাক লাগতো
    _hintPulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    if (widget.hintCell != null) _hintPulse.repeat(reverse: true);
    _transformController.addListener(_onTransformChanged);
  }

  void _computeBounds() {
    if (widget.shape.cells.isEmpty) {
      _minRow = 0;
      _minCol = 0;
      _boundRows = 1;
      _boundCols = 1;
      return;
    }
    int minRow = widget.shape.cells.first.x, maxRow = widget.shape.cells.first.x;
    int minCol = widget.shape.cells.first.y, maxCol = widget.shape.cells.first.y;
    for (final c in widget.shape.cells) {
      if (c.x < minRow) minRow = c.x;
      if (c.x > maxRow) maxRow = c.x;
      if (c.y < minCol) minCol = c.y;
      if (c.y > maxCol) maxCol = c.y;
    }
    _minRow = minRow;
    _minCol = minCol;
    _boundRows = maxRow - minRow + 1;
    _boundCols = maxCol - minCol + 1;
  }

  void _onTransformChanged() {
    // জুম-ইন করার পরই single-finger দিয়ে move/pan করা চালু হয় — bound trim করার
    // পরও কোনো কোনো লম্বা শেপে এক পাশে viewport এর চেয়ে বড় হয়ে যেতে পারে, তাই
    // scale ১.০ এর কাছাকাছি থাকলেও (zoomed-out অবস্থা) pan অন রাখা হয় — না হলে
    // বড় শেপের বাকি অংশে আঙুল দিয়ে পৌঁছানো যেত না
    final scale = _transformController.value.getMaxScaleOnAxis();
    final shouldPan = scale > 1.02 || _boardOverflowsViewport;
    if (shouldPan != _panEnabled) setState(() => _panEnabled = shouldPan);
  }

  bool _boardOverflowsViewport = false;

  @override
  void didUpdateWidget(covariant MazeBoard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.hintCell != null && !_hintPulse.isAnimating) {
      _hintPulse.repeat(reverse: true);
    } else if (widget.hintCell == null && _hintPulse.isAnimating) {
      _hintPulse.stop();
      _hintPulse.value = 0;
    }
    if (oldWidget.shape != widget.shape) {
      _computeBounds();
      _transformController.value = Matrix4.identity();
    }
  }

  @override
  void dispose() {
    _hintPulse.dispose();
    _transformController.removeListener(_onTransformChanged);
    _transformController.dispose();
    super.dispose();
  }

  // আঙুলের position থেকে কোন grid cell এ আছে বের করো (bounding-box trimmed coordinate থেকে আসল shape coordinate এ ফিরিয়ে আনা হয়)
  Point<int>? _cellFromOffset(Offset local) {
    if (_cellSize <= 0) return null;
    final adjusted = local - _boardOffset;
    final localCol = (adjusted.dx / _cellSize).floor();
    final localRow = (adjusted.dy / _cellSize).floor();
    if (localRow < 0 || localCol < 0 || localRow >= _boundRows || localCol >= _boundCols) {
      return null;
    }
    final p = Point(localRow + _minRow, localCol + _minCol);
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
        // Cell size — শেপ এর rows/cols অনুযায়ী যতটা জায়গায় ফিট হয়, কিন্তু একটা
        // min/max range এ clamp করা থাকে যাতে ছোট আর বড় শেপেও cell গুলো একই রকম
        // সাইজে দেখায় (এর আগে ছোট shape এ অনেক বড়, বড় shape এ অনেক ছোট হয়ে যেত)
        final maxW = constraints.maxWidth;
        final maxH = constraints.maxHeight;
        final rawSize = min(maxW / _boundCols, maxH / _boundRows);
        _cellSize = rawSize.clamp(26.0, 58.0);

        final boardW = _cellSize * _boundCols;
        final boardH = _cellSize * _boundRows;
        // clamp করার পর board viewport এর চেয়ে বড় হয়ে গেলে canvas টাও বড় করে দিতে
        // হয়, না হলে বাকি অংশ আঁকা/ছোঁয়া যায় না — সেক্ষেত্রে zoom/pan করে পুরোটা দেখা যায়
        final canvasW = max(maxW, boardW);
        final canvasH = max(maxH, boardH);
        _boardOffset = Offset((canvasW - boardW) / 2, (canvasH - boardH) / 2);
        _boardOverflowsViewport = boardW > maxW || boardH > maxH;

        // জুম-আউট অবস্থায় (scale ~1) pan বন্ধ থাকে যাতে এক-আঙুলের drag trace
        // করার জন্য child এ চলে যায় — জুম করার পর pan চালু হয়ে যায় move করার জন্য
        return InteractiveViewer(
          transformationController: _transformController,
          panEnabled: _panEnabled,
          scaleEnabled: true,
          minScale: 0.5,
          maxScale: 3.0,
          child: GestureDetector(
            onPanStart: (details) => _handleTouch(details.localPosition),
            onPanUpdate: (details) => _handleTouch(details.localPosition),
            child: AnimatedBuilder(
              animation: _hintPulse,
              builder: (context, _) => CustomPaint(
                size: Size(canvasW, canvasH),
                painter: _MazePainter(
                  shape: widget.shape,
                  path: widget.path,
                  cellSize: _cellSize,
                  boardOffset: _boardOffset,
                  minRow: _minRow,
                  minCol: _minCol,
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
  final int minRow;
  final int minCol;
  final Point<int>? hintCell;
  final double hintPulse; // 0.0–1.0, animation এর বর্তমান মান
  final Color pathColor;
  final Color cellColor;

  _MazePainter({
    required this.shape,
    required this.path,
    required this.cellSize,
    required this.boardOffset,
    required this.minRow,
    required this.minCol,
    required this.hintPulse,
    required this.pathColor,
    required this.cellColor,
    this.hintCell,
  });

  Offset _centerOf(Point<int> p) => Offset(
        boardOffset.dx + (p.y - minCol) * cellSize + cellSize / 2,
        boardOffset.dy + (p.x - minRow) * cellSize + cellSize / 2,
      );

  @override
  void paint(Canvas canvas, Size size) {
    // cellColor কে background এর তুলনায় একটু হালকা/উজ্জ্বল করে দেওয়া হয়, আর একটা
    // পাতলা সাদা border যুক্ত করা হয় — এতে box গুলো background থেকে স্পষ্ট আলাদা দেখায়
    final cellPaint = Paint()..color = Color.alphaBlend(Colors.white.withOpacity(0.14), cellColor);
    final cellBorder = Paint()
      ..color = Colors.white.withOpacity(0.16)
      ..style = PaintingStyle.stroke
      ..strokeWidth = max(1.0, cellSize * 0.025);
    final inset = cellSize * 0.08;

    // ১. শেপ এর সব cell — হালকা background box, border সহ
    for (final cell in shape.cells) {
      final rect = Rect.fromLTWH(
        boardOffset.dx + (cell.y - minCol) * cellSize + inset,
        boardOffset.dy + (cell.x - minRow) * cellSize + inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
      );
      final rrect = RRect.fromRectAndRadius(rect, Radius.circular(cellSize * 0.18));
      canvas.drawRRect(rrect, cellPaint);
      canvas.drawRRect(rrect, cellBorder);
    }

    // ২. Hint cell — সোনালি highlight
    if (hintCell != null) {
      final rect = Rect.fromLTWH(
        boardOffset.dx + (hintCell!.y - minCol) * cellSize + inset,
        boardOffset.dy + (hintCell!.x - minRow) * cellSize + inset,
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
