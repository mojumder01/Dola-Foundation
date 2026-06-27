import 'package:flutter/material.dart';
import '../utils/app_language.dart';
import '../utils/profile_manager.dart';
import '../utils/feedback_service.dart';
import '../widgets/app_background.dart';

// স্থানীয় প্রোফাইল — কোনো real login/Google sign-in নেই, শুধু নাম + avatar emoji local এ সেভ হয়
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  String _avatar = ProfileManager.defaultAvatar;
  bool _loading = true;
  bool _saved = false;
  bool _soundOn = true;
  bool _vibrationOn = true;

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

  Future<void> _load() async {
    final name = await ProfileManager.getName();
    final avatar = await ProfileManager.getAvatar();
    setState(() {
      _nameController.text = name ?? '';
      _avatar = avatar;
      _soundOn = FeedbackService.soundOn;
      _vibrationOn = FeedbackService.vibrationOn;
      _loading = false;
    });
  }

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
