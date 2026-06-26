import 'dart:math';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'iap_service.dart';

// AdMob Rewarded + Interstitial Ad — extra life/hint reward আর session এর মাঝে মাঝে interstitial দেখায়
class AdService {
  // Test ID — Play Store এ submit করার আগে real ID দিতে হবে
  // Real ID পেতে: admob.google.com → Apps → Ad Units
  static const String _rewardedAdUnitId =
      'ca-app-pub-3940256099942544/5224354917'; // Google এর test ID
  static const String _interstitialAdUnitId =
      'ca-app-pub-3940256099942544/1033173712'; // Google এর test ID

  static RewardedAd? _rewardedAd;
  static bool _isLoaded = false;

  static InterstitialAd? _interstitialAd;
  static bool _interstitialLoaded = false;
  static int _sessionCount = 0;
  static final Random _random = Random();

  static Future<void> initialize() async {
    await MobileAds.instance.initialize();
    _loadRewardedAd();
    _loadInterstitialAd();
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

  static void _loadInterstitialAd() {
    InterstitialAd.load(
      adUnitId: _interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          _interstitialLoaded = true;
        },
        onAdFailedToLoad: (error) {
          _interstitialLoaded = false;
          _interstitialAd = null;
          Future.delayed(const Duration(seconds: 30), _loadInterstitialAd);
        },
      ),
    );
  }

  // লেভেল/গেম সেশন শেষ হলে কল করো — Remove Ads কেনা না থাকলে ২-৩ সেশনে একবার র‍্যান্ডমলি interstitial দেখায়
  static void maybeShowInterstitial() {
    if (IapService.adsRemoved) return;
    _sessionCount++;
    if (_sessionCount < 2) return;
    final shouldShow = _sessionCount >= 3 || _random.nextBool();
    if (!shouldShow) return;
    _sessionCount = 0;
    if (!_interstitialLoaded || _interstitialAd == null) return;

    _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _interstitialLoaded = false;
        _interstitialAd = null;
        _loadInterstitialAd();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        ad.dispose();
        _interstitialLoaded = false;
        _interstitialAd = null;
        _loadInterstitialAd();
      },
    );
    _interstitialAd!.show();
  }
}
