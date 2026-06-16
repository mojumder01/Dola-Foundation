import type { Locale } from "./locale";

type Entry = { en: string; bn: string };

function pick(entry: Entry, locale: Locale): string {
  return locale === "bn" ? entry.bn : entry.en;
}

export const UI = {
  nav: {
    home: { en: "Home", bn: "হোম" },
    about: { en: "About", bn: "আমাদের কথা" },
    programs: { en: "Programs", bn: "কার্যক্রম" },
    projects: { en: "Projects", bn: "প্রজেক্ট" },
    gallery: { en: "Gallery", bn: "গ্যালারি" },
    blog: { en: "Blog", bn: "ব্লগ" },
    volunteer: { en: "Volunteer", bn: "স্বেচ্ছাসেবক" },
    contact: { en: "Contact", bn: "যোগাযোগ" },
    donateNow: { en: "Donate Now", bn: "দান করুন" },
  },
  common: {
    readMore: { en: "Read More", bn: "আরও পড়ুন" },
    learnMore: { en: "Learn More", bn: "বিস্তারিত জানুন" },
    viewAll: { en: "View All", bn: "সব দেখুন" },
    viewDetails: { en: "View Details", bn: "বিস্তারিত দেখুন" },
    applyNow: { en: "Apply Now", bn: "আবেদন করুন" },
    getInTouch: { en: "Get In Touch", bn: "যোগাযোগ করুন" },
    sendMessage: { en: "Send Message", bn: "বার্তা পাঠান" },
    subscribe: { en: "Subscribe", bn: "সাবস্ক্রাইব করুন" },
    loadMore: { en: "Load More", bn: "আরও দেখুন" },
    backToHome: { en: "Back to Home", bn: "হোমে ফিরে যান" },
    makeADifference: { en: "Make a Difference", bn: "পরিবর্তন আনুন" },
    donationChangesLives: { en: "Your donation changes lives", bn: "আপনার দান জীবন বদলে দেয়" },
  },
  footer: {
    quickLinks: { en: "Quick Links", bn: "প্রয়োজনীয় লিংক" },
    ourPrograms: { en: "Our Programs", bn: "আমাদের কার্যক্রম" },
    contactUs: { en: "Contact Us", bn: "যোগাযোগ করুন" },
    newsletter: { en: "Newsletter", bn: "নিউজলেটার" },
    newsletterText: {
      en: "Subscribe to get updates on our latest projects and impact.",
      bn: "আমাদের সাম্প্রতিক প্রজেক্ট ও কার্যক্রমের আপডেট পেতে সাবস্ক্রাইব করুন।",
    },
    emailPlaceholder: { en: "Your email address", bn: "আপনার ইমেইল ঠিকানা" },
    allRightsReserved: { en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
    privacyPolicy: { en: "Privacy Policy", bn: "প্রাইভেসি পলিসি" },
    termsOfUse: { en: "Terms of Use", bn: "ব্যবহারের শর্তাবলী" },
  },
} as const;

export function ui<K extends keyof typeof UI>(
  group: K,
  key: keyof (typeof UI)[K],
  locale: Locale
): string {
  return pick((UI[group] as Record<string, Entry>)[key as string], locale);
}
