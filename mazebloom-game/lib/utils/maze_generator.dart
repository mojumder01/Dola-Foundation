import 'dart:math';
import '../models/grid_shape.dart';

// Hint এর জন্য continuation/solution খোঁজাও backtracking-ভিত্তিক, বড় shape এ
// অনেকক্ষণ লাগতে পারে — তাই এগুলোও compute() দিয়ে আলাদা isolate এ চালানোর জন্য
// top-level wrapper (main thread block করলে ANR/"Not Responding" crash হয়)।
class _HintRequest {
  final GridShape shape;
  final Set<Point<int>>? visited;
  final Point<int>? current;
  const _HintRequest({required this.shape, this.visited, this.current});
}

List<Point<int>>? findHamiltonianPathInBackground(GridShape shape) =>
    MazeGenerator.findHamiltonianPath(shape);

List<Point<int>>? findContinuationInBackground(_HintRequest req) =>
    MazeGenerator.findContinuation(req.shape, req.visited!, req.current!);

_HintRequest continuationRequest(GridShape shape, Set<Point<int>> visited, Point<int> current) =>
    _HintRequest(shape: shape, visited: visited, current: current);

// Shape এর ভেতরে Hamiltonian path খুঁজে বের করে — মানে এমন একটা route
// যেটা প্রতিটা cell ঠিক একবার visit করে। এটা দিয়ে বোঝা যায় shape টা
// সমাধানযোগ্য কিনা, আর hint button এর জন্য continuation খোঁজা হয় একই লজিকে।
class MazeGenerator {
  static const int _maxAttempts = 50000; // অনেকদূর চেষ্টা করে হ্যাং না হওয়ার জন্য limit
  static int _attempts = 0;

  // নতুন level load হলে shape টা solvable কিনা যাচাই করো (এবং একটা সমাধান পাও)
  static List<Point<int>>? findHamiltonianPath(GridShape shape) {
    if (shape.cells.isEmpty) return null;

    final random = Random();
    final starts = shape.cells.toList()..shuffle(random);

    // কয়েকটা random start cell দিয়ে চেষ্টা করো — একটাতেই সাধারণত পেয়ে যাবে
    for (final start in starts.take(3)) {
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
    // Warnsdorff's rule — যে neighbor এর own unvisited-neighbor সবচেয়ে কম, সেটা আগে চেষ্টা করো।
    // এটা বড় শেপেও দ্রুত সমাধান খুঁজে পায়, যেখানে শুধু random ordering আটকে যেত বা টাইমআউট হতো।
    final neighbors = _neighbors(current).where((n) => shape.contains(n) && !visited.contains(n)).toList()
      ..shuffle(random)
      ..sort((a, b) => _unvisitedDegree(shape, visited, a).compareTo(_unvisitedDegree(shape, visited, b)));

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

  // একটা cell এর কতগুলো unvisited neighbor আছে — Warnsdorff's rule এর জন্য
  static int _unvisitedDegree(GridShape shape, Set<Point<int>> visited, Point<int> p) {
    return _neighbors(p).where((n) => shape.contains(n) && !visited.contains(n)).length;
  }

  static List<Point<int>> _neighbors(Point<int> p) => [
        Point(p.x - 1, p.y),
        Point(p.x + 1, p.y),
        Point(p.x, p.y - 1),
        Point(p.x, p.y + 1),
      ];
}
