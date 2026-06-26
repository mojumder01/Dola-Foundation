# Maze Bloom — Combined Testing Checklist (Part 1–4)

সব পার্ট একসাথে build হয়েছে — phone এ install করার আগে আর পরে এই checklist দিয়ে যাচাই করো।

## Setup (একবার করতে হবে)
1. এই folder এ প্রথমবার হলে: `flutter create .` চালাও (android/ios folder generate হবে)
2. `android/app/src/main/AndroidManifest.xml` খুলে `android_manifest_reference.xml` এর কনটেন্ট অনুযায়ী মিলিয়ে নাও (INTERNET permission + AdMob APPLICATION_ID meta-data যুক্ত করো)
3. `flutter pub get`
4. ফোন USB দিয়ে কানেক্ট করো, USB debugging + Install via USB অন রাখো
5. `flutter run`

## Part 1 — Core mechanic
- [ ] হোম স্ক্রিনে অ্যাপ ওপেন হচ্ছে, crash হচ্ছে না
- [ ] একটা শেপে drag করে path আঁকা যাচ্ছে
- [ ] ভুল ঘরে গেলে backtrack/undo কাজ করছে
- [ ] dead-end এ পড়লে life কমছে আর snackbar দেখাচ্ছে
- [ ] পুরো শেপ পূরণ হলে Win dialog আসছে

## Part 2 — Game modes
- [ ] Easy/Medium/Hard প্রতিটায় level grid দেখাচ্ছে, প্রথম level unlocked
- [ ] একটা level সমাধান করলে পরের level unlock হচ্ছে
- [ ] Daily Challenge ওপেন হচ্ছে, সমাধান করলে "✅ সমাধান হয়েছে" দেখাচ্ছে, streak বাড়ছে
- [ ] Unlimited mode এ একটার পর একটা শেপ আসছে, কঠিন হচ্ছে ধীরে ধীরে

## Part 3 — Culture theme
- [ ] সংস্কৃতির যাত্রা (Story Mode) এ ৬টা chapter দেখাচ্ছে, প্রথমটা unlocked
- [ ] একটা chapter সমাধান করলে পরেরটা unlock হচ্ছে
- [ ] ফোনের তারিখ পরিবর্তন করে (Settings → Date) ১৪ এপ্রিল / ২৬ মার্চ / ১৬ ডিসেম্বর সেট করে Daily Challenge কার্ডে festival theme/রঙ পরিবর্তন হচ্ছে কিনা চেক করো

## Part 4 — Coins & rewards
- [ ] হোম স্ক্রিনে coin balance দেখাচ্ছে (শুরুতে ৩০)
- [ ] একটা শেপ সমাধান করলে coins বাড়ছে, win dialog এ "+X coins" দেখাচ্ছে
- [ ] লাইফ শেষ হলে "বিজ্ঞাপন দেখো" অপশন আসছে, test ad load/play হচ্ছে (internet লাগবে)
- [ ] Gallery (🌺) স্ক্রিনে achievement badge unlock হচ্ছে প্রথম শেপ সমাধানের পর
- [ ] Rewards (🎁) স্ক্রিনে নিজের referral code দেখাচ্ছে, কোড redeem করলে বোনাস coins পাচ্ছে

## সাধারণ সমস্যা
- AdMob test ad লোড না হলে → ইন্টারনেট কানেকশন চেক করো, প্রথমবার ১-২ মিনিট সময় লাগতে পারে
- কোনো শেপ "সমাধানযোগ্য না" দেখালে → সেটা bug, রিপোর্ট করো (procedural generator সবসময় verify করে তবুও edge case থাকতে পারে)
- `flutter run` করলে "Could not get unknown property 'all' for configuration container for project ':google_mobile_ads'" এই Gradle error আসলে → এটা `google_mobile_ads` প্যাকেজের নিজের bug (Gradle 9.1.0+ এ পুরনো `configurations.all` API deprecated হয়ে গেছে, যা প্যাকেজের 6.0.0 ও তার আগের ভার্সনের build.gradle এ ব্যবহার হয়েছিল)। এটা প্যাকেজের 7.0.0 ভার্সনে ফিক্স হয়েছে। ফিক্স:
  1. `pubspec.yaml` এ `google_mobile_ads: ^7.0.0` (এই রিপোতে আপডেট করা আছে)
  2. `flutter pub get` চালাও যাতে নতুন ভার্সন download হয়
  3. তারপর `flutter run` (বা `run_game.bat`) আবার চালাও
  - তাও সমস্যা থাকলে: `flutter clean` করে আবার `flutter pub get` ও `flutter run` ট্রাই করো (পুরনো Gradle cache clear করার জন্য)
