import 'dart:math';
import '../models/grid_shape.dart';

// Shape এর ভেতরে Hamiltonian path খুঁজে বের করে — মানে এমন একটা route
// যেটা প্রতিটা cell ঠিক একবার visit করে। এটা দিয়ে বোঝা যায় shape টা
// সমাধানযোগ্য কিনা, আর hint button এর জন্য continuation খোঁজা হয় একই লজিকে।
class MazeGenerator {
  static const int _maxAttempts = 200000; // অনেকদূর চেষ্টা করে হ্যাং না হওয়ার জন্য limit
  static int _attempts = 0;

  // নতুন level load হলে shape টা solvable কিনা যাচাই করো (এবং একটা সমাধান পাও)
  static List<Point<int>>? findHamiltonianPath(GridShape shape) {
    if (shape.cells.isEmpty) return null;

    final random = Random();
    final starts = shape.cells.toList()..shuffle(random);

    // কয়েকটা random start cell দিয়ে চেষ্টা করো — একটাতেই সাধারণত পেয়ে যাবে
    for (final start in starts.take(5)) {
      _attempts = 0;
      final visited = <Point<int>>{start};
      final path = <Point<int>>[start];
      if (_backtrack(shape, path, visited, random, shape.totalCells)) {
        return path;
      }
    }
    return null;
  }

  // Player এর বর্তমান path থেকে শুরু করে বাকি সব cell ঢাকতে পারার মতো
  // একটা continuation খোঁজে — hint দেওয়ার জন্য এটাই মূল লজিক
  static List<Point<int>>? findContinuation(
    GridShape shape,
    Set<Point<int>> visited,
    Point<int> current,
  ) {
    if (visited.length == shape.totalCells) return [];

    final random = Random();
    final path = <Point<int>>[current];
    final visitedCopy = Set<Point<int>>.from(visited);
    _attempts = 0;

    if (_backtrack(shape, path, visitedCopy, random, shape.totalCells)) {
      return path.sublist(1); // current cell বাদ দিয়ে বাকি path
    }
    return null;
  }

  static bool _backtrack(
    GridShape shape,
    List<Point<int>> path,
    Set<Point<int>> visited,
    Random random,
    int totalCells,
  ) {
    _attempts++;
    if (_attempts > _maxAttempts) return false;

    if (visited.length == totalCells) return true;

    final current = path.last;
    final neighbors = _neighbors(current)
        .where((n) => shape.contains(n) && !visited.contains(n))
        .toList()
      ..shuffle(random);

    for (final next in neighbors) {
      visited.add(next);
      path.add(next);

      if (_backtrack(shape, path, visited, random, totalCells)) return true;

      // ব্যর্থ হলে backtrack করো
      visited.remove(next);
      path.removeLast();
    }
    return false;
  }

  static List<Point<int>> _neighbors(Point<int> p) => [
        Point(p.x - 1, p.y),
        Point(p.x + 1, p.y),
        Point(p.x, p.y - 1),
        Point(p.x, p.y + 1),
      ];
}
