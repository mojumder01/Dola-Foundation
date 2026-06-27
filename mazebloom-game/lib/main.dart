// Entry point of the Maze Bloom app. Bootstraps core services (ads, in-app
// purchases, language, feedback/haptics) before rendering the root widget.
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/splash_screen.dart';
import 'services/ad_service.dart';
import 'services/iap_service.dart';
import 'utils/app_language.dart';
import 'utils/feedback_service.dart';

/// App entry point. Performs async initialization of all global singleton
/// services before the widget tree is built, then locks the UI to portrait
/// orientation and configures the system status bar style.
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AdService.initialize();
  await IapService.initialize();
  await AppLanguage.instance.load();
  await FeedbackService.load();

  // Maze Bloom is portrait-only; landscape is not supported by the UI.
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const MazeBloomApp());
}

/// Root widget of the application. Wraps the [MaterialApp] in an
/// [AnimatedBuilder] so that changing the selected language (via
/// [AppLanguage.instance]) triggers a full app rebuild, updating every
/// widget that calls the `tr(...)` translation helper.
class MazeBloomApp extends StatelessWidget {
  const MazeBloomApp({super.key});

  @override
  Widget build(BuildContext context) {
    // AppLanguage বদলালে পুরো অ্যাপ rebuild হয় — যেখানেই tr(...) ব্যবহার হয়েছে সব আপডেট হবে
    return AnimatedBuilder(
      animation: AppLanguage.instance,
      builder: (context, _) => MaterialApp(
        title: 'Maze Bloom',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF7C4DFF),
            brightness: Brightness.dark,
          ),
          fontFamily: 'Roboto',
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
