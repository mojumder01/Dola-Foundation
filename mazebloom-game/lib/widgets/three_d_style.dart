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

  // আগে প্রতিটা shadow ২টা stacked BoxShadow (বড় blurRadius সহ) রিটার্ন করতো,
  // আর প্রায় প্রতিটা button/badge/card এ একসাথে এটা+border+gradient বসানো
  // ছিল — কম শক্তিশালী ফোনে এতগুলো ভারী blur layer একসাথে rasterize করতে
  // গিয়ে UI freeze/black-out হয়ে যাচ্ছিলো। তাই এখন একটাই lightweight shadow।
  /// Returns a single, cheap drop-shadow that reads as "raised off the
  /// background" without the rendering cost of multiple stacked blurred
  /// layers (which caused freezes/black screens on lower-end devices when
  /// many shadowed widgets were on screen at once).
  static List<BoxShadow> shadow({Color color = Colors.black, double elevation = 6}) {
    return [
      BoxShadow(
        color: color.withOpacity(0.4),
        blurRadius: elevation,
        offset: Offset(0, elevation * 0.5),
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

  // আগে এটা চার পাশে চার রকম রঙের border দিতো (উপরে-বামে সাদা, নিচে-ডানে
  // কালো) — কিন্তু Flutter এ ভিন্ন রঙের side ওয়ালা Border কে borderRadius এর
  // সাথে আঁকা যায় না: প্রতিটা frame এ paint-এর সময় exception ছুঁড়তো, ফলে
  // gradient আঁকা হলেও ভেতরের Text/Icon (button এর title সহ!) আর আঁকা হতো না,
  // আর একটানা exception এ স্ক্রিন black হয়ে আটকে যেত। তাই এখন এক রঙের
  // (uniform) হালকা সাদা border — bevel এর আলো-ছায়ার কাজটা bevelGradient
  // এমনিতেই করে দেয়।
  /// A thin uniform semi-transparent highlight border giving the edge a
  /// glossy rim. Must stay uniform (same color on all sides): Flutter cannot
  /// paint a mixed-color Border together with a borderRadius — it throws
  /// during paint, which stopped the children (button titles/icons) from
  /// ever rendering.
  static Border bevelBorder({double opacity = 0.5}) {
    return Border.all(color: Colors.white.withOpacity(opacity * 0.7), width: 1.5);
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
