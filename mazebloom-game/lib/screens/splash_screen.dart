import 'package:flutter/material.dart';
import 'home_screen.dart';
import '../widgets/app_background.dart';

// অ্যাপ খোলার সময় কয়েক সেকেন্ডের জন্য দেখানো হয় — services initialize হওয়া পর্যন্ত একটা পরিচ্ছন্ন loading look
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..forward();
    Future.delayed(const Duration(milliseconds: 1600), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const HomeScreen()));
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: Center(
          child: ScaleTransition(
            scale: CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🌸', style: TextStyle(fontSize: 90)),
                const SizedBox(height: 16),
                const Text(
                  'Maze Bloom',
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1),
                ),
                const SizedBox(height: 24),
                const SizedBox(
                  width: 28,
                  height: 28,
                  child: CircularProgressIndicator(strokeWidth: 3, color: Colors.white70),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
