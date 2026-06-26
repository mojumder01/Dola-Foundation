import 'package:flutter/material.dart';
import '../models/grid_shape.dart';
import 'game_screen.dart';

// প্রথম screen — shape বেছে খেলা শুরু করার জায়গা
// Part 1 এর প্রোটোটাইপ — Part 2 এ এখানে difficulty/mode যুক্ত হবে
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 60),
                const Text('🌸', style: TextStyle(fontSize: 70)),
                const SizedBox(height: 12),
                const Text(
                  'Maze Bloom',
                  style: TextStyle(
                    fontSize: 38,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'পুরো শেপ একটানা path দিয়ে পূরণ করো',
                  style: TextStyle(color: Color(0xFFB0BEC5), fontSize: 14),
                ),
                const SizedBox(height: 48),

                _shapeButton(context, 'বর্গক্ষেত্র (Test)', GridShape.rectangle()),
                const SizedBox(height: 16),
                _shapeButton(context, '🌸 Heart Shape', GridShape.heart()),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _shapeButton(BuildContext context, String label, GridShape shape) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => GameScreen(shape: shape)),
        );
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)]),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [BoxShadow(color: const Color(0xFF7C4DFF).withOpacity(0.5), blurRadius: 20)],
        ),
        child: Center(
          child: Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
