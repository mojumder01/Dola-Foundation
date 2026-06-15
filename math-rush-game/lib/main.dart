import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/home_screen.dart';
import 'services/ad_service.dart';

// অ্যাপের entry point — এখান থেকে সব শুরু হয়
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // AdMob initialize করো — coin system এর জন্য দরকার
  await AdService.initialize();

  // Phone সবসময় portrait mode এ থাকবে — গেমের জন্য দরকার
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Status bar transparent করো যাতে গেম full-screen মনে হয়
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const MathRushApp());
}

class MathRushApp extends StatelessWidget {
  const MathRushApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // Play Store এ যা দেখাবে
      title: 'Math Rush - গণিত চ্যালেঞ্জ',

      // Debug banner সরাও — release build এ এটা থাকে না, তবে dev এ দেখতে ভালো না
      debugShowCheckedModeBanner: false,

      theme: ThemeData(
        useMaterial3: true,
        // Dark theme — গেমের dark background এর সাথে মানানসই
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7C4DFF),
          brightness: Brightness.dark,
        ),
        // Dialog, AlertDialog এর জন্য font
        fontFamily: 'Roboto',
      ),

      // প্রথম screen
      home: const HomeScreen(),
    );
  }
}
