import 'package:flutter/material.dart';

// সব screen এ একই রকম richer-looking background — flat gradient এর বদলে
// soft glow blob গুলো দিয়ে একটু depth/visual interest যুক্ত করে
class AppBackground extends StatelessWidget {
  final Widget child;

  const AppBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF12121F), Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
          stops: [0.0, 0.35, 0.7, 1.0],
        ),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Positioned(top: -90, left: -70, child: _glow(const Color(0xFF7C4DFF), 240)),
          Positioned(bottom: -110, right: -90, child: _glow(const Color(0xFF26A69A), 280)),
          Positioned(top: 220, right: -70, child: _glow(const Color(0xFFFF7043), 170)),
          child,
        ],
      ),
    );
  }

  Widget _glow(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color.withOpacity(0.28), color.withOpacity(0.0)],
        ),
      ),
    );
  }
}
