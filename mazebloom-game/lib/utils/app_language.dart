// Provides app-wide language switching (English/Bengali) with persistence,
// and a global tr() shorthand used throughout the UI for inline translation.
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Supported app languages.
enum AppLang { en, bn }

// পুরো অ্যাপের ভাষা — default English, টগল করলে SharedPreferences এ সেভ থাকে
// যাতে পরের বার অ্যাপ খুললেও মনে থাকে।
/// Singleton ChangeNotifier holding the app's current language. Widgets can
/// listen to this to rebuild on language toggle; the chosen language is
/// persisted so it's remembered across app restarts.
class AppLanguage extends ChangeNotifier {
  AppLanguage._();
  /// Global singleton instance — use this rather than constructing directly.
  static final AppLanguage instance = AppLanguage._();
  // SharedPreferences key used to persist the selected language.
  static const _key = 'mazebloom_lang';

  AppLang _lang = AppLang.en;
  AppLang get lang => _lang;
  /// True if the current language is Bengali.
  bool get isBangla => _lang == AppLang.bn;

  /// Loads the persisted language preference (defaults to English) and
  /// notifies listeners. Call once during app startup.
  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _lang = prefs.getString(_key) == 'bn' ? AppLang.bn : AppLang.en;
    notifyListeners();
  }

  /// Switches between English and Bengali, notifies listeners immediately
  /// for a responsive UI, then persists the new choice.
  Future<void> toggle() async {
    _lang = isBangla ? AppLang.en : AppLang.bn;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, isBangla ? 'bn' : 'en');
  }

  /// Returns [bn] or [en] depending on the current language setting.
  String t(String bn, String en) => isBangla ? bn : en;
}

// সংক্ষিপ্ত shorthand — UI কোডে AppLanguage.instance.t(...) এর বদলে tr(...) লেখা যায়
/// Shorthand for `AppLanguage.instance.t(bn, en)`, used throughout UI code
/// to inline bilingual text without referencing the singleton directly.
String tr(String bn, String en) => AppLanguage.instance.t(bn, en);
