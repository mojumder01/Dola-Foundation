import 'dart:math';
import '../models/grid_shape.dart';
import 'maze_generator.dart';

// shape generation এ Hamiltonian-path খোঁজার জন্য backtracking লাগে, যা বড়
// (বিশেষত Hard difficulty/branchy) shape এ অনেকক্ষণ ধরে চলতে পারে। এটা সরাসরি
// main/UI thread এ ডাকলে app "Not Responding" দেখিয়ে force-close হয়ে যায় —
// তাই compute() দিয়ে আলাদা isolate এ চালানোর জন্য এই top-level wrapper।
// (compute() এর callback static/top-level হতে হয়, এবং একটাই argument নেয়।)
// This file implements procedural generation of playable maze "shapes"
// (connected sets of grid cells) for each level. It guarantees the result
// is solvable (a Hamiltonian path exists) and supports running generation
// off the UI thread for expensive cases.

/// Parameters bundle passed to [generateShapeInBackground] when generation
/// runs via `compute()` on a background isolate. Grouped into a single
/// object because `compute()` only accepts one argument.
class ShapeGenRequest {
  final int targetCells;
  final int? seed;
  final ShapeStyle style;
  const ShapeGenRequest({required this.targetCells, this.seed, this.style = ShapeStyle.blob});
}

/// Top-level (isolate-safe) entry point used with `compute()` to generate a
/// shape on a background isolate, keeping the potentially slow Hamiltonian
/// path search off the UI thread so the app doesn't freeze/hang.
GridShape generateShapeInBackground(ShapeGenRequest req) =>
    ShapeFactory.generate(targetCells: req.targetCells, seed: req.seed, style: req.style);

// শেপ কতটা "গুটিয়ে" থাকবে নাকি ঘুরপথে/শাখা-প্রশাখায় বাড়বে — difficulty বাড়ার
// সাথে সাথে শেপের ধরনও বদলায়, যাতে সব level একই রকম গোলগাল blob না লাগে।
/// Determines the growth algorithm/visual character of a generated shape:
/// [blob] is compact and easy, [snake] is a winding corridor of medium
/// difficulty, and [branchy] is a tree-like structure with many dead ends
/// (hardest to plan a path through).
/// [spiral] winds outward in a rotating arm (distinct swirl look from the
/// meandering [snake]); [cross] grows four arms from the start point with
/// occasional perpendicular branching (a "starfish" look, distinct from the
/// fully-random branching of [branchy]). Added for visual variety so
/// consecutive levels don't all look like the same shape family.
enum ShapeStyle { blob, snake, branchy, spiral, cross }

