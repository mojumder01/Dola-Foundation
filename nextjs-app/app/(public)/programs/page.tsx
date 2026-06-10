import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export const metadata: Metadata = {
  title: "Our Programs",
  description:
    "Explore Dola Foundation's six comprehensive programs: Education, Healthcare, Charity & Relief, Environment, Youth Development, and Orphan Care.",
};

const programs = [
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

export default function ProgramsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F3D8C] to-[#1F9D55] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Our Programs
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            What We Do
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Six comprehensive programs designed to address the most critical
            needs of vulnerable communities in Bangladesh.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Programs</span>
          </div>
        </div>
      </section>

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
                      <h2 className="font-poppins font-bold text-xl text-[#1A1A2E] mb-1">
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
