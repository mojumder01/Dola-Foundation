import 'dart:math';
import '../models/grid_shape.dart';
import 'maze_generator.dart';

// Random কিন্তু সবসময় সমাধানযোগ্য একটা connected shape ("blob") generate করে।
// seed দিলে একই input এ একই shape পাওয়া যায় — fixed levels আর daily challenge
// এর জন্য এটা জরুরি (সবার phone এ একই shape আসবে)।
class ShapeFactory {
  static GridShape generate({required int targetCells, int? seed}) {
    final gridSize = (sqrt(targetCells) * 2.2).ceil().clamp(6, 16);
    final random = seed != null ? Random(seed) : Random();

    // কয়েকবার চেষ্টা করো — মাঝে মাঝে blob আটকে যেতে পারে অথবা solvable না হতে পারে
    for (int attempt = 0; attempt < 30; attempt++) {
      final shape = _growBlob(targetCells, gridSize, random);
      if (shape.totalCells == targetCells &&
          MazeGenerator.findHamiltonianPath(shape) != null) {
        return shape;
      }
    }

    // ৩০ বারেও সফল না হলে fallback — rectangle সবসময় solvable
    final cols = (targetCells / 3).ceil();
    return GridShape.rectangle(rows: 3, cols: cols);
  }

  // Center থেকে random adjacent cell একে একে যুক্ত করে blob বড় করা হয়
  static GridShape _growBlob(int targetCells, int gridSize, Random random) {
    final center = Point(gridSize ~/ 2, gridSize ~/ 2);
    final cells = <Point<int>>{center};
    final frontier = <Point<int>>{..._neighbors(center, gridSize)};

    while (cells.length < targetCells && frontier.isNotEmpty) {
      final next = frontier.elementAt(random.nextInt(frontier.length));
      frontier.remove(next);
      cells.add(next);

      for (final n in _neighbors(next, gridSize)) {
        if (!cells.contains(n)) frontier.add(n);
      }
    }

    return GridShape(rows: gridSize, cols: gridSize, cells: cells);
  }

  static List<Point<int>> _neighbors(Point<int> p, int gridSize) {
    final candidates = [
      Point(p.x - 1, p.y),
      Point(p.x + 1, p.y),
      Point(p.x, p.y - 1),
      Point(p.x, p.y + 1),
    ];
    return candidates
        .where((c) => c.x >= 0 && c.y >= 0 && c.x < gridSize && c.y < gridSize)
        .toList();
  }
}
