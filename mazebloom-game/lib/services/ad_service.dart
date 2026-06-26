import 'package:google_mobile_ads/google_mobile_ads.dart';

// AdMob Rewarded Ad — extra life, hint, বা continue পাওয়ার জন্য দেখানো হয়
class AdService {
  // Test ID — Play Store এ submit করার আগে real ID দিতে হবে
  // Real ID পেতে: admob.google.com → Apps → Ad Units
  static const String _rewardedAdUnitId =
      'ca-app-pub-3940256099942544/5224354917'; // Google এর test ID

  static RewardedAd? _rewardedAd;
  static bool _isLoaded = false;

  static Future<void> initialize() async {
    await MobileAds.instance.initialize();
    _loadRewardedAd();
  }

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
          Future.delayed(const Duration(seconds: 30), _loadRewardedAd);
        },
      ),
    );
  }

  // Ad দেখাও — পুরো দেখলে onRewarded call হবে (reward এর ধরন caller ঠিক করে)
  static Future<void> showRewardedAd({
    required void Function() onRewarded,
    required void Function(String reason) onFailed,
  }) async {
    if (!_isLoaded || _rewardedAd == null) {
      onFailed('বিজ্ঞাপন এখনো লোড হয়নি। একটু পরে চেষ্টা করো।');
      _loadRewardedAd();
      return;
    }

    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _isLoaded = false;
        _rewardedAd = null;
        _loadRewardedAd();
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
      onUserEarnedReward: (ad, reward) => onRewarded(),
    );
  }

  static bool get isAdLoaded => _isLoaded;
}
