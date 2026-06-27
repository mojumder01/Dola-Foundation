import 'dart:io';
import 'package:flutter/material.dart';

// সব screen এ একই রকম richer-looking background — flat gradient এর বদলে
// soft glow blob গুলো দিয়ে একটু depth/visual interest যুক্ত করে।
// gradientColors/imagePath দিলে GameScreen এ customizable background ও দেখানো যায় (#18)
// This file provides the shared decorative background widget reused across
// app screens, supporting a default gradient, custom gradient colors, or a
// user-supplied background image.

/// A full-screen background wrapper that renders either a default dark
/// gradient with soft glow blobs, a custom gradient, or a custom image
/// (with a dark scrim for readability), behind the given [child] content.
class AppBackground extends StatelessWidget {
  final Widget child;
  // optional override for the gradient colors
  final List<Color>? gradientColors;
  // optional custom background image path; takes precedence over gradient glow
  final String? imagePath;
  final bool isLight; // হালকা (light) থিম হলে — UI এর সাদা টেক্সট পড়া যাওয়ার জন্য একটা scrim বসানো হয়

  const AppBackground({super.key, required this.child, this.gradientColors, this.imagePath, this.isLight = false});

  // Default dark gradient colors used when no custom gradientColors are provided.
  static const List<Color> _defaultColors = [
    Color(0xFF12121F), Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460),
  ];

  /// Builds the gradient base layer plus either the custom image (with a
  /// dark scrim overlay) or the default decorative glow blobs, with the
  /// page [child] rendered on top.
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

  /// Builds a single soft circular glow blob of the given color/size, used
  /// as a decorative layer to add depth to the default background.
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
