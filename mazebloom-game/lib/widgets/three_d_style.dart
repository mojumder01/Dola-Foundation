import 'package:flutter/material.dart';

// পুরো app এ আগে সব Container flat ছিল (solid color/gradient + borderRadius,
// কোনো shadow/bevel ছাড়া) — এই ফাইলটা একটা shared "3D look" তৈরি করে: গাঢ়
// drop shadow নিচে-ডানে (raised/floating অনুভূতি) আর হালকা highlight উপরে-বামে
// (bevel/গ্লসি অনুভূতি), যাতে button/card/tile সব জায়গায় একই রকম depth পায়।
/// Shared depth-styling helpers used to give every button/card/tile across
/// the app a consistent raised "3D" look (drop shadow + top-left highlight
/// bevel), replacing the previously flat, shadowless decorations.
class ThreeD {
  ThreeD._();

  /// Returns a layered drop-shadow list that reads as "raised off the
  /// background." [color] tints the shadow (defaults to black) and
  /// [elevation] scales blur/offset/opacity together.
  static List<BoxShadow> shadow({Color color = Colors.black, double elevation = 8}) {
    return [
      BoxShadow(
        color: color.withOpacity(0.5),
        blurRadius: elevation,
        offset: Offset(0, elevation * 0.55),
      ),
      BoxShadow(
        color: color.withOpacity(0.28),
        blurRadius: elevation * 2.6,
        offset: Offset(0, elevation * 1.1),
      ),
    ];
  }

  /// A subtle inset-look shadow for tiles that should appear pressed/locked
  /// rather than raised (e.g. a locked level tile).
  static List<BoxShadow> shadowFlat() {
    return [
      BoxShadow(
        color: Colors.black.withOpacity(0.18),
        blurRadius: 4,
        offset: const Offset(0, 2),
      ),
    ];
  }

  /// Wraps [colors] into a gradient with a brighter top-left and darker
  /// bottom-right, giving a glossy bevel highlight on top of whatever base
  /// colors the caller already uses.
  static LinearGradient bevelGradient(List<Color> colors) {
    if (colors.length == 1) {
      final c = colors.first;
      return LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [_lighten(c, 0.18), c, _darken(c, 0.16)],
      );
    }
    return LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [_lighten(colors.first, 0.18), ...colors, _darken(colors.last, 0.16)],
    );
  }

  /// A thin semi-transparent top-left highlight border, layered on top of a
  /// gradient/solid fill to fake a beveled edge catching light.
  static Border bevelBorder({double opacity = 0.5}) {
    return Border(
      top: BorderSide(color: Colors.white.withOpacity(opacity), width: 1.5),
      left: BorderSide(color: Colors.white.withOpacity(opacity * 0.7), width: 1.5),
      right: BorderSide(color: Colors.black.withOpacity(0.28), width: 1.5),
      bottom: BorderSide(color: Colors.black.withOpacity(0.28), width: 1.5),
    );
  }

  /// One-call decoration combining [bevelGradient], [bevelBorder], a raised
  /// [shadow], and rounded corners — the standard "3D card/button" look used
  /// across the app. Pass [flat] for locked/disabled tiles that should sit
  /// recessed instead of raised.
  static BoxDecoration decoration({
    required List<Color> colors,
    double radius = 16,
    bool flat = false,
    Color shadowColor = Colors.black,
  }) {
    return BoxDecoration(
      gradient: bevelGradient(colors),
      borderRadius: BorderRadius.circular(radius),
      border: flat ? null : bevelBorder(),
      boxShadow: flat ? shadowFlat() : shadow(color: shadowColor),
    );
  }

  static Color _lighten(Color c, double amount) {
    final hsl = HSLColor.fromColor(c);
    return hsl.withLightness((hsl.lightness + amount).clamp(0.0, 1.0)).toColor();
  }

  static Color _darken(Color c, double amount) {
    final hsl = HSLColor.fromColor(c);
    return hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0)).toColor();
  }
}
