import 'package:flutter/material.dart';
import '../utils/achievement_manager.dart';
import '../utils/app_language.dart';
import '../widgets/app_background.dart';

// Mosaic Gallery — অর্জন করা সব badge পাশাপাশি দেখা যায়, ফাঁকা গুলো lock করা থাকে
class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  Set<String> _unlocked = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final unlocked = await AchievementManager.getUnlockedIds();
    setState(() {
      _unlocked = unlocked;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                child: Row(
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
                      '🌺 ${tr('মোসাইক গ্যালারি', 'Mosaic Gallery')}',
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                child: Text(
                  _loading
                      ? ''
                      : tr('${_unlocked.length} / ${AchievementManager.all.length} অর্জন সংগ্রহ করেছো',
                          '${_unlocked.length} / ${AchievementManager.all.length} achievements collected'),
                  style: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 13),
                ),
              ),
              Expanded(
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : GridView.builder(
                        padding: const EdgeInsets.all(20),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          mainAxisSpacing: 14,
                          crossAxisSpacing: 14,
                          childAspectRatio: 0.85,
                        ),
                        itemCount: AchievementManager.all.length,
                        itemBuilder: (context, index) {
                          final achievement = AchievementManager.all[index];
                          final unlocked = _unlocked.contains(achievement.id);
                          return Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              gradient: unlocked
                                  ? const LinearGradient(colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)])
                                  : null,
                              color: unlocked ? null : Colors.white.withOpacity(0.06),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  unlocked ? achievement.emoji : '🔒',
                                  style: const TextStyle(fontSize: 28),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  unlocked ? achievement.displayTitle : '???',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: unlocked ? Colors.white : Colors.white38,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                                if (unlocked) ...[
                                  const SizedBox(height: 4),
                                  Text(
                                    achievement.displayDescription,
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(color: Colors.white70, fontSize: 10),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
