// প্রতিটা গণিতের প্রশ্নের data এই class এ রাখা হয়

class Question {
  // প্রশ্নের text, যেমন: "১২ + ৭ = ?"
  final String questionText;

  // সঠিক উত্তর
  final int correctAnswer;

  // ৪টা option — একটা সঠিক, বাকি তিনটা ভুল কিন্তু কাছাকাছি
  final List<int> options;

  const Question({
    required this.questionText,
    required this.correctAnswer,
    required this.options,
  });
}
