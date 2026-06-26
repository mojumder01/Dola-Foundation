import 'package:flutter/material.dart';
import '../utils/coin_manager.dart';
import '../utils/lives_manager.dart';
import '../utils/referral_manager.dart';
import '../services/ad_service.dart';
import '../utils/app_language.dart';

// Coins, banked lives, আর referral code শেয়ার/redeem করার জায়গা
class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  int _coins = 0;
  int _bankedLives = 0;
  String _myCode = '';
  bool _redeemed = false;
  bool _loading = true;
  final _codeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final coins = await CoinManager.getCoins();
    final lives = await LivesManager.getBankedLives();
    final code = await ReferralManager.getMyCode();
    final redeemed = await ReferralManager.hasRedeemed();
    setState(() {
      _coins = coins;
      _bankedLives = lives;
      _myCode = code;
      _redeemed = redeemed;
      _loading = false;
    });
  }

  void _watchAdForLife() {
    AdService.showRewardedAd(
      onRewarded: () async {
        await LivesManager.addBankedLife();
        await _load();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(tr('🎉 একটা extra life পেয়েছো!', '🎉 You got an extra life!'))),
          );
        }
      },
      onFailed: (reason) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(reason)));
      },
    );
  }

  Future<void> _redeem() async {
    final error = await ReferralManager.redeemCode(_codeController.text);
    if (!mounted) return;
    if (error == null) {
      await _load();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('🎉 ${ReferralManager.bonusCoins} coins পেয়েছো!', '🎉 You got ${ReferralManager.bonusCoins} coins!'))),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
    }
  }

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
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Text(
                            '🎁 ${tr('পুরস্কার', 'Rewards')}',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      Row(
                        children: [
                          Expanded(child: _statCard('🪙', '$_coins', tr('কয়েন', 'Coins'))),
                          const SizedBox(width: 12),
                          Expanded(child: _statCard('❤️', '$_bankedLives / ${LivesManager.maxBankedLives}', tr('ব্যাংক করা লাইফ', 'Banked Lives'))),
                        ],
                      ),
                      const SizedBox(height: 20),

                      GestureDetector(
                        onTap: _watchAdForLife,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFFFFB300), Color(0xFFFF8F00)]),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              tr('📺 বিজ্ঞাপন দেখে Extra Life নাও', '📺 Watch an ad for Extra Life'),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),

                      Text(tr('তোমার Referral Code', 'Your Referral Code'), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Center(
                          child: Text(
                            _myCode,
                            style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 4),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        tr('এই কোড বন্ধুকে দাও — বন্ধু redeem করলে দুইজনেই উপকৃত হবে',
                            'Share this code with a friend — when they redeem it, you both benefit'),
                        style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
                      ),
                      const SizedBox(height: 24),

                      if (!_redeemed) ...[
                        Text(tr('বন্ধুর কোড Redeem করো', "Redeem a friend's code"), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _codeController,
                                textCapitalization: TextCapitalization.characters,
                                style: const TextStyle(color: Colors.white),
                                decoration: InputDecoration(
                                  hintText: tr('কোড লিখো', 'Enter code'),
                                  hintStyle: const TextStyle(color: Colors.white38),
                                  filled: true,
                                  fillColor: Colors.white.withOpacity(0.08),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            ElevatedButton(
                              onPressed: _redeem,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF7C4DFF),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              child: Text(tr('রিডিম', 'Redeem')),
                            ),
                          ],
                        ),
                      ] else
                        Text(tr('✅ তুমি referral বোনাস redeem করেছো', "✅ You've redeemed a referral bonus"), style: const TextStyle(color: Colors.white70)),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _statCard(String emoji, String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 18),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 26)),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
          Text(label, style: const TextStyle(color: Colors.white60, fontSize: 11)),
        ],
      ),
    );
  }
}
