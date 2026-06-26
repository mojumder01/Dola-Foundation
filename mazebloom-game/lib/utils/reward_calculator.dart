// একটা শেপ সমাধান হলে কত coin বোনাস পাওয়া উচিত তা হিসাব করে
class RewardCalculator {
  static const int _baseCoinsPerCell = 1;
  static const int _speedBonus = 10; // নির্দিষ্ট সময়ের মধ্যে শেষ করলে
  static const int _perfectBonus = 5; // একবারও ভুল না করে (life না হারিয়ে) শেষ করলে

  // ১ সেকেন্ডে গড়ে ১.৫ ঘর পূরণ করলে "speed" হিসেবে ধরা হয়
  static bool _isFast(int totalCells, int elapsedSeconds) {
    if (elapsedSeconds <= 0) return true;
    return (totalCells / elapsedSeconds) >= 1.5;
  }

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
