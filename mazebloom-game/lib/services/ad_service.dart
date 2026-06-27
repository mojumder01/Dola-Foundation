// This file wraps the Google Mobile Ads SDK to manage rewarded and
// interstitial ad lifecycles (loading, showing, auto-reloading on failure)
// for the rest of the app.
import 'dart:math';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'iap_service.dart';

// AdMob Rewarded + Interstitial Ad — extra life/hint reward আর session এর মাঝে মাঝে interstitial দেখায়
/// Static service that loads/shows AdMob rewarded and interstitial ads.
/// Rewarded ads grant in-game rewards (e.g. extra life/hint) only after the
/// user fully watches them; interstitials are shown occasionally between
/// sessions unless the user has purchased "Remove Ads" via [IapService].
class AdService {
  // Test ID — Play Store এ submit করার আগে real ID দিতে হবে
  // Real ID পেতে: admob.google.com → Apps → Ad Units
  // NOTE: These are Google's public test ad unit IDs; replace with real
  // AdMob unit IDs before publishing to production.
  static const String _rewardedAdUnitId =
      'ca-app-pub-3940256099942544/5224354917'; // Google এর test ID
  static const String _interstitialAdUnitId =
      'ca-app-pub-3940256099942544/1033173712'; // Google এর test ID

  // Currently preloaded rewarded ad instance, ready to be shown.
  static RewardedAd? _rewardedAd;
  // Whether a rewarded ad is currently loaded and ready to display.
  static bool _isLoaded = false;

  // Currently preloaded interstitial ad instance, ready to be shown.
  static InterstitialAd? _interstitialAd;
  // Whether an interstitial ad is currently loaded and ready to display.
  static bool _interstitialLoaded = false;
  // Counts sessions/levels since the last interstitial was shown; used to
  // throttle interstitial frequency (see maybeShowInterstitial).
  static int _sessionCount = 0;
  // Shared RNG used to randomize interstitial display timing.
  static final Random _random = Random();

  /// Initializes the Mobile Ads SDK and kicks off preloading of both the
  /// rewarded and interstitial ads so they are ready when needed.
  static Future<void> initialize() async {
    await MobileAds.instance.initialize();
    _loadRewardedAd();
    _loadInterstitialAd();
  }

  /// Requests a new rewarded ad from AdMob. On success it is cached for
  /// later display; on failure it retries automatically after 30 seconds
  /// to avoid hammering the ad network with rapid retries.
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
  /// Shows the preloaded rewarded ad, if any. Calls [onRewarded] only when
  /// the user watches the ad to completion and earns the reward (the
  /// specific reward type/effect is decided by the caller). Calls
  /// [onFailed] with a user-facing Bengali message if no ad is ready or the
  /// ad fails to display. After dismissal or failure, a new ad is preloaded
  /// for next time.
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

  /// Whether a rewarded ad is currently ready to show.
  static bool get isAdLoaded => _isLoaded;

  /// Requests a new interstitial ad from AdMob. On success it is cached for
  /// later display; on failure it retries automatically after 30 seconds.
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
  /// Call this at the end of a level/game session. Skips entirely if the
  /// user has purchased "Remove Ads". Otherwise throttles interstitials so
  /// they don't show every session: never shows before 2 sessions have
  /// passed, then shows either with 50% probability or unconditionally
  /// once 3+ sessions have accumulated, resetting the counter after a show.
  static void maybeShowInterstitial() {
    if (IapService.adsRemoved) return;
    _sessionCount++;
    // never show before at least 2 sessions have passed
    if (_sessionCount < 2) return;
    // forced after 3+ sessions, otherwise a 50% coin-flip
    final shouldShow = _sessionCount >= 3 || _random.nextBool();
    if (!shouldShow) return;
    // reset throttle counter after showing
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
