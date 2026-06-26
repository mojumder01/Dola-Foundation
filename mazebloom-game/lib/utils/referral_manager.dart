import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import 'coin_manager.dart';

// সহজ local referral system — backend ছাড়া। প্রতিটা ইনস্টল একটা নিজের কোড পায়,
// বন্ধুকে দিলে বন্ধু সেই কোড লিখে বোনাস coins পায় (একবার মাত্র)
class ReferralManager {
  static const _myCodeKey = 'mazebloom_my_referral_code';
  static const _redeemedKey = 'mazebloom_referral_redeemed';
  static const int bonusCoins = 25;

  static Future<String> getMyCode() async {
    final prefs = await SharedPreferences.getInstance();
    var code = prefs.getString(_myCodeKey);
    if (code == null) {
      code = _generateCode();
      await prefs.setString(_myCodeKey, code);
    }
    return code;
  }

  static String _generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final random = Random();
    return List.generate(6, (_) => chars[random.nextInt(chars.length)]).join();
  }

  static Future<bool> hasRedeemed() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_redeemedKey) ?? false;
  }

  // বন্ধুর কোড দিয়ে redeem করো — সঠিক ফরম্যাট আর একবারই কাজ করে
  static Future<String?> redeemCode(String code) async {
    final myCode = await getMyCode();
    final trimmed = code.trim().toUpperCase();

    if (await hasRedeemed()) {
      return 'তুমি আগেই একটা referral code redeem করেছো।';
    }
    if (trimmed.isEmpty || trimmed.length != 6) {
      return 'কোডটা সঠিক না — ৬ অক্ষরের কোড দিতে হবে।';
    }
    if (trimmed == myCode) {
      return 'নিজের কোড নিজেই redeem করা যায় না।';
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_redeemedKey, true);
    await CoinManager.addCoins(bonusCoins);
    return null; // null মানে সফল হয়েছে
  }
}
