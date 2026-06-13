import 'dart:math';
import '../models/question.dart';

// গেমের তিনটা level
enum Difficulty { easy, medium, hard }

// Random math question তৈরি করে দেয়
class QuestionGenerator {
  // Flutter এর Random class — unpredictable number বানায়
  static final _random = Random();

  // একটা প্রশ্ন তৈরি করো, difficulty অনুযায়ী
  static Question generate(Difficulty difficulty) {
    // কোন ধরনের অংক করবো — +, -, ×
    final operations = _getOperations(difficulty);
    final operation = operations[_random.nextInt(operations.length)];

    // সংখ্যার range — easy তে ছোট, hard এ বড়
    final range = _getRange(difficulty);

    int a = _random.nextInt(range) + 1;
    int b = _random.nextInt(range) + 1;
    int correct;
    String text;

    // অংকের ধরন অনুযায়ী প্রশ্ন বানাও
    switch (operation) {
      case '+':
        correct = a + b;
        text = '$a + $b = ?';
        break;

      case '-':
        // ছোট থেকে বড় বিয়োগ করলে negative আসে, তাই swap করি
        if (a < b) {
          final temp = a;
          a = b;
          b = temp;
        }
        correct = a - b;
        text = '$a - $b = ?';
        break;

      case '×':
        // গুণের জন্য ছোট সংখ্যা ব্যবহার করি, নাহলে উত্তর অনেক বড় হয়
        a = _random.nextInt(12) + 1;
        b = _random.nextInt(12) + 1;
        correct = a * b;
        text = '$a × $b = ?';
        break;

      default:
        correct = a + b;
        text = '$a + $b = ?';
    }

    // সঠিক উত্তরের কাছাকাছি ভুল option তৈরি করো
    final options = _generateOptions(correct);

    return Question(
      questionText: text,
      correctAnswer: correct,
      options: options,
    );
  }

  // ১০টা প্রশ্নের একটা set বানাও
  static List<Question> generateSet(Difficulty difficulty, {int count = 10}) {
    return List.generate(count, (_) => generate(difficulty));
  }

  // Difficulty অনুযায়ী কোন কোন অংক ব্যবহার হবে
  static List<String> _getOperations(Difficulty difficulty) {
    switch (difficulty) {
      case Difficulty.easy:
        return ['+', '-']; // শুধু যোগ-বিয়োগ
      case Difficulty.medium:
        return ['+', '-', '×']; // যোগ-বিয়োগ-গুণ
      case Difficulty.hard:
        return ['+', '-', '×', '×']; // গুণ বেশি আসবে hard এ
    }
  }

  // Difficulty অনুযায়ী সংখ্যার বড়ত্ব
  static int _getRange(Difficulty difficulty) {
    switch (difficulty) {
      case Difficulty.easy:
        return 20; // 1 থেকে 20
      case Difficulty.medium:
        return 50; // 1 থেকে 50
      case Difficulty.hard:
        return 100; // 1 থেকে 100
    }
  }

  // সঠিক উত্তর + ৩টা কাছাকাছি ভুল উত্তর বানাও, তারপর shuffle করো
  static List<int> _generateOptions(int correct) {
    final Set<int> opts = {correct};

    // ভুল option গুলো সঠিকের কাছাকাছি রাখি — এটা না করলে গেম বেশি সহজ হয়
    while (opts.length < 4) {
      // সর্বোচ্চ ১০ এর মধ্যে ভিন্ন একটা সংখ্যা যোগ বা বিয়োগ করো
      final offset = _random.nextInt(10) + 1;
      final fake = _random.nextBool() ? correct + offset : correct - offset;

      // Negative উত্তর option হিসেবে রাখবো না
      if (fake > 0 && fake != correct) {
        opts.add(fake);
      }
    }

    // List এ নিয়ে shuffle করো যাতে সঠিক উত্তর সবসময় একই জায়গায় না থাকে
    final list = opts.toList();
    list.shuffle(_random);
    return list;
  }
}
