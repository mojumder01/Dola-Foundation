import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import DonationForm from "./DonationForm";
import { prisma } from "@/lib/prisma";
import { getLocale, pickLocale } from "@/lib/locale";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Dola Foundation's mission to empower communities through education, healthcare, and development programs.",
};

const defaultImpactAmounts = [
  { amount: 500, impact: "Feeds a family of 5 for a week", icon: "🍱" },
  { amount: 1000, impact: "Provides school supplies for one child", icon: "📚" },
  { amount: 2500, impact: "Covers a complete medical consultation", icon: "🏥" },
  { amount: 5000, impact: "Sponsors one month of a child's education", icon: "🎓" },
  { amount: 10000, impact: "Plants 50 trees for the environment", icon: "🌿" },
  { amount: 25000, impact: "Installs a clean water well for a village", icon: "💧" },
];

const defaultTrustIndicators = [
  "✓ NGO Affairs Bureau Registered",
  "✓ Tax Deductible Donations",
  "✓ 100% Transparent Fund Usage",
  "✓ Secure Payment Processing",
  "✓ Annual Audited Reports",
];

const defaultWhyDonate = [
  "100% of donations reach programs",
  "Full financial transparency",
  "Tax deductible receipt provided",
  "Regular impact updates sent",
  "Dedicated donor support team",
];

async function getImpactAmounts() {
  try {
    const impacts = await prisma.donationImpact.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return impacts.length > 0 ? impacts : defaultImpactAmounts;
  } catch {
    return defaultImpactAmounts;
  }
}

async function getActivePaymentMethods() {
  try {
    return await prisma.paymentMethodConfig.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getContentList(section: string, fallback: string[]) {
  try {
    const items = await prisma.contentItem.findMany({
      where: { section, active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return items.length > 0
      ? items.map((i) => ({ title: i.title || "", titleBn: i.titleBn }))
      : fallback.map((title) => ({ title, titleBn: undefined as string | undefined }));
  } catch {
    return fallback.map((title) => ({ title, titleBn: undefined as string | undefined }));
  }
}

export default async function DonatePage() {
  const [locale, impactAmounts, paymentMethods, settings, trustIndicators, whyDonate] = await Promise.all([
    getLocale(),
    getImpactAmounts(),
    getActivePaymentMethods(),
    getSettings(),
    getContentList("donate-trust", defaultTrustIndicators),
    getContentList("donate-why", defaultWhyDonate),
  ]);
  const bankMethod = paymentMethods.find((m) => m.type === "BANK_TRANSFER");

  const t = (en?: string | null, bn?: string | null) => pickLocale(en, bn, locale);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-primary to-[#1a4da0] py-20 md:py-28"
        style={settings?.donateBannerImage ? {
          backgroundImage: `url(${settings.donateBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {settings?.donateBannerImage && <div className="absolute inset-0 bg-primary/70" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-gold/20 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {locale === "bn" ? "পরিবর্তন আনুন" : "Make a Difference"}
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            {t(settings?.donatePageTitle, settings?.donatePageTitleBn) || "Donate to Dola Foundation"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t(settings?.donatePageSubtitle, settings?.donatePageSubtitleBn) ||
              "Your generous donation directly funds our programs and creates lasting change in the lives of thousands of families across Bangladesh."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">{locale === "bn" ? "হোম" : "Home"}</Link>
            <span>/</span>
            <span className="text-white">{locale === "bn" ? "দান করুন" : "Donate"}</span>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {trustIndicators.map((item, idx) => (
              <span key={idx} className="text-gray-500 text-sm">{t(item.title, item.titleBn)}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Amounts */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-bold text-2xl text-dark text-center mb-8">
            {locale === "bn" ? "আপনার প্রভাব দেখুন" : "See Your Impact"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {impactAmounts.map((item, idx) => (
              <div
                key={(item as any).id || `${item.amount}-${idx}`}
                className="bg-white rounded-2xl p-4 text-center shadow-card hover:shadow-card-hover transition-all border border-gray-100 hover:-translate-y-1 cursor-pointer"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-poppins font-black text-xl text-primary">
                  ৳{item.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-snug">
                  {t(item.impact, (item as any).impactBn)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DonationForm
                paymentMethods={paymentMethods.map((m) => ({
                  ...m,
                  name: t(m.name, m.nameBn) || m.name,
                  instructions: t(m.instructions, m.instructionsBn) || m.instructions,
                }))}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-bold text-dark mb-3">
                  {locale === "bn" ? "কেন দান করবেন?" : "Why Donate?"}
                </h3>
                <ul className="space-y-2.5">
                  {whyDonate.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
                      {t(point.title, point.titleBn)}
                    </li>
                  ))}
                </ul>
              </div>

              {bankMethod && (
                <div className="bg-primary rounded-2xl p-5 text-white">
                  <h3 className="font-poppins font-bold mb-2">
                    {t(bankMethod.name, bankMethod.nameBn) || "Bank Transfer"}
                  </h3>
                  <div className="text-sm text-white/80 space-y-1 whitespace-pre-line">
                    {bankMethod.accountInfo && (
                      <p><span className="text-white font-medium">{locale === "bn" ? "অ্যাকাউন্ট:" : "Account:"}</span> {bankMethod.accountInfo}</p>
                    )}
                    {bankMethod.instructions && <p>{t(bankMethod.instructions, bankMethod.instructionsBn)}</p>}
                  </div>
                </div>
              )}

              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-bold text-dark mb-2">
                  {locale === "bn" ? "সাহায্য প্রয়োজন?" : "Need Help?"}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {locale === "bn" ? "দান সম্পর্কিত সহায়তার জন্য যোগাযোগ করুন:" : "For donation assistance, contact us:"}
                </p>
                <p className="text-primary font-medium text-sm">
                  info@dolafoundation.com
                </p>
                <p className="text-gray-500 text-sm">+880 1700-000000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
