// Manages the player's "banked" extra lives: time-based passive refill,
// plus paid (coin) top-ups with an escalating daily price.
import 'package:shared_preferences/shared_preferences.dart';

// লাইফ শেষ হয়ে গেলে ব্যাংক করা extra life ব্যবহার করা যায় — সময়ের সাথে নিজেই রিফিল হয়,
// অথবা ad দেখে / coin খরচ করে আগেই বাড়ানো যায়
/// Tracks a bank of extra lives the player can draw from when they run out
/// of in-level lives. Lives refill automatically over time (passive regen)
/// and can also be added immediately via watching an ad or spending coins.
class LivesManager {
  static const _bankKey = 'mazebloom_banked_lives';
  static const _lastRefillKey = 'mazebloom_last_refill';
  static const _purchaseCountKey = 'mazebloom_life_purchase_count';
  static const _purchaseDateKey = 'mazebloom_life_purchase_date';
  static const int maxBankedLives = 5;
  // Time needed to passively regenerate one banked life
  static const Duration refillInterval = Duration(hours: 3);

  // কয়েন দিয়ে coin-purchase করলে দাম বাড়তে থাকে — দিনে ১ম 150, ২য় 500, ৩য়+ 1250
  // Escalating coin price per purchase within the same day: 1st=150, 2nd=500, 3rd+=1250
  static const List<int> _coinCostTiers = [150, 500, 1250];

  /// Returns the current number of banked lives after first applying any
  /// time-based refill that has accrued since the last check.
  static Future<int> getBankedLives() async {
    final prefs = await SharedPreferences.getInstance();
    await _applyTimeRefill(prefs);
    return prefs.getInt(_bankKey) ?? 0;
  }

  /// Grants banked lives for elapsed refillInterval periods since the last
  /// refill timestamp. Computes whole elapsed intervals (so partial progress
  /// toward the next life isn't lost) and clamps the bank to maxBankedLives.
  /// Also refreshes the timestamp when the bank is already full, so refill
  /// progress doesn't silently accumulate unbounded while capped.
  static Future<void> _applyTimeRefill(SharedPreferences prefs) async {
    final lastMillis = prefs.getInt(_lastRefillKey);
    final now = DateTime.now();
    if (lastMillis == null) {
      await prefs.setInt(_lastRefillKey, now.millisecondsSinceEpoch);
      return;
    }

    final last = DateTime.fromMillisecondsSinceEpoch(lastMillis);
    final elapsedIntervals = now.difference(last).inMinutes ~/ refillInterval.inMinutes;
    if (elapsedIntervals <= 0) return;

    final current = prefs.getInt(_bankKey) ?? 0;
    if (current >= maxBankedLives) {
      await prefs.setInt(_lastRefillKey, now.millisecondsSinceEpoch);
      return;
    }

    final newCount = (current + elapsedIntervals).clamp(0, maxBankedLives);
    await prefs.setInt(_bankKey, newCount);
    await prefs.setInt(_lastRefillKey, now.millisecondsSinceEpoch);
  }

  /// Adds banked life/lives immediately (e.g. after watching a rewarded ad
  /// or completing a coin purchase), clamped to maxBankedLives.
  static Future<void> addBankedLife([int amount = 1]) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_bankKey) ?? 0;
    await prefs.setInt(_bankKey, (current + amount).clamp(0, maxBankedLives));
  }

  // ব্যাংক থেকে একটা লাইফ ব্যবহার করো — থাকলে true, না থাকলে false
  /// Consumes one banked life if available (applying any pending time
  /// refill first). Returns false without modifying state if the bank is empty.
  static Future<bool> useBankedLife() async {
    final prefs = await SharedPreferences.getInstance();
    await _applyTimeRefill(prefs);
    final current = prefs.getInt(_bankKey) ?? 0;
    if (current <= 0) return false;
    await prefs.setInt(_bankKey, current - 1);
    return true;
  }

  static String _todayKey(DateTime now) => '${now.year}-${now.month}-${now.day}';

  // আজকে এখন পর্যন্ত কয়টা coin-purchase হয়েছে তার ওপর ভিত্তি করে পরের দামটা বের করো
  /// Determines the coin price for the next life purchase based on how many
  /// purchases have already happened today; the count (and thus price tier)
  /// resets once the stored purchase date no longer matches today.
  static Future<int> getNextCoinCost() async {
    final prefs = await SharedPreferences.getInstance();
    final today = _todayKey(DateTime.now());
    final storedDate = prefs.getString(_purchaseDateKey);
    final count = storedDate == today ? (prefs.getInt(_purchaseCountKey) ?? 0) : 0;
    final tierIndex = count.clamp(0, _coinCostTiers.length - 1);
    return _coinCostTiers[tierIndex];
  }

  // একটা coin-purchase হয়ে গেলে আজকের counter বাড়িয়ে রাখো — কাল আবার ১ম দাম থেকে শুরু হবে
  /// Increments today's purchase counter after a successful coin purchase
  /// (resetting it first if the stored date is stale), so the price escalates
  /// within the same day and resets back to tier 1 the next day.
  static Future<void> recordCoinPurchase() async {
    final prefs = await SharedPreferences.getInstance();
    final today = _todayKey(DateTime.now());
    final storedDate = prefs.getString(_purchaseDateKey);
    final count = storedDate == today ? (prefs.getInt(_purchaseCountKey) ?? 0) : 0;
    await prefs.setString(_purchaseDateKey, today);
    await prefs.setInt(_purchaseCountKey, count + 1);
  }
}
