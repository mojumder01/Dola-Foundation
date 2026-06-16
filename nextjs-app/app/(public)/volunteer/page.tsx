import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Clock, Users, Award, Heart } from "lucide-react";
import { submitVolunteer } from "@/actions/volunteer";
import { prisma } from "@/lib/prisma";
import { getLocale, pickLocale } from "@/lib/locale";
import VolunteerForm from "./VolunteerForm";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Volunteer With Us",
  description:
    "Join Dola Foundation as a volunteer and make a real difference in the communities we serve across Bangladesh.",
};

const benefits = [
  {
    icon: Heart,
    title: "Create Real Impact",
    description: "Directly contribute to programs that change lives in underserved communities.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Award,
    title: "Develop Your Skills",
    description: "Build leadership, communication, and technical skills through hands-on work.",
    color: "text-primary",
    bg: "bg-blue-50",
  },
  {
    icon: Users,
    title: "Build Connections",
    description: "Join a community of dedicated changemakers and build lifelong friendships.",
    color: "text-green",
    bg: "bg-green-50",
  },
];

const steps = [
  {
    step: "01",
    title: "Apply Online",
    description: "Fill out our volunteer registration form with your skills and interests.",
  },
  {
    step: "02",
    title: "Interview & Orientation",
    description: "We'll contact you for a brief interview and schedule your orientation session.",
  },
  {
    step: "03",
    title: "Start Making a Difference",
    description: "Get matched with programs that fit your skills and start creating impact.",
  },
];

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getDBItems(section: string) {
  try {
    const items = await prisma.contentItem.findMany({
      where: { section, active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

export default async function VolunteerPage() {
  const [locale, settings, dbBenefits, dbSteps] = await Promise.all([
    getLocale(),
    getSettings(),
    getDBItems("volunteer-benefits"),
    getDBItems("volunteer-steps"),
  ]);

  const t = (en?: string | null, bn?: string | null) => pickLocale(en, bn, locale);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-green to-primary py-20 md:py-28"
        style={settings?.volunteerBannerImage ? {
          backgroundImage: `url(${settings.volunteerBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {settings?.volunteerBannerImage && <div className="absolute inset-0 bg-primary/70" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {t(settings?.volunteerPageBadge, settings?.volunteerPageBadgeBn) || "Get Involved"}
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            {t(settings?.volunteerPageTitle, settings?.volunteerPageTitleBn) || "Volunteer With Us"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(settings?.volunteerPageSubtitle, settings?.volunteerPageSubtitleBn) ||
              "Your time, skills, and passion can change lives. Join our community of 500+ volunteers working to build a better Bangladesh."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">{locale === "bn" ? "হোম" : "Home"}</Link>
            <span>/</span>
            <span className="text-white">{locale === "bn" ? "স্বেচ্ছাসেবক" : "Volunteer"}</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-poppins font-bold text-3xl text-dark mb-3">
              {t(settings?.volunteerWhyHeading, settings?.volunteerWhyHeadingBn) || "Why Volunteer With Us?"}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t(settings?.volunteerWhyDescription, settings?.volunteerWhyDescriptionBn) ||
                "Volunteering with Dola Foundation is a rewarding experience that benefits both you and the communities we serve."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {dbBenefits
              ? dbBenefits.map((benefit) => (
                  <div key={benefit.id} className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-2xl">
                      {benefit.icon || "💡"}
                    </div>
                    <h3 className="font-poppins font-bold text-lg text-dark mb-2">{t(benefit.title, benefit.titleBn)}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{t(benefit.description, benefit.descriptionBn)}</p>
                  </div>
                ))
              : benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                      <div className={`w-12 h-12 ${benefit.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <h3 className="font-poppins font-bold text-lg text-dark mb-2">{benefit.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-poppins font-bold text-3xl text-dark mb-3">
              {t(settings?.volunteerHowHeading, settings?.volunteerHowHeadingBn) || "How It Works"}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(dbSteps ?? steps).map((step: any, index: number) => (
              <div key={step.id ?? index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="font-poppins font-black text-2xl text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-poppins font-bold text-lg text-dark mb-2">
                  {t(step.title, step.titleBn)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(step.description, step.descriptionBn)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-poppins font-bold text-3xl text-dark mb-3">
              {t(settings?.volunteerApplyHeading, settings?.volunteerApplyHeadingBn) || "Apply to Volunteer"}
            </h2>
            <p className="text-gray-500">
              {t(settings?.volunteerApplySubtitle, settings?.volunteerApplySubtitleBn) ||
                "Fill in the form below and we'll get back to you within 3-5 business days."}
            </p>
          </div>
          <VolunteerForm />
        </div>
      </section>
    </div>
  );
}