// Random কিন্তু সবসময় সমাধানযোগ্য একটা connected shape generate করে।
// seed দিলে একই input এ একই shape পাওয়া যায় — fixed levels আর daily challenge
// এর জন্য এটা জরুরি (সবার phone এ একই shape আসবে)।
/// Factory for procedurally generating connected, guaranteed-solvable grid
/// shapes used as maze levels. Supports a [seed] for deterministic output
/// (required for fixed levels and daily challenges, where every player must
/// see the identical shape).
class ShapeFactory {
  /// Generates a [GridShape] with exactly [targetCells] cells using the
  /// given [style], retrying with fresh random growth attempts until a
  /// solvable shape is found (or falling back to a guaranteed-solvable
  /// rectangle if all attempts fail).
  static GridShape generate({
    required int targetCells,
    int? seed,
    ShapeStyle style = ShapeStyle.blob,
  }) {
    // Snake/branchy shapes spread out more than a compact blob, so they need
    // a proportionally larger backing grid to have room to grow within.
    final sizeFactor = style == ShapeStyle.blob ? 2.2 : 3.2;
    final gridSize = (sqrt(targetCells) * sizeFactor).ceil().clamp(6, 22);
    // Seeded RNG gives deterministic/reproducible shapes; unseeded gives variety.
    final random = seed != null ? Random(seed) : Random();

    // কয়েকবার চেষ্টা করো — মাঝে মাঝে growth আটকে যেতে পারে অথবা solvable না হতে পারে
    // (branchy/বড় shape এ unsolvable attempt detect করাটাও backtracking-heavy,
    // তাই retry সংখ্যা কম রাখা হয়েছে যাতে worst-case সময় বেশি বেড়ে না যায়)
    for (int attempt = 0; attempt < 12; attempt++) {
      final shape = switch (style) {
        ShapeStyle.blob => _growBlob(targetCells, gridSize, random),
        ShapeStyle.snake => _growSnake(targetCells, gridSize, random),
        ShapeStyle.branchy => _growBranchy(targetCells, gridSize, random),
        ShapeStyle.spiral => _growSpiral(targetCells, gridSize, random),
        ShapeStyle.cross => _growCross(targetCells, gridSize, random),
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
  /// Grows a compact, rounded "blob" shape outward from the grid center by
  /// repeatedly picking a random cell from the current frontier (cells
  /// adjacent to the shape) and absorbing it. This produces an easy,
  /// roughly circular shape since growth happens uniformly in all directions.
  static GridShape _growBlob(int targetCells, int gridSize, Random random) {
    final center = _randomStart(gridSize, random);
    final cells = <Point<int>>{center};
    // candidate cells adjacent to the shape
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
  /// Grows a single winding, snake-like corridor using a depth-first
  /// random-walk with directional bias (55% chance to continue in the same
  /// direction as the last move, producing longer straight runs instead of
  /// jittery zig-zags). Backtracks via the stack when the walk dead-ends.
  /// Produces a narrower, more winding shape than [_growBlob] — medium
  /// difficulty to visually trace a path through.
  static GridShape _growSnake(int targetCells, int gridSize, Random random) {
    final start = _randomStart(gridSize, random);
    final cells = <Point<int>>{start};
    // tracks the walk so we can backtrack on dead ends
    final stack = <Point<int>>[start];
    // last direction moved, used to bias straight-line growth
    Point<int>? lastDir;

    while (cells.length < targetCells && stack.isNotEmpty) {
      final current = stack.last;
      final dirs = _directions(random);
      if (lastDir != null && random.nextDouble() < 0.55) {
        dirs.remove(lastDir);
        // prefer continuing in the same direction
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
  /// Grows a tree-like structure by extending from either an existing
  /// "tip" (an active growth point) or, with 30% probability, branching off
  /// from a random already-placed cell. This creates many dead-end branches,
  /// making the shape the hardest to visually plan a single path through.
  /// The tip list is capped at 40 entries (oldest trimmed) to bound the
  /// cost of picking a random tip as the shape grows large.
  static GridShape _growBranchy(int targetCells, int gridSize, Random random) {
    final start = _randomStart(gridSize, random);
    final cells = <Point<int>>{start};
    // active growth points (branch ends)
    var tips = <Point<int>>[start];

    while (cells.length < targetCells && tips.isNotEmpty) {
      final branchFromCell = random.nextDouble() < 0.3 && cells.length > 3;
      // start a new branch from anywhere in the shape, or extend an existing branch tip
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
        // bound tip list size for performance
        if (tips.length > 40) tips = tips.sublist(tips.length - 40);
      } else {
        // this tip is fully boxed in, stop growing from it
        tips.remove(origin);
      }
    }

    return GridShape(rows: gridSize, cols: gridSize, cells: cells);
  }

  // মূল করিডোর একটা নির্দিষ্ট দিকে ঘুরতে ঘুরতে বাড়ে — দেখতে ঘূর্ণায়মান spiral-এর মতো
  // (snake থেকে আলাদা — snake সোজা দিকে বায়াস করে, এটা নিয়মিত ঘোরে)
  /// Grows a rotating spiral arm: walks a short run of steps in the current
  /// direction, then turns 90° clockwise and continues, producing a winding
  /// swirl shape distinct from [_growSnake]'s straight-biased corridor.
  /// Backtracks via the stack when boxed in.
  static GridShape _growSpiral(int targetCells, int gridSize, Random random) {
    final start = _randomStart(gridSize, random);
    final cells = <Point<int>>{start};
    final stack = <Point<int>>[start];
    // clockwise rotation order: up, right, down, left
    const rotation = [Point(0, -1), Point(1, 0), Point(0, 1), Point(-1, 0)];
    int dirIndex = random.nextInt(rotation.length);
    int stepsInDir = 0;
    final runLength = 2 + random.nextInt(3); // steps before rotating to the next direction

    while (cells.length < targetCells && stack.isNotEmpty) {
      final current = stack.last;
      if (stepsInDir >= runLength) {
        dirIndex = (dirIndex + 1) % rotation.length;
        stepsInDir = 0;
      }
      final d = rotation[dirIndex];
      final next = Point(current.x + d.x, current.y + d.y);

      if (_inBounds(next, gridSize) && !cells.contains(next)) {
        cells.add(next);
        stack.add(next);
        stepsInDir++;
      } else {
        // preferred direction is blocked — try any other direction before backtracking
        Point<int>? moved;
        for (final alt in _directions(random)) {
          final altNext = Point(current.x + alt.x, current.y + alt.y);
          if (_inBounds(altNext, gridSize) && !cells.contains(altNext)) {
            cells.add(altNext);
            stack.add(altNext);
            moved = altNext;
            break;
          }
        }
        if (moved == null) {
          stack.removeLast(); // fully boxed in — backtrack
        } else {
          stepsInDir = runLength; // force a rotation next time after this forced deviation
        }
      }
    }

    return GridShape(rows: gridSize, cols: gridSize, cells: cells);
  }

  // চারটা বাহু (উপর/নিচ/বাম/ডান) একসাথে বাড়ে, কখনো কখনো পাশে নতুন বাহু ছড়ায় —
  // দেখতে starfish/cross এর মতো (branchy থেকে আলাদা, কারণ branchy এলোমেলো জায়গা থেকে শাখা ছড়ায়)
  /// Grows four arms outward from the start point (one per cardinal
  /// direction), each independently extending step by step, with an 18%
  /// chance per step of spawning a perpendicular side-branch (capped at 16
  /// total arms). Produces a starfish/cross silhouette distinct from
  /// [_growBranchy]'s fully random branch origins.
  static GridShape _growCross(int targetCells, int gridSize, Random random) {
    final start = _randomStart(gridSize, random);
    final cells = <Point<int>>{start};
    // armDirs[i]/armTips[i] together describe one active growth arm: the
    // direction it extends in, and the current end cell of that arm.
    final armDirs = <Point<int>>[const Point(-1, 0), const Point(1, 0), const Point(0, -1), const Point(0, 1)];
    final armTips = <Point<int>>[start, start, start, start];

    while (cells.length < targetCells && armDirs.isNotEmpty) {
      final i = random.nextInt(armDirs.length);
      final dir = armDirs[i];
      final next = Point(armTips[i].x + dir.x, armTips[i].y + dir.y);

      if (_inBounds(next, gridSize) && !cells.contains(next)) {
        cells.add(next);
        armTips[i] = next;
        if (random.nextDouble() < 0.18 && armDirs.length < 16) {
          final perp = dir.x == 0 ? const Point(1, 0) : const Point(0, 1);
          armDirs.add(random.nextBool() ? perp : Point(-perp.x, -perp.y));
          armTips.add(next);
        }
      } else {
        // this arm hit the grid edge or itself — stop extending it
        armDirs.removeAt(i);
        armTips.removeAt(i);
      }
    }

    return GridShape(rows: gridSize, cols: gridSize, cells: cells);
  }

  /// Picks a randomized starting point within roughly the central half of
  /// the grid (instead of always the exact center), so shapes explore
  /// different areas of the canvas and look less repetitive across
  /// generations/levels even when the growth algorithm is the same.
  static Point<int> _randomStart(int gridSize, Random random) {
    final margin = (gridSize * 0.25).round().clamp(0, gridSize ~/ 2 - 1);
    final range = (gridSize - margin * 2).clamp(1, gridSize);
    final x = (margin + random.nextInt(range)).clamp(0, gridSize - 1);
    final y = (margin + random.nextInt(range)).clamp(0, gridSize - 1);
    return Point(x, y);
  }

  /// Checks whether point [p] lies within the [gridSize] x [gridSize] grid.
  static bool _inBounds(Point<int> p, int gridSize) =>
      p.x >= 0 && p.y >= 0 && p.x < gridSize && p.y < gridSize;

  /// Returns the 4 cardinal direction offsets in a randomly shuffled order,
  /// so growth direction choices are unbiased by array order.
  static List<Point<int>> _directions(Random random) {
    final dirs = [Point(-1, 0), Point(1, 0), Point(0, -1), Point(0, 1)];
    dirs.shuffle(random);
    return dirs;
  }

  /// Returns the in-bounds cardinal neighbor cells of [p] within a grid of
  /// size [gridSize] (used to compute the growth frontier for [_growBlob]).
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
