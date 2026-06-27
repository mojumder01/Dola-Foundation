// Daily spin-wheel screen: lets the player spin once for free per day, then
// watch rewarded ads for additional spins, earning random coin amounts.
import 'dart:math';
import 'package:flutter/material.dart';
import '../utils/spin_wheel_manager.dart';
import '../utils/coin_manager.dart';
import '../utils/app_language.dart';
import '../services/ad_service.dart';
import '../widgets/app_background.dart';
import '../widgets/three_d_style.dart';

// দিনে ৩ বার পর্যন্ত spin করে কয়েন পাওয়ার চাকা — ১টা ফ্রি, বাকিগুলো বিজ্ঞাপন দেখে
/// Stateful widget hosting the daily spin wheel UI and reward logic.
class SpinWheelScreen extends StatefulWidget {
  const SpinWheelScreen({super.key});

  @override
  State<SpinWheelScreen> createState() => _SpinWheelScreenState();
}

/// Drives the spin-wheel animation, tracks today's spin count, and awards
/// coins when a spin completes.
class _SpinWheelScreenState extends State<SpinWheelScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  // Current wheel rotation in radians; also the animation start point for the next spin.
  double _angle = 0;
  bool _spinning = false;
  int _spinsUsed = 0;
  int? _lastReward;
  final _random = Random();

  // Colors cycled across wheel segments, matched to SpinWheelManager.wheelRewards by index.
  static const List<Color> _segmentColors = [
    Color(0xFF7C4DFF), Color(0xFF26A69A), Color(0xFFEF5350), Color(0xFFFFA000),
    Color(0xFF42A5F5), Color(0xFFEC407A), Color(0xFFFFD54F), Color(0xFF66BB6A),
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 3));
    _load();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// Loads how many spins have already been used today.
  Future<void> _load() async {
    final used = await SpinWheelManager.spinsUsedToday();
    setState(() => _spinsUsed = used);
  }

  /// Handles a spin button tap: blocks re-entry while spinning, checks
  /// remaining spins, and either spins immediately (free spin) or requires
  /// watching a rewarded ad first.
  Future<void> _onSpinPressed() async {
    if (_spinning) return;
    final hasFree = await SpinWheelManager.hasFreeSpinLeft();
    final hasAny = await SpinWheelManager.hasAnySpinLeft();
    if (!hasAny) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('আজকের জন্য spin শেষ — কালকে আবার আসো', "You're out of spins for today — come back tomorrow"))),
        );
      }
      return;
    }
    if (hasFree) {
      _doSpin();
    } else {
      AdService.showRewardedAd(
        onRewarded: _doSpin,
        onFailed: (reason) {
          if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(reason)));
        },
      );
    }
  }

  /// Picks a random reward segment, computes the rotation angle needed to
  /// land on it under the fixed pointer, animates the wheel, then persists
  /// the spin and grants the coin reward once the animation finishes.
  Future<void> _doSpin() async {
    final segmentIndex = _random.nextInt(SpinWheelManager.wheelRewards.length);
    final reward = SpinWheelManager.wheelRewards[segmentIndex];
    final segmentAngle = 2 * pi / SpinWheelManager.wheelRewards.length;
    // Pointer উপরে fixed থাকে — চাকা ঘুরে যাতে বাছা segment টা ঠিক pointer এর নিচে আসে
    final targetAngle = -(segmentIndex * segmentAngle + segmentAngle / 2);
    final extraSpins = 4 + _random.nextInt(3);
    final finalAngle = _angle + extraSpins * 2 * pi + (targetAngle - (_angle % (2 * pi)));

    setState(() {
      _spinning = true;
      _lastReward = null;
    });

    final animation = Tween<double>(begin: _angle, end: finalAngle).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
    void listener() => setState(() => _angle = animation.value);
    animation.addListener(listener);
    _controller.reset();
    await _controller.forward();
    animation.removeListener(listener);

    await SpinWheelManager.recordSpin();
    await CoinManager.addCoins(reward);
    final used = await SpinWheelManager.spinsUsedToday();
    setState(() {
      _spinning = false;
      _lastReward = reward;
      _spinsUsed = used;
    });
  }

  /// Builds the wheel UI: header, rotating wheel with fixed pointer, last
  /// reward text, and a spin button whose label reflects free/ad-gated/
  /// exhausted spin state.
  @override
  Widget build(BuildContext context) {
    final spinsLeft = SpinWheelManager.maxSpinsPerDay - _spinsUsed;
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: ThreeD.decoration(
                          colors: [Colors.white.withOpacity(0.1)],
                          radius: 12,
                        ),
                        child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Text(
                      '🎡 ${tr('স্পিন হুইল', 'Spin Wheel')}',
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const Spacer(),
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Transform.rotate(
                      angle: _angle,
                      child: CustomPaint(
                        size: const Size(280, 280),
                        painter: _WheelPainter(rewards: SpinWheelManager.wheelRewards, colors: _segmentColors),
                      ),
                    ),
                    const Positioned(
                      top: -6,
                      child: Icon(Icons.arrow_drop_down, color: Colors.white, size: 48),
                    ),
                  ],
                ),
                const SizedBox(height: 28),
                if (_lastReward != null && !_spinning)
                  Text(
                    tr('🎉 তুমি 🪙$_lastReward পেয়েছো!', '🎉 You won 🪙$_lastReward!'),
                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                const Spacer(),
                GestureDetector(
                  onTap: spinsLeft > 0 ? _onSpinPressed : null,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: ThreeD.decoration(
                      colors: spinsLeft > 0
                          ? const [Color(0xFFFFB300), Color(0xFFFF8F00)]
                          : [Colors.grey.shade700, Colors.grey.shade800],
                      radius: 16,
                      flat: spinsLeft <= 0,
                    ),
                    child: Center(
                      child: Text(
                        _spinning
                            ? tr('ঘুরছে...', 'Spinning...')
                            : spinsLeft <= 0
                                ? tr('আজকের spin শেষ', 'Out of spins today')
                                : (_spinsUsed == 0
                                    ? tr('🎡 ফ্রি স্পিন করো', '🎡 Free Spin')
                                    : tr('📺 বিজ্ঞাপন দেখে স্পিন করো ($spinsLeft বাকি)', '📺 Watch ad to Spin ($spinsLeft left)')),
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Paints the spin wheel as colored pie segments with the reward amount
/// labeled in each segment, plus an outer ring border.
class _WheelPainter extends CustomPainter {
  final List<int> rewards;
  final List<Color> colors;

  _WheelPainter({required this.rewards, required this.colors});

  /// Draws each reward segment as an arc starting from the top (12 o'clock),
  /// with its reward value centered within the segment.
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final segmentAngle = 2 * pi / rewards.length;

    for (var i = 0; i < rewards.length; i++) {
      final paint = Paint()..color = colors[i % colors.length];
      final startAngle = i * segmentAngle - pi / 2;
      canvas.drawArc(Rect.fromCircle(center: center, radius: radius), startAngle, segmentAngle, true, paint);

      final labelAngle = startAngle + segmentAngle / 2;
      final labelOffset = Offset(
        center.dx + (radius * 0.65) * cos(labelAngle),
        center.dy + (radius * 0.65) * sin(labelAngle),
      );
      final textPainter = TextPainter(
        text: TextSpan(
          text: '🪙${rewards[i]}',
          style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(canvas, labelOffset - Offset(textPainter.width / 2, textPainter.height / 2));
    }

    canvas.drawCircle(center, radius, Paint()
      ..color = Colors.white.withOpacity(0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4);
  }

  // Static reward/color data — never needs repainting once drawn.
  @override
  bool shouldRepaint(covariant _WheelPainter oldDelegate) => false;
}
