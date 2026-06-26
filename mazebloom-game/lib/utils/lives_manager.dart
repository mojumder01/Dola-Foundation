import 'package:shared_preferences/shared_preferences.dart';

// লাইফ শেষ হয়ে গেলে ব্যাংক করা extra life ব্যবহার করা যায় — সময়ের সাথে নিজেই রিফিল হয়,
// অথবা ad দেখে / coin খরচ করে আগেই বাড়ানো যায়
class LivesManager {
  static const _bankKey = 'mazebloom_banked_lives';
  static const _lastRefillKey = 'mazebloom_last_refill';
  static const int maxBankedLives = 5;
  static const Duration refillInterval = Duration(minutes: 30);

  static Future<int> getBankedLives() async {
    final prefs = await SharedPreferences.getInstance();
    await _applyTimeRefill(prefs);
    return prefs.getInt(_bankKey) ?? 0;
  }

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

  static Future<void> addBankedLife([int amount = 1]) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getInt(_bankKey) ?? 0;
    await prefs.setInt(_bankKey, (current + amount).clamp(0, maxBankedLives));
  }

  // ব্যাংক থেকে একটা লাইফ ব্যবহার করো — থাকলে true, না থাকলে false
  static Future<bool> useBankedLife() async {
    final prefs = await SharedPreferences.getInstance();
    await _applyTimeRefill(prefs);
    final current = prefs.getInt(_bankKey) ?? 0;
    if (current <= 0) return false;
    await prefs.setInt(_bankKey, current - 1);
    return true;
  }
}
