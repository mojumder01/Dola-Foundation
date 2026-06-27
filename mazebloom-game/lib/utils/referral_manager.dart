// Implements a simple local-only referral system (no backend validation):
// each install gets a generated personal code, and entering a friend's code
// grants a one-time coin bonus.
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import 'app_language.dart';
import 'coin_manager.dart';

// সহজ local referral system — backend ছাড়া। প্রতিটা ইনস্টল একটা নিজের কোড পায়,
// বন্ধুকে দিলে বন্ধু সেই কোড লিখে বোনাস coins পায় (একবার মাত্র)
/// Generates and validates referral codes entirely on-device (no server).
/// Each install has its own persistent code; redeeming a friend's code
/// grants a one-time coin bonus to the redeemer.
class ReferralManager {
  // SharedPreferences key for this install's own generated referral code.
  static const _myCodeKey = 'mazebloom_my_referral_code';
  // SharedPreferences key tracking whether a code has already been redeemed.
  static const _redeemedKey = 'mazebloom_referral_redeemed';
  // Coins granted to the redeemer when a valid code is successfully redeemed.
  static const int bonusCoins = 25;

  /// Returns this install's referral code, generating and persisting a new
  /// one on first call if none exists yet.
  static Future<String> getMyCode() async {
    final prefs = await SharedPreferences.getInstance();
    var code = prefs.getString(_myCodeKey);
    if (code == null) {
      code = _generateCode();
      await prefs.setString(_myCodeKey, code);
    }
    return code;
  }

  /// Generates a random 6-character referral code using an alphabet that
  /// excludes visually ambiguous characters (e.g. I, O, 0, 1) to reduce
  /// user transcription errors.
  static String _generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final random = Random();
    return List.generate(6, (_) => chars[random.nextInt(chars.length)]).join();
  }

  /// Returns whether this install has already redeemed a referral code
  /// (redemption is allowed only once per install).
  static Future<bool> hasRedeemed() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_redeemedKey) ?? false;
  }

  // বন্ধুর কোড দিয়ে redeem করো — সঠিক ফরম্যাট আর একবারই কাজ করে
  /// Validates and redeems a friend's referral code: checks that this
  /// install hasn't already redeemed one, that the code is well-formed
  /// (6 characters), and that the user isn't redeeming their own code.
  /// On success, marks redemption complete and grants [bonusCoins].
  /// Returns null on success, or a localized error message on failure.
  static Future<String?> redeemCode(String code) async {
    final myCode = await getMyCode();
    final trimmed = code.trim().toUpperCase();

    if (await hasRedeemed()) {
      return tr('তুমি আগেই একটা referral code redeem করেছো।', "You've already redeemed a referral code.");
    }
    if (trimmed.isEmpty || trimmed.length != 6) {
      return tr('কোডটা সঠিক না — ৬ অক্ষরের কোড দিতে হবে।', 'Invalid code — it must be 6 characters.');
    }
    if (trimmed == myCode) {
      return tr('নিজের কোড নিজেই redeem করা যায় না।', "You can't redeem your own code.");
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_redeemedKey, true);
    await CoinManager.addCoins(bonusCoins);
    return null; // null মানে সফল হয়েছে
  }
}
