import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Programs",
  description:
    "Explore Dola Foundation's six comprehensive programs: Education, Healthcare, Charity & Relief, Environment, Youth Development, and Orphan Care.",
};

const GRADIENTS = [
  { gradient: "from-blue-500 to-blue-700", color: "#3b82f6" },
  { gradient: "from-green-500 to-green-700", color: "#22c55e" },
  { gradient: "from-yellow-500 to-orange-600", color: "#f59e0b" },
  { gradient: "from-emerald-500 to-teal-700", color: "#10b981" },
  { gradient: "from-purple-500 to-purple-700", color: "#a855f7" },
  { gradient: "from-pink-500 to-rose-600", color: "#ec4899" },
];

const FALLBACK_PROGRAMS = [
  {
    title: "Education",
    slug: "education",
    icon: "📚",
    description:
      "We believe education is the most powerful tool for breaking the cycle of poverty. Our education program operates free learning centers, provides school supplies, scholarships, and teacher training across rural Bangladesh.",
    objectives: [
      "Establish free learning centers in rural areas",
      "Provide school supplies, uniforms, and meals",
      "Train and support local teachers",
      "Offer scholarships for higher education",
      "Run adult literacy programs",
    ],
    stats: [{ label: "Students", value: "2,000+" }, { label: "Centers", value: "15" }, { label: "Districts", value: "5" }],
    gradient: "from-blue-500 to-blue-700",
    color: "#3b82f6",
  },
  {
    title: "Healthcare",
    slug: "healthcare",
    icon: "🏥",
    description:
      "Access to basic healthcare remains a challenge in rural Bangladesh. Our healthcare program runs mobile health clinics, health awareness camps, maternal health support, and clean water initiatives.",
    objectives: [
      "Operate mobile health clinics in 6 districts",
      "Provide free medical consultations and medicines",
      "Support maternal and child health programs",
      "Run nutrition awareness campaigns",
      "Facilitate medical evacuations when necessary",
    ],
    stats: [{ label: "Patients Served", value: "8,000+" }, { label: "Mobile Units", value: "4" }, { label: "Health Camps", value: "50+" }],
    gradient: "from-green-500 to-green-700",
    color: "#22c55e",
  },
  {
    title: "Charity & Relief",
    slug: "charity-relief",
    icon: "🤝",
    description:
      "When disaster strikes or poverty leaves families without basic necessities, Dola Foundation is there. We provide food, clothing, shelter materials, and emergency cash support to families in crisis.",
    objectives: [
      "Distribute food packages to 500+ families monthly",
      "Provide emergency relief during floods and cyclones",
      "Support widows and single-parent households",
      "Distribute Eid and seasonal clothing packages",
      "Facilitate Qurbani meat distribution",
    ],
    stats: [{ label: "Families Helped", value: "1,500+" }, { label: "Relief Packages", value: "5,000+" }, { label: "Emergency Responses", value: "20+" }],
    gradient: "from-yellow-500 to-orange-600",
    color: "#f59e0b",
  },
  {
    title: "Environment",
    slug: "environment",
    icon: "🌿",
    description:
      "Climate change disproportionately affects Bangladesh's poor. We run tree planting drives, clean water programs, solar energy initiatives, and community awareness campaigns to protect our environment.",
    objectives: [
      "Plant 100,000 trees annually",
      "Install deep tube wells for clean water",
      "Promote solar energy in rural households",
      "Organize river and beach clean-up drives",
      "Educate communities on climate adaptation",
    ],
    stats: [{ label: "Trees Planted", value: "50,000+" }, { label: "Wells Installed", value: "75" }, { label: "Communities Trained", value: "30+" }],
    gradient: "from-emerald-500 to-teal-700",
    color: "#10b981",
  },
  {
    title: "Youth Development",
    slug: "youth-development",
    icon: "🌟",
    description:
      "Bangladesh's greatest asset is its youth. We invest in young people through vocational training, digital skills, leadership programs, sports, and mentorship to prepare them for a competitive future.",
    objectives: [
      "Provide vocational and technical training",
      "Offer digital literacy and coding programs",
      "Organize leadership camps and workshops",
      "Support youth entrepreneurship initiatives",
      "Create mentorship networks with professionals",
    ],
    stats: [{ label: "Youth Trained", value: "1,200+" }, { label: "Skill Programs", value: "8" }, { label: "Job Placements", value: "400+" }],
    gradient: "from-purple-500 to-purple-700",
    color: "#a855f7",
  },
  {
    title: "Orphan Care",
    slug: "orphan-care",
    icon: "❤️",
    description:
      "Every child deserves love, care, and a future. We support orphaned and vulnerable children with education, nutrition, healthcare, emotional support, and pathways to independent living.",
    objectives: [
      "Support 200+ orphaned children annually",
      "Provide full educational sponsorships",
      "Ensure nutritious meals and healthcare",
      "Offer psychological support and counseling",
      "Create pathways to skill development and independence",
    ],
    stats: [{ label: "Children Supported", value: "250+" }, { label: "Full Sponsorships", value: "100+" }, { label: "Graduated", value: "60+" }],
    gradient: "from-pink-500 to-rose-600",
    color: "#ec4899",
  },
];

