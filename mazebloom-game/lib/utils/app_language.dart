import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppLang { en, bn }

// পুরো অ্যাপের ভাষা — default English, টগল করলে SharedPreferences এ সেভ থাকে
// যাতে পরের বার অ্যাপ খুললেও মনে থাকে।
class AppLanguage extends ChangeNotifier {
  AppLanguage._();
  static final AppLanguage instance = AppLanguage._();
  static const _key = 'mazebloom_lang';

  AppLang _lang = AppLang.en;
  AppLang get lang => _lang;
  bool get isBangla => _lang == AppLang.bn;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _lang = prefs.getString(_key) == 'bn' ? AppLang.bn : AppLang.en;
    notifyListeners();
  }

  Future<void> toggle() async {
    _lang = isBangla ? AppLang.en : AppLang.bn;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, isBangla ? 'bn' : 'en');
  }

  String t(String bn, String en) => isBangla ? bn : en;
}

// সংক্ষিপ্ত shorthand — UI কোডে AppLanguage.instance.t(...) এর বদলে tr(...) লেখা যায়
String tr(String bn, String en) => AppLanguage.instance.t(bn, en);
