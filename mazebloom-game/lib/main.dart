import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/splash_screen.dart';
import 'services/ad_service.dart';
import 'services/iap_service.dart';
import 'utils/app_language.dart';
import 'utils/feedback_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AdService.initialize();
  await IapService.initialize();
  await AppLanguage.instance.load();
  await FeedbackService.load();

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
