import 'package:shared_preferences/shared_preferences.dart';

// Local profile — backend বা real login নেই, শুধু নাম + avatar emoji local এ সেভ থাকে
class ProfileManager {
  static const _nameKey = 'mazebloom_profile_name';
  static const _avatarKey = 'mazebloom_profile_avatar';
  static const String defaultAvatar = '🌸';

  static const List<String> avatarChoices = [
    '🌸', '🦋', '🐯', '🐘', '🦜', '🐢', '🌼', '🛺', '🐟', '🎉',
  ];

  static Future<String?> getName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_nameKey);
  }

  static Future<String> getAvatar() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_avatarKey) ?? defaultAvatar;
  }

  static Future<void> save({required String name, required String avatar}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_nameKey, name.trim());
    await prefs.setString(_avatarKey, avatar);
  }

  static Future<bool> hasProfile() async {
    final name = await getName();
    return name != null && name.trim().isNotEmpty;
  }
}