async function getPrograms() {
  try {
    const dbPrograms = await prisma.program.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (dbPrograms.length === 0) return FALLBACK_PROGRAMS;
    return dbPrograms.map((p, i) => ({
      title: p.title,
      slug: p.slug,
      icon: p.icon || "🌟",
      description: p.description,
      objectives: p.objectives ?? [],
      stats: [
        p.stat1Label && p.stat1Value ? { label: p.stat1Label, value: p.stat1Value } : null,
        p.stat2Label && p.stat2Value ? { label: p.stat2Label, value: p.stat2Value } : null,
        p.stat3Label && p.stat3Value ? { label: p.stat3Label, value: p.stat3Value } : null,
      ].filter(Boolean) as { label: string; value: string }[],
      gradient: GRADIENTS[i % GRADIENTS.length].gradient,
      color: GRADIENTS[i % GRADIENTS.length].color,
    }));
  } catch {
    return FALLBACK_PROGRAMS;
  }
}

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function ProgramsPage() {
  const [programs, settings] = await Promise.all([getPrograms(), getSettings()]);
  const headingFont = (settings as any)?.bannerHeadingFont === "inter" ? "font-inter" : "font-poppins";
  const bannerTextColor = (settings as any)?.programsBannerTextColor || "#FFFFFF";
  const bannerBadge = (settings as any)?.programsBannerBadge || "Our Programs";
  const bannerTitle = (settings as any)?.programsBannerTitle || "What We Do";
  const bannerSubtitle =
    (settings as any)?.programsBannerSubtitle ||
    "Six comprehensive programs designed to address the most critical needs of vulnerable communities in Bangladesh.";
  return (
    <div className="pt-20">
      {/* Hero */}
      {settings?.programsBannerImage ? (
        <section className="relative bg-gradient-to-br from-primary to-green min-h-[180px] md:min-h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.programsBannerImage} alt="" className="w-full h-auto block" />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: (settings as any).programsBannerOverlayColor || "#0F3D8C",
              opacity: ((settings as any).programsBannerOverlayOpacity ?? 80) / 100,
            }}
          />
          <div className="absolute inset-0 flex items-center py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ color: bannerTextColor }}>
            {bannerBadge}
          </span>
          <h1 className={`${headingFont} font-black text-4xl md:text-5xl mb-5`} style={{ color: bannerTextColor }}>
            {bannerTitle}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: bannerTextColor, opacity: 0.8 }}>
            {bannerSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm" style={{ color: bannerTextColor, opacity: 0.6 }}>
            <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span>/</span>
            <span style={{ opacity: 1 }}>Programs</span>
          </div>
        </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-primary to-green min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ color: bannerTextColor }}>
            {bannerBadge}
          </span>
          <h1 className={`${headingFont} font-black text-4xl md:text-5xl mb-5`} style={{ color: bannerTextColor }}>
            {bannerTitle}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: bannerTextColor, opacity: 0.8 }}>
            {bannerSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm" style={{ color: bannerTextColor, opacity: 0.6 }}>
            <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span>/</span>
            <span style={{ opacity: 1 }}>Programs</span>
          </div>
        </div>
        </section>
      )}

      {/* Programs Grid */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div
                key={program.slug}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${program.gradient}`} />
                <div className="p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${program.gradient} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                      {program.icon}
                    </div>
                    <div>
                      <h2 className="font-poppins font-bold text-xl text-dark mb-1">
                        {program.title}
                      </h2>
                      <div className="flex gap-3">
                        {program.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <span className="font-bold text-sm" style={{ color: program.color }}>{stat.value}</span>
                            <div className="text-gray-400 text-xs">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {program.description}
                  </p>

                  <div className="mb-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                      Key Objectives
                    </h4>
                    <ul className="space-y-1.5">
                      {program.objectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: program.color }} />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/programs/${program.slug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-sm transition-all"
                    style={{ color: program.color }}
                  >
                    Learn More About {program.title}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
