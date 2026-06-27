// একটা শেপ সমাধান হলে কত coin বোনাস পাওয়া উচিত তা হিসাব করে
// This file contains the scoring/reward logic for completed maze shapes —
// it converts cell count, time taken, and run quality into a coin payout.

/// Computes the coin reward earned for completing a maze shape, combining a
/// base per-cell amount with optional speed and "perfect run" bonuses.
class RewardCalculator {
  // coins awarded per cell in the shape
  static const int _baseCoinsPerCell = 1;
  static const int _speedBonus = 10; // নির্দিষ্ট সময়ের মধ্যে শেষ করলে
  // Bonus coins awarded when the shape is completed quickly (see _isFast).
  static const int _perfectBonus = 5; // একবারও ভুল না করে (life না হারিয়ে) শেষ করলে
  // Bonus coins awarded when the player never hit a dead end (perfectRun == true).

  // ১ সেকেন্ডে গড়ে ১.৫ ঘর পূরণ করলে "speed" হিসেবে ধরা হয়
  /// Returns true if the average fill rate (cells per second) meets the
  /// "fast" threshold (>= 1.5 cells/sec), qualifying for the speed bonus.
  /// Treats zero/negative elapsed time as fast to avoid division errors.
  static bool _isFast(int totalCells, int elapsedSeconds) {
    if (elapsedSeconds <= 0) return true;
    return (totalCells / elapsedSeconds) >= 1.5;
  }

  /// Calculates the total coin reward for a completed run: base coins for
  /// every filled cell, plus a speed bonus if completed fast enough, plus
  /// a perfect-run bonus if no dead ends were hit.
  static int calculate({
    required int totalCells,
    required int elapsedSeconds,
    required bool perfectRun, // কোনো dead-end এ পড়েনি
  }) {
    int coins = totalCells * _baseCoinsPerCell;
    if (_isFast(totalCells, elapsedSeconds)) coins += _speedBonus;
    if (perfectRun) coins += _perfectBonus;
    return coins;
  }
}
