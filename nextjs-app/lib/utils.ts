import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatCurrency(
  amount: number,
  currency: string = "BDT"
): string {
  if (currency === "BDT") {
    return `৳${amount.toLocaleString("en-BD")}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function parseNumber(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
}

export function generateMetadata(title: string, description: string) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export const PROGRAMS = [
  {
    id: "education",
    title: "Education",
    slug: "education",
    description:
      "Providing quality education and learning opportunities to underprivileged children and youth.",
    icon: "📚",
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    slug: "healthcare",
    description:
      "Delivering essential healthcare services and health awareness programs to rural communities.",
    icon: "🏥",
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
  },
  {
    id: "charity-relief",
    title: "Charity & Relief",
    slug: "charity-relief",
    description:
      "Providing immediate relief and support to families affected by poverty and natural disasters.",
    icon: "🤝",
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "environment",
    title: "Environment",
    slug: "environment",
    description:
      "Protecting the environment through tree planting, clean water, and climate action initiatives.",
    icon: "🌿",
    color: "from-emerald-500 to-teal-700",
    bgColor: "bg-emerald-50",
  },
  {
    id: "youth-development",
    title: "Youth Development",
    slug: "youth-development",
    description:
      "Empowering young people through skills training, mentorship, and leadership programs.",
    icon: "🌟",
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
  },
  {
    id: "orphan-care",
    title: "Orphan Care",
    slug: "orphan-care",
    description:
      "Providing loving care, education, and opportunities to orphaned and vulnerable children.",
    icon: "❤️",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
  },
];

export const FAQS = [
  {
    question: "How can I donate to Dola Foundation?",
    answer:
      "You can donate through our secure online portal using bKash, Nagad, Rocket, bank transfer, or international payment methods. Visit our Donate page to contribute.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Yes, donations to Dola Foundation are eligible for tax deduction under the Income Tax Ordinance of Bangladesh. We provide official receipts for all donations.",
  },
  {
    question: "How can I become a volunteer?",
    answer:
      "Fill out our volunteer registration form on the Volunteer page. Our team will review your application and contact you within 3-5 business days.",
  },
  {
    question: "Where does my donation go?",
    answer:
      "Your donation directly funds our programs in education, healthcare, charity relief, environment, youth development, and orphan care. We maintain full transparency with detailed annual reports.",
  },
  {
    question: "Can I specify which program my donation supports?",
    answer:
      "Absolutely! When making a donation, you can select the specific program you'd like to support, or choose to contribute to our general fund where it's needed most.",
  },
];
