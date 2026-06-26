import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../utils/coin_manager.dart';
import '../utils/gem_manager.dart';
import '../utils/lives_manager.dart';
import '../utils/referral_manager.dart';
import '../services/ad_service.dart';
import '../services/iap_service.dart';
import '../utils/app_language.dart';
import '../utils/app_links.dart';
import '../utils/path_color_manager.dart';
import '../widgets/app_background.dart';
import 'spin_wheel_screen.dart';

// Coins, banked lives, আর referral code শেয়ার/redeem করার জায়গা
class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  static const int lifeCoinCost = 15;
  static const int lifeBundleGemCost = 8;
  static const int lifeBundleAmount = 3;

  int _coins = 0;
  int _gems = 0;
  int _bankedLives = 0;
  String _myCode = '';
  bool _redeemed = false;
  bool _loading = true;
  String _selectedColorId = PathColorManager.defaultId;
  Set<String> _unlockedColorIds = {};
  final _codeController = TextEditingController();
  StreamSubscription<void>? _iapSubscription;

  @override
  void initState() {
    super.initState();
    _load();
    // Real-money purchase সফল হলে IapService event পাঠায় — তখন রিফ্রেশ করো
    _iapSubscription = IapService.changes.listen((_) => _load());
  }

  @override
  void dispose() {
    _codeController.dispose();
    _iapSubscription?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    if (IapService.diamondColorUnlocked) {
      await PathColorManager.unlockPremium(PathColorManager.diamondId);
    }
    final coins = await CoinManager.getCoins();
    final gems = await GemManager.getGems();
    final lives = await LivesManager.getBankedLives();
    final code = await ReferralManager.getMyCode();
    final redeemed = await ReferralManager.hasRedeemed();
    final selectedColorId = await PathColorManager.getSelectedId();
    final unlockedColorIds = await PathColorManager.getUnlockedIds();
    setState(() {
      _coins = coins;
      _gems = gems;
      _bankedLives = lives;
      _myCode = code;
      _redeemed = redeemed;
      _selectedColorId = selectedColorId;
      _unlockedColorIds = unlockedColorIds;
      _loading = false;
    });
  }

  Future<void> _buyLifeWithCoins() async {
    if (_bankedLives >= LivesManager.maxBankedLives) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('ব্যাংক পূর্ণ — আর লাইফ ধরে না', 'Bank is full — no room for more lives'))),
      );
      return;
    }
    final spent = await CoinManager.spendCoins(lifeCoinCost);
    if (!spent) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
      );
      return;
    }
    await LivesManager.addBankedLife();
    await _load();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('🎉 একটা extra life পেয়েছো!', '🎉 You got an extra life!'))),
      );
    }
  }

  Future<void> _buyOrSelectColor(PathColorOption option) async {
    final alreadyUnlocked = _unlockedColorIds.contains(option.id);

    if (option.isPremium && !alreadyUnlocked) {
      final started = await IapService.buy(IapService.diamondColorProductId);
      if (!started && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('এই মুহূর্তে কেনা যাচ্ছে না — পরে চেষ্টা করো', 'Purchase unavailable right now — try again later'))),
        );
      }
      return;
    }

    if (!alreadyUnlocked && _coins < option.cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
      );
      return;
    }
    final ok = await PathColorManager.purchase(option.id);
    if (ok) await _load();
  }

  Future<void> _buyRemoveAds() async {
    final started = await IapService.buy(IapService.removeAdsProductId);
    if (!started && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('এই মুহূর্তে কেনা যাচ্ছে না — পরে চেষ্টা করো', 'Purchase unavailable right now — try again later'))),
      );
    }
  }

  Future<void> _rateUs() async {
    final uri = Uri.parse(AppLinks.playStoreUrl);
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<void> _contactUs() async {
    final uri = Uri(
      scheme: 'mailto',
      path: AppLinks.supportEmail,
      query: 'subject=${Uri.encodeComponent('Maze Bloom Feedback')}',
    );
    await launchUrl(uri);
  }

  Future<void> _buyLifeBundleWithGems() async {
    final roomLeft = LivesManager.maxBankedLives - _bankedLives;
    if (roomLeft <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('ব্যাংক পূর্ণ — আর লাইফ ধরে না', 'Bank is full — no room for more lives'))),
      );
      return;
    }
    final spent = await GemManager.spendGems(lifeBundleGemCost);
    if (!spent) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট জেম নেই', 'Not enough gems'))),
      );
      return;
    }
    final toAdd = min(lifeBundleAmount, roomLeft);
    for (var i = 0; i < toAdd; i++) {
      await LivesManager.addBankedLife();
    }
    await _load();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('💎 $toAdd টা extra life পেয়েছো!', '💎 You got $toAdd extra lives!'))),
      );
    }
  }

  void _openSpinWheel() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const SpinWheelScreen())).then((_) => _load());
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
      body: AppBackground(
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
                          Expanded(child: _statCard('💎', '$_gems', tr('জেম', 'Gems'))),
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
                      const SizedBox(height: 12),

                      GestureDetector(
                        onTap: _openSpinWheel,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFF7C4DFF), Color(0xFF512DA8)]),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              tr('🎡 দৈনিক স্পিন হুইল', '🎡 Daily Spin Wheel'),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      GestureDetector(
                        onTap: _buyLifeWithCoins,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFFEF5350), Color(0xFFB71C1C)]),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              tr('❤️ $lifeCoinCost কয়েন দিয়ে Extra Life কিনো', '❤️ Buy an Extra Life for $lifeCoinCost coins'),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      GestureDetector(
                        onTap: _buyLifeBundleWithGems,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFF26C6DA), Color(0xFF00838F)]),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              tr('💎 $lifeBundleGemCost জেম দিয়ে $lifeBundleAmountটা Extra Life কিনো',
                                  '💎 Buy $lifeBundleAmount Extra Lives for $lifeBundleGemCost gems'),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),

                      Text(tr('🎨 Path এর রঙ', '🎨 Path Color'), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: PathColorManager.options.map((option) {
                          final unlocked = _unlockedColorIds.contains(option.id);
                          final selected = option.id == _selectedColorId;
                          String priceLabel;
                          if (unlocked) {
                            priceLabel = selected ? tr('বাছা হয়েছে', 'Selected') : tr('আনলকড', 'Unlocked');
                          } else if (option.isPremium) {
                            priceLabel = IapService.productFor(IapService.diamondColorProductId)?.price ?? tr('প্রিমিয়াম', 'Premium');
                          } else {
                            priceLabel = '🪙${option.cost}';
                          }
                          return GestureDetector(
                            onTap: () => _buyOrSelectColor(option),
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(14),
                                border: selected
                                    ? Border.all(color: Colors.white, width: 2)
                                    : (option.isPremium ? Border.all(color: const Color(0xFF00E5FF).withOpacity(0.5), width: 1.5) : null),
                              ),
                              child: Column(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(color: option.color, shape: BoxShape.circle),
                                    child: option.isPremium && !unlocked
                                        ? const Icon(Icons.diamond, color: Colors.white, size: 16)
                                        : null,
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    priceLabel,
                                    style: const TextStyle(color: Colors.white70, fontSize: 10),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 28),

                      Text(tr('🛍️ আরও সুবিধা', '🛍️ More Perks'), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                      if (IapService.adsRemoved)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Center(
                            child: Text(tr('✅ বিজ্ঞাপন সরানো হয়েছে', '✅ Ads removed'), style: const TextStyle(color: Colors.white70)),
                          ),
                        )
                      else
                        GestureDetector(
                          onTap: _buyRemoveAds,
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(colors: [Color(0xFF42A5F5), Color(0xFF1565C0)]),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Center(
                              child: Text(
                                IapService.productFor(IapService.removeAdsProductId) != null
                                    ? tr('🚫 বিজ্ঞাপন সরাও — ${IapService.productFor(IapService.removeAdsProductId)!.price}',
                                        '🚫 Remove Ads — ${IapService.productFor(IapService.removeAdsProductId)!.price}')
                                    : tr('🚫 বিজ্ঞাপন সরাও', '🚫 Remove Ads'),
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: _rateUs,
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.08),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Center(
                                  child: Text(tr('⭐ রেট করো', '⭐ Rate Us'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: GestureDetector(
                              onTap: _contactUs,
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.08),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Center(
                                  child: Text(tr('✉️ যোগাযোগ করো', '✉️ Contact Us'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            ),
                          ),
                        ],
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
