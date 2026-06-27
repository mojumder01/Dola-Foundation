import 'dart:math';
import '../models/grid_shape.dart';
import 'maze_generator.dart';

// shape generation এ Hamiltonian-path খোঁজার জন্য backtracking লাগে, যা বড়
// (বিশেষত Hard difficulty/branchy) shape এ অনেকক্ষণ ধরে চলতে পারে। এটা সরাসরি
// main/UI thread এ ডাকলে app "Not Responding" দেখিয়ে force-close হয়ে যায় —
// তাই compute() দিয়ে আলাদা isolate এ চালানোর জন্য এই top-level wrapper।
// (compute() এর callback static/top-level হতে হয়, এবং একটাই argument নেয়।)
class ShapeGenRequest {
  final int targetCells;
  final int? seed;
  final ShapeStyle style;
  const ShapeGenRequest({required this.targetCells, this.seed, this.style = ShapeStyle.blob});
}

GridShape generateShapeInBackground(ShapeGenRequest req) =>
    ShapeFactory.generate(targetCells: req.targetCells, seed: req.seed, style: req.style);

// শেপ কতটা "গুটিয়ে" থাকবে নাকি ঘুরপথে/শাখা-প্রশাখায় বাড়বে — difficulty বাড়ার
// সাথে সাথে শেপের ধরনও বদলায়, যাতে সব level একই রকম গোলগাল blob না লাগে।
enum ShapeStyle { blob, snake, branchy }

// Random কিন্তু সবসময় সমাধানযোগ্য একটা connected shape generate করে।
// seed দিলে একই input এ একই shape পাওয়া যায় — fixed levels আর daily challenge
// এর জন্য এটা জরুরি (সবার phone এ একই shape আসবে)।
class ShapeFactory {
  static GridShape generate({
    required int targetCells,
    int? seed,
    ShapeStyle style = ShapeStyle.blob,
  }) {
    final sizeFactor = style == ShapeStyle.blob ? 2.2 : 3.2;
    final gridSize = (sqrt(targetCells) * sizeFactor).ceil().clamp(6, 22);
    final random = seed != null ? Random(seed) : Random();

    // কয়েকবার চেষ্টা করো — মাঝে মাঝে growth আটকে যেতে পারে অথবা solvable না হতে পারে
    // (branchy/বড় shape এ unsolvable attempt detect করাটাও backtracking-heavy,
    // তাই retry সংখ্যা কম রাখা হয়েছে যাতে worst-case সময় বেশি বেড়ে না যায়)
    for (int attempt = 0; attempt < 12; attempt++) {
      final shape = switch (style) {
        ShapeStyle.blob => _growBlob(targetCells, gridSize, random),
        ShapeStyle.snake => _growSnake(targetCells, gridSize, random),
        ShapeStyle.branchy => _growBranchy(targetCells, gridSize, random),
      };
      if (shape.totalCells == targetCells &&
          MazeGenerator.findHamiltonianPath(shape) != null) {
        return shape;
      }
    }

    // ৩০ বারেও সফল না হলে fallback — rectangle সবসময় solvable
    final cols = (targetCells / 3).ceil();
    return GridShape.rectangle(rows: 3, cols: cols);
  }

  // Center থেকে random adjacent cell একে একে যুক্ত করে blob বড় করা হয় (সহজ — গোলগাল, compact)
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

  // একটা মেন্ডারিং করিডোর — একই দিকে এগিয়ে যাওয়ার দিকে bias দেওয়া, আটকে গেলে backtrack
  // (মাঝারি — সরু আর ঘুরপথ, blob থেকে আলাদা আর প্ল্যান করা একটু কঠিন)
  static GridShape _growSnake(int targetCells, int gridSize, Random random) {
    final start = Point(gridSize ~/ 2, gridSize ~/ 2);
    final cells = <Point<int>>{start};
    final stack = <Point<int>>[start];
    Point<int>? lastDir;

    while (cells.length < targetCells && stack.isNotEmpty) {
      final current = stack.last;
      final dirs = _directions(random);
      if (lastDir != null && random.nextDouble() < 0.55) {
        dirs.remove(lastDir);
        dirs.insert(0, lastDir);
      }

      Point<int>? movedDir;
      for (final d in dirs) {
        final next = Point(current.x + d.x, current.y + d.y);
        if (_inBounds(next, gridSize) && !cells.contains(next)) {
          cells.add(next);
          stack.add(next);
          movedDir = d;
          break;
        }
      }

      if (movedDir != null) {
        lastDir = movedDir;
      } else {
        stack.removeLast(); // dead end — আগের cell এ ফিরে যাও
        lastDir = null;
      }
    }

    return GridShape(rows: gridSize, cols: gridSize, cells: cells);
  }

  // মূল করিডোর থেকে মাঝে মাঝে নতুন শাখা ছড়িয়ে বাড়ে — গাছের মতো structure
  // (কঠিন — অনেক dead-end-এর মতো দেখতে শাখা, প্ল্যান করে path আঁকতে হবে)
  static GridShape _growBranchy(int targetCells, int gridSize, Random random) {
    final start = Point(gridSize ~/ 2, gridSize ~/ 2);
    final cells = <Point<int>>{start};
    var tips = <Point<int>>[start];

    while (cells.length < targetCells && tips.isNotEmpty) {
      final branchFromCell = random.nextDouble() < 0.3 && cells.length > 3;
      final origin = branchFromCell
          ? cells.elementAt(random.nextInt(cells.length))
          : tips[random.nextInt(tips.length)];

      Point<int>? moved;
      for (final d in _directions(random)) {
        final next = Point(origin.x + d.x, origin.y + d.y);
        if (_inBounds(next, gridSize) && !cells.contains(next)) {
          cells.add(next);
          moved = next;
          break;
        }
      }

      if (moved != null) {
        tips.add(moved);
        if (tips.length > 40) tips = tips.sublist(tips.length - 40);
      } else {
        tips.remove(origin);
      }
    }

    return GridShape(rows: gridSize, cols: gridSize, cells: cells);
  }

  static bool _inBounds(Point<int> p, int gridSize) =>
      p.x >= 0 && p.y >= 0 && p.x < gridSize && p.y < gridSize;

  static List<Point<int>> _directions(Random random) {
    final dirs = [Point(-1, 0), Point(1, 0), Point(0, -1), Point(0, 1)];
    dirs.shuffle(random);
    return dirs;
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
