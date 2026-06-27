// Profile/settings screen: lets the player set their name and avatar,
// switch language, choose cosmetic options (path color, cell skin, maze
// background), toggle sound/vibration, and purchase cosmetics with coins
// or real-money IAP.
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../utils/app_language.dart';
import '../utils/profile_manager.dart';
import '../utils/feedback_service.dart';
import '../utils/coin_manager.dart';
import '../utils/path_color_manager.dart';
import '../utils/cell_skin_manager.dart';
import '../utils/maze_background_manager.dart';
import '../services/iap_service.dart';
import '../widgets/app_background.dart';

// স্থানীয় প্রোফাইল — কোনো real login/Google sign-in নেই, শুধু নাম + avatar emoji local এ সেভ হয়
/// Stateful screen widget for the profile/settings screen. Logic and data
/// loading live in [_ProfileScreenState].
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

/// State for [ProfileScreen]. Loads the player's saved profile, settings,
/// and cosmetic unlock/selection state on init, and handles purchasing or
/// selecting cosmetics (path colors, cell skins, maze backgrounds).
class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  String _avatar = ProfileManager.defaultAvatar;
  bool _loading = true;
  // shows a brief "saved" confirmation after _save()
  bool _saved = false;
  bool _soundOn = true;
  bool _vibrationOn = true;
  int _coins = 0;
  String _selectedColorId = PathColorManager.defaultId;
  Set<String> _unlockedColorIds = {};
  String _selectedSkinId = CellSkinManager.defaultId;
  Set<String> _unlockedSkinIds = {};
  String _selectedBgId = MazeBackgroundManager.defaultId;
  Set<String> _unlockedBgIds = {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  /// Loads all profile, settings, and cosmetic data from their respective
  /// managers. Also re-checks the diamond-color IAP entitlement on every
  /// load so a completed purchase is reflected even if it settled after
  /// this screen first opened.
  Future<void> _load() async {
    if (IapService.diamondColorUnlocked) {
      await PathColorManager.unlockPremium(PathColorManager.diamondId);
    }
    final name = await ProfileManager.getName();
    final avatar = await ProfileManager.getAvatar();
    final coins = await CoinManager.getCoins();
    final selectedColorId = await PathColorManager.getSelectedId();
    final unlockedColorIds = await PathColorManager.getUnlockedIds();
    final selectedSkinId = await CellSkinManager.getSelectedId();
    final unlockedSkinIds = await CellSkinManager.getUnlockedIds();
    final selectedBgId = await MazeBackgroundManager.getSelectedId();
    final unlockedBgIds = await MazeBackgroundManager.getUnlockedIds();
    setState(() {
      _nameController.text = name ?? '';
      _avatar = avatar;
      _soundOn = FeedbackService.soundOn;
      _vibrationOn = FeedbackService.vibrationOn;
      _coins = coins;
      _selectedColorId = selectedColorId;
      _unlockedColorIds = unlockedColorIds;
      _selectedSkinId = selectedSkinId;
      _unlockedSkinIds = unlockedSkinIds;
      _selectedBgId = selectedBgId;
      _unlockedBgIds = unlockedBgIds;
      _loading = false;
    });
  }

  /// Handles tapping a path-color swatch: for premium colors, kicks off
  /// the real-money IAP flow if not yet unlocked; for coin-priced colors,
  /// checks the player has enough coins before purchasing/selecting.
  Future<void> _buyOrSelectColor(PathColorOption option) async {
    final alreadyUnlocked = _unlockedColorIds.contains(option.id);
    if (option.isPremium && !alreadyUnlocked) {
      final started = await IapService.buy(IapService.diamondColorProductId);
      if (!started && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('এই মুহূর্তে কেনা যাচ্ছে না — পরে চেষ্টা করো', 'Purchase unavailable right now — try again later'))),
        );
      }
      return;
    }
    if (!alreadyUnlocked && _coins < option.cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
      );
      return;
    }
    final ok = await PathColorManager.purchase(option.id);
    if (ok) await _load();
  }

  /// Handles tapping a cell-skin swatch: validates coin balance for
  /// locked skins, then purchases/selects via [CellSkinManager].
  Future<void> _buyOrSelectSkin(CellSkinOption option) async {
    final alreadyUnlocked = _unlockedSkinIds.contains(option.id);
    if (!alreadyUnlocked && _coins < option.cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
      );
      return;
    }
    final ok = await CellSkinManager.purchase(option.id);
    if (ok) await _load();
  }

  /// Handles tapping a maze-background option. Custom photo backgrounds
  /// open the device gallery picker directly. Built-in backgrounds must be
  /// unlocked in order (each one requires the previous tier to be unlocked
  /// first) and require enough coins before purchase/selection.
  Future<void> _buyOrSelectBackground(MazeBackgroundOption option) async {
    if (option.isCustomPhoto) {
      final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
      if (picked == null) return;
      await MazeBackgroundManager.setCustomPhotoPath(picked.path);
      await _load();
      return;
    }
    final alreadyUnlocked = _unlockedBgIds.contains(option.id);
    // Backgrounds unlock progressively — this one requires the prior tier first.
    if (!alreadyUnlocked && !MazeBackgroundManager.isPurchasable(option.id, _unlockedBgIds)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('আগের ব্যাকগ্রাউন্ডটা আগে আনলক করো', 'Unlock the previous background first'))),
      );
      return;
    }
    if (!alreadyUnlocked && _coins < option.cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('যথেষ্ট কয়েন নেই', 'Not enough coins'))),
      );
      return;
    }
    final ok = await MazeBackgroundManager.purchase(option.id);
    if (ok) await _load();
  }

  /// Persists the name/avatar changes via [ProfileManager] and briefly
  /// shows a "saved" confirmation snackbar and inline message.
  Future<void> _save() async {
    if (_nameController.text.trim().isEmpty) return;
    await ProfileManager.save(name: _nameController.text, avatar: _avatar);
    if (!mounted) return;
    setState(() => _saved = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(tr('✅ প্রোফাইল সেভ হয়েছে', '✅ Profile saved'))),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Text(
                            '👤 ${tr('প্রোফাইল', 'Profile')}',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      Center(
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)]),
                            shape: BoxShape.circle,
                          ),
                          child: Text(_avatar, style: const TextStyle(fontSize: 48)),
                        ),
                      ),
                      const SizedBox(height: 20),

                      Text(
                        tr('তোমার নাম', 'Your name'),
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _nameController,
                        style: const TextStyle(color: Colors.white),
                        maxLength: 20,
                        decoration: InputDecoration(
                          hintText: tr('নাম লিখো', 'Enter your name'),
                          hintStyle: const TextStyle(color: Colors.white38),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.08),
                          counterStyle: const TextStyle(color: Colors.white38),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      Text(
                        tr('Avatar বেছে নাও', 'Choose an avatar'),
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: ProfileManager.avatarChoices.map((emoji) {
                          final selected = emoji == _avatar;
                          return GestureDetector(
                            onTap: () => setState(() => _avatar = emoji),
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: selected ? Colors.white.withOpacity(0.2) : Colors.white.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(14),
                                border: selected ? Border.all(color: const Color(0xFF7C4DFF), width: 2) : null,
                              ),
                              child: Text(emoji, style: const TextStyle(fontSize: 26)),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 28),

                      Text(
                        tr('ভাষা', 'Language'),
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: _langOption('English', AppLang.en)),
                          const SizedBox(width: 12),
                          Expanded(child: _langOption('বাংলা', AppLang.bn)),
                        ],
                      ),
                      const SizedBox(height: 28),

                      Text(tr('🎨 Path এর রঙ', '🎨 Path Color'), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: PathColorManager.options.map((option) {
                          final unlocked = _unlockedColorIds.contains(option.id);
                          final selected = option.id == _selectedColorId;
                          String priceLabel;
                          if (unlocked) {
                            priceLabel = selected ? tr('বাছা হয়েছে', 'Selected') : tr('আনলকড', 'Unlocked');
                          } else if (option.isPremium) {
                            priceLabel = IapService.productFor(IapService.diamondColorProductId)?.price ?? tr('প্রিমিয়াম', 'Premium');
                          } else {
                            priceLabel = '🪙${option.cost}';
                          }
                          return GestureDetector(
                            onTap: () => _buyOrSelectColor(option),
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(14),
                                border: selected
                                    ? Border.all(color: Colors.white, width: 2)
                                    : (option.isPremium ? Border.all(color: const Color(0xFF00E5FF).withOpacity(0.5), width: 1.5) : null),
                              ),
                              child: Column(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(color: option.color, shape: BoxShape.circle),
                                    child: option.isPremium && !unlocked
                                        ? const Icon(Icons.diamond, color: Colors.white, size: 16)
                                        : null,
                                  ),
                                  const SizedBox(height: 6),
                                  Text(priceLabel, style: const TextStyle(color: Colors.white70, fontSize: 10)),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 28),

                      Text(tr('🧩 Cell এর রঙ', '🧩 Cell Skin'), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: CellSkinManager.options.map((option) {
                          final unlocked = _unlockedSkinIds.contains(option.id);
                          final selected = option.id == _selectedSkinId;
                          return GestureDetector(
                            onTap: () => _buyOrSelectSkin(option),
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(14),
                                border: selected ? Border.all(color: Colors.white, width: 2) : null,
                              ),
                              child: Column(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(color: option.color, borderRadius: BorderRadius.circular(8)),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    unlocked ? (selected ? tr('বাছা হয়েছে', 'Selected') : tr('আনলকড', 'Unlocked')) : '🪙${option.cost}',
                                    style: const TextStyle(color: Colors.white70, fontSize: 10),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 28),

                      Text(tr('🖼️ গেম ব্যাকগ্রাউন্ড', '🖼️ Game Background'), style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: MazeBackgroundManager.options.map((option) {
                          final unlocked = _unlockedBgIds.contains(option.id);
                          final selected = option.id == _selectedBgId;
                          final locked = !unlocked && !option.isCustomPhoto && !MazeBackgroundManager.isPurchasable(option.id, _unlockedBgIds);
                          String label;
                          if (option.isCustomPhoto) {
                            label = unlocked ? (selected ? tr('বাছা হয়েছে', 'Selected') : tr('বদলাও', 'Change')) : tr('ছবি বাছো', 'Pick Photo');
                          } else if (locked) {
                            label = tr('🔒 আগেরটা আনলক করো', '🔒 Unlock previous');
                          } else if (unlocked) {
                            label = selected ? tr('বাছা হয়েছে', 'Selected') : tr('আনলকড', 'Unlocked');
                          } else if (option.unlockLevel != null) {
                            label = '🪙${option.cost} / Lv${option.unlockLevel}';
                          } else {
                            label = '🪙${option.cost}';
                          }
                          return GestureDetector(
                            onTap: () => _buyOrSelectBackground(option),
                            child: Opacity(
                              opacity: locked ? 0.5 : 1.0,
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.06),
                                  borderRadius: BorderRadius.circular(14),
                                  border: selected ? Border.all(color: Colors.white, width: 2) : null,
                                ),
                                child: Column(
                                  children: [
                                    Container(
                                      width: 44,
                                      height: 32,
                                      decoration: BoxDecoration(
                                        gradient: option.isCustomPhoto ? null : LinearGradient(colors: option.colors),
                                        color: option.isCustomPhoto ? Colors.white.withOpacity(0.1) : null,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: option.isCustomPhoto
                                          ? const Icon(Icons.add_photo_alternate, color: Colors.white70, size: 18)
                                          : null,
                                    ),
                                    const SizedBox(height: 6),
                                    Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10)),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 28),

                      Text(
                        tr('সাউন্ড ও ভাইব্রেশন', 'Sound & Vibration'),
                        style: TextStyle(color: Colors.white.withOpacity(0.8), fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Column(
                          children: [
                            SwitchListTile(
                              value: _soundOn,
                              onChanged: (value) async {
                                await FeedbackService.setSoundOn(value);
                                setState(() => _soundOn = value);
                              },
                              activeColor: const Color(0xFF7C4DFF),
                              title: Text(tr('🔊 সাউন্ড', '🔊 Sound'), style: const TextStyle(color: Colors.white)),
                            ),
                            SwitchListTile(
                              value: _vibrationOn,
                              onChanged: (value) async {
                                await FeedbackService.setVibrationOn(value);
                                setState(() => _vibrationOn = value);
                              },
                              activeColor: const Color(0xFF7C4DFF),
                              title: Text(tr('📳 ভাইব্রেশন', '📳 Vibration'), style: const TextStyle(color: Colors.white)),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28),

                      GestureDetector(
                        onTap: _save,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFF66BB6A), Color(0xFF2E7D32)]),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              tr('সেভ করো', 'Save'),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),

                      if (_saved) ...[
                        const SizedBox(height: 16),
                        Center(
                          child: Text(
                            tr('✅ সেভ হয়েছে', '✅ Saved'),
                            style: const TextStyle(color: Colors.white70),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  // ভাষা টগল করার সাথে সাথে এই screen টা নিজেই rebuild হয়, তাই সাথে সাথে দেখা যায়
  /// Builds a single language-choice chip (English/Bengali). Toggling
  /// triggers [AppLanguage.toggle], which also rebuilds this screen
  /// immediately via local setState (the whole app rebuild from
  /// [AppLanguage] notifications happens separately at the root).
  Widget _langOption(String label, AppLang lang) {
    final selected = AppLanguage.instance.lang == lang;
    return GestureDetector(
      onTap: () async {
        if (selected) return;
        await AppLanguage.instance.toggle();
        if (mounted) setState(() {});
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFF7C4DFF) : Colors.white.withOpacity(0.06),
          borderRadius: BorderRadius.circular(12),
          border: selected ? null : Border.all(color: Colors.white24),
        ),
        child: Center(
          child: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
