// This file manages real-money in-app purchases (IAP): querying available
// products, listening for purchase updates, persisting entitlements locally,
// and exposing purchase state to the rest of the app.
import 'dart:async';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Real-money one-time purchases — Ads সরানো আর একটা প্রিমিয়াম path color।
// Product ID গুলো Play Console এ in-app product হিসেবে আগে থেকে বানিয়ে রাখতে হবে।
/// Static service that handles non-consumable in-app purchases (Remove Ads,
/// Diamond path color). Entitlements are cached in memory and persisted to
/// [SharedPreferences] so they survive app restarts without re-querying the
/// store every time.
class IapService {
  // Product identifiers as configured in the Play Console / App Store.
  static const String removeAdsProductId = 'mazebloom_remove_ads';
  static const String diamondColorProductId = 'mazebloom_color_diamond';
  // Full set of product IDs to query from the store on startup.
  static const Set<String> _productIds = {removeAdsProductId, diamondColorProductId};

  // SharedPreferences keys used to persist purchased entitlements locally.
  static const _removeAdsKey = 'mazebloom_iap_remove_ads';
  static const _diamondColorKey = 'mazebloom_iap_color_diamond';

  // Cached entitlement flags, loaded from SharedPreferences on initialize().
  static bool _adsRemoved = false;
  static bool _diamondUnlocked = false;
  // Whether the platform's billing service is available on this device.
  static bool _available = false;
  // Product metadata (price, title, etc.) keyed by product ID, fetched from the store.
  static Map<String, ProductDetails> _products = {};
  // Subscription to the platform purchase stream; cancelled in dispose().
  static StreamSubscription<List<PurchaseDetails>>? _subscription;
  // Internal broadcast controller used to notify listeners of entitlement changes.
  static final StreamController<void> _changes = StreamController<void>.broadcast();

  /// Whether the user has purchased "Remove Ads".
  static bool get adsRemoved => _adsRemoved;
  /// Whether the user has purchased the diamond premium path color.
  static bool get diamondColorUnlocked => _diamondUnlocked;
  /// Whether in-app purchases are available on this device/platform.
  static bool get isAvailable => _available;
  /// Returns the store-provided [ProductDetails] (price, title, etc.) for a product ID, if loaded.
  static ProductDetails? productFor(String id) => _products[id];
  // Purchase সফল হয়ে entitlement আপডেট হলে এখানে event আসে — UI screen গুলো এটা শুনে রিফ্রেশ করতে পারে
  /// Emits an event whenever a purchase succeeds and entitlements update, so
  /// UI screens can listen and refresh themselves.
  static Stream<void> get changes => _changes.stream;

  /// Loads cached entitlements from SharedPreferences, checks billing
  /// availability, subscribes to the purchase stream, queries product
  /// details from the store, and restores any previous purchases (important
  /// for users who reinstall the app or switch devices).
  static Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _adsRemoved = prefs.getBool(_removeAdsKey) ?? false;
    _diamondUnlocked = prefs.getBool(_diamondColorKey) ?? false;

    _available = await InAppPurchase.instance.isAvailable();
    if (!_available) return; // ইমুলেটর/সাপোর্ট ছাড়া ডিভাইসে billing থাকবে না — গ্রেসফুলি স্কিপ করো

    _subscription = InAppPurchase.instance.purchaseStream.listen(_onPurchaseUpdate);

    final response = await InAppPurchase.instance.queryProductDetails(_productIds);
    _products = {for (final p in response.productDetails) p.id: p};

    await InAppPurchase.instance.restorePurchases();
  }

  /// Handles updates from the platform purchase stream. For each purchase
  /// that is newly `purchased` or `restored`, marks the corresponding
  /// entitlement as unlocked, persists it to SharedPreferences, and emits a
  /// change event. Also completes any purchase that is pending acknowledgment,
  /// as required by the platform billing APIs.
  static Future<void> _onPurchaseUpdate(List<PurchaseDetails> purchases) async {
    final prefs = await SharedPreferences.getInstance();
    for (final purchase in purchases) {
      if (purchase.status == PurchaseStatus.purchased || purchase.status == PurchaseStatus.restored) {
        if (purchase.productID == removeAdsProductId) {
          _adsRemoved = true;
          await prefs.setBool(_removeAdsKey, true);
          _changes.add(null);
        } else if (purchase.productID == diamondColorProductId) {
          _diamondUnlocked = true;
          await prefs.setBool(_diamondColorKey, true);
          _changes.add(null);
        }
      }
      if (purchase.pendingCompletePurchase) {
        await InAppPurchase.instance.completePurchase(purchase);
      }
    }
  }

  // Caller কে শুধু true/false রিটার্ন করে দেয় যে purchase flow শুরু করা গেছে কিনা —
  // আসল entitlement আসে purchaseStream এর মাধ্যমে, তাই onRewarded এর মতো সরাসরি callback নেই
  /// Initiates a non-consumable purchase flow for [productId]. Returns
  /// whether the flow was successfully started, not whether the purchase
  /// succeeded — the actual entitlement update happens asynchronously via
  /// the purchase stream (_onPurchaseUpdate).
  static Future<bool> buy(String productId) async {
    final product = _products[productId];
    if (!_available || product == null) return false;
    final param = PurchaseParam(productDetails: product);
    return InAppPurchase.instance.buyNonConsumable(purchaseParam: param);
  }

  /// Cancels the purchase stream subscription; call when the service is no
  /// longer needed to avoid leaking the listener.
  static void dispose() {
    _subscription?.cancel();
  }
}
