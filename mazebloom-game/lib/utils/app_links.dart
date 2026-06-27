// External link/contact constants — Play Store এ publish করার আগে এই placeholder গুলো বদলে দিতে হবে
/// Centralized holder for external link/contact constants (Play Store
/// package id, support email) used by UI screens (e.g. "Rate us",
/// "Contact support" buttons). Values below are placeholders — see TODOs.
class AppLinks {
  // TODO: Play Console এ app publish হওয়ার পর আসল package id দিয়ে বদলাও
  // Placeholder package name; must match the real Play Console listing once published.
  static const String packageName = 'com.dolafoundation.mazebloom';

  /// Builds the Play Store listing URL from [packageName].
  static String get playStoreUrl => 'https://play.google.com/store/apps/details?id=$packageName';

  // TODO: real support email দিয়ে বদলাও
  // Placeholder support contact address; replace with the real support inbox.
  static const String supportEmail = 'support@dolafoundation.com';
}
