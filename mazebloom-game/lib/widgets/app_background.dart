import 'dart:io';
import 'package:flutter/material.dart';

// সব screen এ একই রকম richer-looking background — flat gradient এর বদলে
// soft glow blob গুলো দিয়ে একটু depth/visual interest যুক্ত করে।
// gradientColors/imagePath দিলে GameScreen এ customizable background ও দেখানো যায় (#18)
class AppBackground extends StatelessWidget {
  final Widget child;
  final List<Color>? gradientColors;
  final String? imagePath;
  final bool isLight; // হালকা (light) থিম হলে — UI এর সাদা টেক্সট পড়া যাওয়ার জন্য একটা scrim বসানো হয়

  const AppBackground({super.key, required this.child, this.gradientColors, this.imagePath, this.isLight = false});

  static const List<Color> _defaultColors = [
    Color(0xFF12121F), Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460),
  ];

  @override
  Widget build(BuildContext context) {
    final colors = gradientColors ?? _defaultColors;
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: colors,
        ),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (imagePath != null) ...[
            Image.file(File(imagePath!), fit: BoxFit.cover),
            Container(color: Colors.black.withOpacity(0.55)),
          ] else ...[
            Positioned(top: -90, left: -70, child: _glow(const Color(0xFF7C4DFF), 240)),
            Positioned(bottom: -110, right: -90, child: _glow(const Color(0xFF26A69A), 280)),
            Positioned(top: 220, right: -70, child: _glow(const Color(0xFFFF7043), 170)),
            if (isLight) Container(color: Colors.black.withOpacity(0.35)),
          ],
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
