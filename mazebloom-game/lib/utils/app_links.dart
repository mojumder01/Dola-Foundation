// External link/contact constants — Play Store এ publish করার আগে এই placeholder গুলো বদলে দিতে হবে
class AppLinks {
  // TODO: Play Console এ app publish হওয়ার পর আসল package id দিয়ে বদলাও
  static const String packageName = 'com.dolafoundation.mazebloom';

  static String get playStoreUrl => 'https://play.google.com/store/apps/details?id=$packageName';

  // TODO: real support email দিয়ে বদলাও
  static const String supportEmail = 'support@dolafoundation.com';
}
