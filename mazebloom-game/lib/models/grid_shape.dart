import 'dart:math';

// একটা puzzle shape — grid এর কোন কোন cell পূরণ করতে হবে তার তালিকা
class GridShape {
  final int rows;
  final int cols;
  final Set<Point<int>> cells; // (row, col) — shape এর ভেতরের সব cell

  GridShape({required this.rows, required this.cols, required this.cells});

  bool contains(Point<int> p) => cells.contains(p);

  int get totalCells => cells.length;

  // টেস্ট করার জন্য সহজ rectangle shape — প্রথম prototype এর জন্য
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
