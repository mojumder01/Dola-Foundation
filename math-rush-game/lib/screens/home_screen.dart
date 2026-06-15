import 'package:flutter/material.dart';
import '../utils/question_generator.dart';
import '../utils/score_manager.dart';
import '../utils/coin_manager.dart';
import '../services/ad_service.dart';
import 'game_screen.dart';

// প্রথম screen — গেম শুরুর আগে যেটা দেখা যায়
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  // Default difficulty easy — পরে user change করতে পারবে
  Difficulty _selectedDifficulty = Difficulty.easy;

  // তিনটা difficulty এর high score
  int _easyHigh = 0;
  int _mediumHigh = 0;
  int _hardHigh = 0;

  // বর্তমান coin balance
  int _coins = 0;

  // Ad load হচ্ছে কিনা বা দেখানো হচ্ছে কিনা
  bool _adLoading = false;

  // Title animation এর জন্য controller
  late AnimationController _titleController;
  late Animation<double> _titleAnimation;

  @override
  void initState() {
    super.initState();

    // Title bounce animation setup
    _titleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true); // বারবার up-down করবে

    _titleAnimation = Tween<double>(begin: 0, end: -10).animate(
      CurvedAnimation(parent: _titleController, curve: Curves.easeInOut),
    );

    _loadData();
  }

  // Score এবং coins load করো
  Future<void> _loadData() async {
    final easy = await ScoreManager.getHighScore(Difficulty.easy);
    final medium = await ScoreManager.getHighScore(Difficulty.medium);
    final hard = await ScoreManager.getHighScore(Difficulty.hard);
    final coins = await CoinManager.getCoins();

    if (mounted) {
      setState(() {
        _easyHigh = easy;
        _mediumHigh = medium;
        _hardHigh = hard;
        _coins = coins;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  // Game screen এ যাও, শেষে ফিরে এলে data reload করো
  Future<void> _startGame() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => GameScreen(difficulty: _selectedDifficulty),
      ),
    );
    _loadData(); // গেম শেষে নতুন score/coins দেখাও
  }

  // Rewarded Ad দেখাও — শেষ হলে coins পাবে
  Future<void> _watchAdForCoins() async {
    setState(() => _adLoading = true);

    await AdService.showRewardedAd(
      onRewarded: (coins) async {
        if (!mounted) return;
        final newTotal = await CoinManager.getCoins();
        setState(() {
          _coins = newTotal;
          _adLoading = false;
        });
        // Success toast
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('🪙 +$coins coins পেয়েছো! মোট: $_coins'),
              backgroundColor: const Color(0xFF4CAF50),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          );
        }
      },
      onFailed: (reason) {
        if (!mounted) return;
        setState(() => _adLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(reason),
            backgroundColor: const Color(0xFF607D8B),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 16),

                // উপরে coin balance + ad button
                _buildCoinBar(),

                const SizedBox(height: 24),

                // Animated title
                AnimatedBuilder(
                  animation: _titleAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, _titleAnimation.value),
                      child: child,
                    );
                  },
                  child: const Column(
                    children: [
                      Text('🧮', style: TextStyle(fontSize: 70)),
                      SizedBox(height: 12),
                      Text(
                        'Math Rush',
                        style: TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                      Text(
                        'গণিত চ্যালেঞ্জ',
                        style: TextStyle(
                          fontSize: 16,
                          color: Color(0xFFB0BEC5),
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // High Score Card
                _buildHighScoreCard(),

                const SizedBox(height: 28),

                // Difficulty selector
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'কঠিনতা বেছে নাও',
                    style: TextStyle(
                      color: Color(0xFFB0BEC5),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                _buildDifficultySelector(),

                const SizedBox(height: 32),

                // Start Game button
                _buildStartButton(),

                const Spacer(),

                // Footer info
                const Text(
                  '১০টি প্রশ্ন • সময়সীমা ১০ সেকেন্ড • সর্বোচ্চ ১৫০০ পয়েন্ট',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF607D8B), fontSize: 12),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // উপরে coin balance এবং ad button
  Widget _buildCoinBar() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Coin balance
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.amber.withOpacity(0.4)),
          ),
          child: Row(
            children: [
              const Text('🪙', style: TextStyle(fontSize: 18)),
              const SizedBox(width: 6),
              Text(
                '$_coins',
                style: const TextStyle(
                  color: Colors.amber,
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(width: 4),
              const Text(
                'coins',
                style: TextStyle(color: Color(0xFFB0BEC5), fontSize: 13),
              ),
            ],
          ),
        ),

        // Watch Ad button
        GestureDetector(
          onTap: _adLoading ? null : _watchAdForCoins,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              gradient: _adLoading
                  ? null
                  : const LinearGradient(
                      colors: [Color(0xFFFF6D00), Color(0xFFFFAB00)],
                    ),
              color: _adLoading ? Colors.white10 : null,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                if (_adLoading)
                  const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white54,
                    ),
                  )
                else
                  const Text('📺', style: TextStyle(fontSize: 16)),
                const SizedBox(width: 6),
                Text(
                  _adLoading ? 'লোড হচ্ছে...' : '+${AdService.coinsPerAd} দেখো',
                  style: TextStyle(
                    color: _adLoading ? Colors.white54 : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // তিনটা difficulty এর best score একটা card এ দেখাও
  Widget _buildHighScoreCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          const Text(
            '🏆 সর্বোচ্চ স্কোর',
            style: TextStyle(
              color: Colors.amber,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _scoreColumn('সহজ', _easyHigh, const Color(0xFF4CAF50)),
              _divider(),
              _scoreColumn('মাঝারি', _mediumHigh, const Color(0xFFFFC107)),
              _divider(),
              _scoreColumn('কঠিন', _hardHigh, const Color(0xFFF44336)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _scoreColumn(String label, int score, Color color) {
    return Column(
      children: [
        Text(
          '$score',
          style: TextStyle(
            color: color,
            fontSize: 26,
            fontWeight: FontWeight.w900,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 12),
        ),
      ],
    );
  }

  Widget _divider() {
    return Container(
      width: 1,
      height: 40,
      color: Colors.white.withOpacity(0.2),
    );
  }

  // তিনটা difficulty button
  Widget _buildDifficultySelector() {
    return Row(
      children: [
        _difficultyButton('সহজ', Difficulty.easy, const Color(0xFF4CAF50)),
        const SizedBox(width: 12),
        _difficultyButton('মাঝারি', Difficulty.medium, const Color(0xFFFFC107)),
        const SizedBox(width: 12),
        _difficultyButton('কঠিন', Difficulty.hard, const Color(0xFFF44336)),
      ],
    );
  }

  Widget _difficultyButton(String label, Difficulty diff, Color color) {
    final isSelected = _selectedDifficulty == diff;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedDifficulty = diff),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: isSelected ? color : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : color,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // বড় Start বাটন
  Widget _buildStartButton() {
    return GestureDetector(
      onTap: _startGame,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF7C4DFF), Color(0xFF448AFF)],
          ),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF7C4DFF).withOpacity(0.5),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.play_arrow_rounded, color: Colors.white, size: 28),
            SizedBox(width: 8),
            Text(
              'খেলা শুরু করো',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
