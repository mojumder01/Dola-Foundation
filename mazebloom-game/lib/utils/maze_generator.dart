// Core maze-solving algorithm: verifies that a GridShape is solvable by
// finding a Hamiltonian path through it (a route visiting every cell
// exactly once), and reuses the same backtracking logic to compute hints
// (continuations from the player's current path) and background-isolate
// wrappers so heavy searches don't block the UI thread.
import 'dart:math';
import '../models/grid_shape.dart';

// Hint এর জন্য continuation/solution খোঁজাও backtracking-ভিত্তিক, বড় shape এ
// অনেকক্ষণ লাগতে পারে — তাই এগুলোও compute() দিয়ে আলাদা isolate এ চালানোর জন্য
// top-level wrapper (main thread block করলে ANR/"Not Responding" crash হয়)।
/// Bundles the parameters needed for a hint/continuation search so they can
/// be passed as a single argument to a `compute()`-spawned isolate.
class _HintRequest {
  final GridShape shape;
  final Set<Point<int>>? visited;
  final Point<int>? current;
  const _HintRequest({required this.shape, this.visited, this.current});
}

/// Top-level wrapper for `compute()`: runs the full Hamiltonian-path
/// search (level solvability check) on a background isolate.
List<Point<int>>? findHamiltonianPathInBackground(GridShape shape) =>
    MazeGenerator.findHamiltonianPath(shape);

/// Top-level wrapper for `compute()`: runs the hint/continuation search
/// on a background isolate using the bundled [_HintRequest] parameters.
List<Point<int>>? findContinuationInBackground(_HintRequest req) =>
    MazeGenerator.findContinuation(req.shape, req.visited!, req.current!);

/// Builds an [_HintRequest] bundle for passing to `compute()` along with
/// [findContinuationInBackground].
_HintRequest continuationRequest(GridShape shape, Set<Point<int>> visited, Point<int> current) =>
    _HintRequest(shape: shape, visited: visited, current: current);

// Shape এর ভেতরে Hamiltonian path খুঁজে বের করে — মানে এমন একটা route
// যেটা প্রতিটা cell ঠিক একবার visit করে। এটা দিয়ে বোঝা যায় shape টা
// সমাধানযোগ্য কিনা, আর hint button এর জন্য continuation খোঁজা হয় একই লজিকে।
/// Finds a Hamiltonian path (a route visiting every cell of a GridShape
/// exactly once) using randomized, Warnsdorff's-rule-guided backtracking.
/// Used both to verify level solvability at load time and to compute
/// hint continuations from the player's current in-progress path.
class MazeGenerator {
  static const int _maxAttempts = 50000; // অনেকদূর চেষ্টা করে হ্যাং না হওয়ার জন্য limit
  // Counts backtracking steps taken in the current search; used to bail
  // out via _maxAttempts instead of letting the search run unbounded.
  static int _attempts = 0;

  // নতুন level load হলে shape টা solvable কিনা যাচাই করো (এবং একটা সমাধান পাও)
  /// Searches for a full Hamiltonian path covering every cell in [shape].
  /// Tries a few random starting cells (since solvability and the search
  /// order both depend on the chosen start) and returns the first
  /// successful path found, or null if [shape] is empty or no path was
  /// found within the attempt budget.
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
  /// Given the player's currently visited cells and current position,
  /// searches for a continuation path that visits every remaining
  /// unvisited cell — this is the core logic behind the in-game hint
  /// button. Returns an empty list if the maze is already fully visited,
  /// or null if no completing continuation could be found.
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

  /// Recursive backtracking search: extends [path] one cell at a time
  /// until either every cell in [totalCells] has been visited (success)
  /// or all neighbor options are exhausted (failure, triggering backtrack
  /// to the caller). Aborts early once [_maxAttempts] recursive calls have
  /// been made, to guarantee termination on shapes that are unsolvable or
  /// pathologically slow to search.
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
    // Shuffle first (to randomize among equal-degree neighbors), then
    // sort by ascending unvisited-degree so cells more likely to become
    // "dead ends" later are visited first — Warnsdorff's heuristic for
    // Hamiltonian path search, which dramatically reduces backtracking.
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
  /// Counts how many of [p]'s in-shape neighbors are still unvisited —
  /// this count is the "degree" used to rank candidates under
  /// Warnsdorff's rule (lower degree = tried first).
  static int _unvisitedDegree(GridShape shape, Set<Point<int>> visited, Point<int> p) {
    return _neighbors(p).where((n) => shape.contains(n) && !visited.contains(n)).length;
  }

  /// Returns the 4 orthogonally-adjacent grid points (up/down/left/right)
  /// of [p], without filtering for shape membership or visited state.
  static List<Point<int>> _neighbors(Point<int> p) => [
        Point(p.x - 1, p.y),
        Point(p.x + 1, p.y),
        Point(p.x, p.y - 1),
        Point(p.x, p.y + 1),
      ];
}
