// Manages the player's local-only profile (display name + avatar emoji).
// There is no backend/auth; everything is persisted via SharedPreferences.
import 'package:shared_preferences/shared_preferences.dart';

// Local profile — backend বা real login নেই, শুধু নাম + avatar emoji local এ সেভ থাকে
/// Stores and retrieves the player's locally-saved display name and avatar
/// emoji. No server/account system is involved — this is purely on-device.
class ProfileManager {
  // SharedPreferences key for the saved display name.
  static const _nameKey = 'mazebloom_profile_name';
  // SharedPreferences key for the saved avatar emoji.
  static const _avatarKey = 'mazebloom_profile_avatar';
  static const String defaultAvatar = '🌸';

  // Emoji options the player can pick as their avatar.
  static const List<String> avatarChoices = [
    '🌸', '🦋', '🐯', '🐘', '🦜', '🐢', '🌼', '🛺', '🐟', '🎉',
  ];

  /// Returns the saved display name, or null if no profile has been set up.
  static Future<String?> getName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_nameKey);
  }

  /// Returns the saved avatar emoji, falling back to [defaultAvatar].
  static Future<String> getAvatar() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_avatarKey) ?? defaultAvatar;
  }

  /// Persists the player's chosen name (trimmed) and avatar emoji.
  static Future<void> save({required String name, required String avatar}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_nameKey, name.trim());
    await prefs.setString(_avatarKey, avatar);
  }

  /// Returns true if a non-empty profile name has already been saved.
  static Future<bool> hasProfile() async {
    final name = await getName();
    return name != null && name.trim().isNotEmpty;
  }
}
