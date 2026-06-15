import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../utils/coin_manager.dart';

// AdMob Rewarded Ad — দেখলে 15 coins পাওয়া যায়
class AdService {
  // Test ID — Play Store এ submit করার আগে real ID দিতে হবে
  // Real ID পেতে: admob.google.com → Apps → Ad Units
  static const String _rewardedAdUnitId =
      'ca-app-pub-3940256099942544/5224354917'; // Google এর test ID

  static RewardedAd? _rewardedAd;
  static bool _isLoaded = false;

  // প্রতি ad দেখলে কত coins পাওয়া যাবে
  static const int coinsPerAd = 15;

  // App শুরুতে একবার call করো
  static Future<void> initialize() async {
    await MobileAds.instance.initialize();
    _loadRewardedAd(); // প্রথম ad load করে রাখো
  }

  // Background এ ad load করে রাখো যাতে দ্রুত দেখানো যায়
  static void _loadRewardedAd() {
    RewardedAd.load(
      adUnitId: _rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isLoaded = true;
        },
        onAdFailedToLoad: (error) {
          _isLoaded = false;
          _rewardedAd = null;
          // কিছুক্ষণ পরে আবার try করো
          Future.delayed(
            const Duration(seconds: 30),
            _loadRewardedAd,
          );
        },
      ),
    );
  }

  // Ad দেখাও — পুরো দেখলে onRewarded call হবে
  static Future<void> showRewardedAd({
    required void Function(int coins) onRewarded,
    required void Function(String reason) onFailed,
  }) async {
    if (!_isLoaded || _rewardedAd == null) {
      onFailed('বিজ্ঞাপন এখনো লোড হয়নি। একটু পরে চেষ্টা করো।');
      _loadRewardedAd(); // আবার load শুরু করো
      return;
    }

    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _isLoaded = false;
        _rewardedAd = null;
        _loadRewardedAd(); // পরের ad তৈরি রাখো
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        ad.dispose();
        _isLoaded = false;
        _rewardedAd = null;
        _loadRewardedAd();
        onFailed('বিজ্ঞাপন দেখাতে সমস্যা হলো।');
      },
    );

    await _rewardedAd!.show(
      onUserEarnedReward: (ad, reward) async {
        // User পুরো ad দেখেছে — coins দাও
        await CoinManager.addCoins(coinsPerAd);
        onRewarded(coinsPerAd);
      },
    );
  }

  static bool get isAdLoaded => _isLoaded;
}
