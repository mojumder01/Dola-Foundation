import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import DonationForm from "./DonationForm";
import { prisma } from "@/lib/prisma";

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
    return items.length > 0 ? items.map((i) => i.title || "") : fallback;
  } catch {
    return fallback;
  }
}

export default async function DonatePage() {
  const [impactAmounts, paymentMethods, settings, trustIndicators, whyDonate] = await Promise.all([
    getImpactAmounts(),
    getActivePaymentMethods(),
    getSettings(),
    getContentList("donate-trust", defaultTrustIndicators),
    getContentList("donate-why", defaultWhyDonate),
  ]);
  const bankMethod = paymentMethods.find((m) => m.type === "BANK_TRANSFER");

  return (
    <div className="pt-20">
      {/* Hero */}
      {settings?.donateBannerImage ? (
        <section className="relative bg-gradient-to-br from-primary to-[#1a4da0] min-h-[180px] md:min-h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.donateBannerImage} alt="" className="w-full h-auto block" />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: (settings as any).donateBannerOverlayColor || "#0F3D8C",
              opacity: ((settings as any).donateBannerOverlayOpacity ?? 80) / 100,
            }}
          />
          <div className="absolute inset-0 flex items-center py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-gold/20 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Make a Difference
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            {settings?.donatePageTitle || "Donate to Dola Foundation"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {settings?.donatePageSubtitle ||
              "Your generous donation directly funds our programs and creates lasting change in the lives of thousands of families across Bangladesh."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Donate</span>
          </div>
        </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-primary to-[#1a4da0] min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-gold/20 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Make a Difference
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            {settings?.donatePageTitle || "Donate to Dola Foundation"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {settings?.donatePageSubtitle ||
              "Your generous donation directly funds our programs and creates lasting change in the lives of thousands of families across Bangladesh."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Donate</span>
          </div>
        </div>
        </section>
      )}

      {/* Trust indicators */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {trustIndicators.map((item) => (
              <span key={item} className="text-gray-500 text-sm">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Amounts */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-bold text-2xl text-dark text-center mb-8">
            See Your Impact
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
                <div className="text-xs text-gray-500 mt-1 leading-snug">{item.impact}</div>
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
              <DonationForm paymentMethods={paymentMethods} />
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-bold text-dark mb-3">
                  Why Donate?
                </h3>
                <ul className="space-y-2.5">
                  {whyDonate.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {bankMethod && (
                <div className="bg-primary rounded-2xl p-5 text-white">
                  <h3 className="font-poppins font-bold mb-2">{bankMethod.name || "Bank Transfer"}</h3>
                  <div className="text-sm text-white/80 space-y-1 whitespace-pre-line">
                    {bankMethod.accountInfo && (
                      <p><span className="text-white font-medium">Account:</span> {bankMethod.accountInfo}</p>
                    )}
                    {bankMethod.instructions && <p>{bankMethod.instructions}</p>}
                  </div>
                </div>
              )}

              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-bold text-dark mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  For donation assistance, contact us:
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
