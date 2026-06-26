import 'dart:async';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Real-money one-time purchases — Ads সরানো আর একটা প্রিমিয়াম path color।
// Product ID গুলো Play Console এ in-app product হিসেবে আগে থেকে বানিয়ে রাখতে হবে।
class IapService {
  static const String removeAdsProductId = 'mazebloom_remove_ads';
  static const String diamondColorProductId = 'mazebloom_color_diamond';
  static const Set<String> _productIds = {removeAdsProductId, diamondColorProductId};

  static const _removeAdsKey = 'mazebloom_iap_remove_ads';
  static const _diamondColorKey = 'mazebloom_iap_color_diamond';

  static bool _adsRemoved = false;
  static bool _diamondUnlocked = false;
  static bool _available = false;
  static Map<String, ProductDetails> _products = {};
  static StreamSubscription<List<PurchaseDetails>>? _subscription;
  static final StreamController<void> _changes = StreamController<void>.broadcast();

  static bool get adsRemoved => _adsRemoved;
  static bool get diamondColorUnlocked => _diamondUnlocked;
  static bool get isAvailable => _available;
  static ProductDetails? productFor(String id) => _products[id];
  // Purchase সফল হয়ে entitlement আপডেট হলে এখানে event আসে — UI screen গুলো এটা শুনে রিফ্রেশ করতে পারে
  static Stream<void> get changes => _changes.stream;

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
  static Future<bool> buy(String productId) async {
    final product = _products[productId];
    if (!_available || product == null) return false;
    final param = PurchaseParam(productDetails: product);
    return InAppPurchase.instance.buyNonConsumable(purchaseParam: param);
  }

  static void dispose() {
    _subscription?.cancel();
  }
}
