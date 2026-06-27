// Defines the GridShape model: the puzzle's grid dimensions and the set of
// cells that must be filled by the player's path. Used by the maze/path
// game logic and by factories that build specific shapes (rectangle, heart).
import 'dart:math';

// একটা puzzle shape — grid এর কোন কোন cell পূরণ করতে হবে তার তালিকা
/// Represents a single puzzle shape: a `rows` x `cols` grid where only the
/// cells listed in [cells] need to be traced/filled by the player. Acts as
/// the data model consumed by the maze game screen and shape generators.
class GridShape {
  final int rows;
  final int cols;
  final Set<Point<int>> cells; // (row, col) — shape এর ভেতরের সব cell

  GridShape({required this.rows, required this.cols, required this.cells});

  /// Returns true if point [p] (row, col) is part of this shape.
  bool contains(Point<int> p) => cells.contains(p);

  /// Total number of cells that must be filled to complete this shape.
  int get totalCells => cells.length;

  // টেস্ট করার জন্য সহজ rectangle shape — প্রথম prototype এর জন্য
  /// Builds a fully-filled rectangular shape of [rows] x [cols] cells.
  /// Mainly used for testing/prototyping rather than real game content.
  factory GridShape.rectangle({int rows = 5, int cols = 6}) {
    final cells = <Point<int>>{};
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        cells.add(Point(r, c));
      }
    }
    return GridShape(rows: rows, cols: cols, cells: cells);
  }

  // হার্ট shape — text pattern থেকে generate করা (1 = filled, 0 = খালি)
  /// Builds a heart-shaped puzzle from a hardcoded ASCII pattern, where
  /// each row is a string of '1' (filled cell) and '0' (empty cell).
  factory GridShape.heart() {
    const pattern = [
      "0110110",
      "1111111",
      "1111111",
      "1111111",
      "0111110",
      "0011100",
      "0001000",
    ];
    return _fromPattern(pattern);
  }

  /// Converts a list of '0'/'1' row strings into a [GridShape], adding a
  /// cell wherever the character is '1'. Shared helper for pattern-based
  /// shape factories.
  static GridShape _fromPattern(List<String> pattern) {
    final cells = <Point<int>>{};
    for (int r = 0; r < pattern.length; r++) {
      for (int c = 0; c < pattern[r].length; c++) {
        if (pattern[r][c] == '1') cells.add(Point(r, c));
      }
    }
    return GridShape(rows: pattern.length, cols: pattern[0].length, cells: cells);
  }
}
