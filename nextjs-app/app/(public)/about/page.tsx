import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Target,
  Eye,
  Heart,
  Users,
  Star,
  Globe,
  Award,
  Lightbulb,
  Shield,
  HeartHandshake,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Dola Foundation's story, mission, vision, and the dedicated team working to empower communities across Bangladesh.",
};

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We approach our work with deep empathy and care for every person we serve.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We maintain full transparency and accountability in all our operations.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We seek creative solutions to complex social challenges in our communities.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in the power of community-led development and local ownership.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description: "We create lasting change by building systems that endure beyond our programs.",
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
  {
    icon: HeartHandshake,
    title: "Partnership",
    description: "We work collaboratively with communities, governments, and organizations.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

const FALLBACK_TEAM = [
  { name: "Dr. Ahmed Rahman", role: "Founder & Executive Director", bio: "A social entrepreneur with 20+ years of experience in community development.", image: null },
  { name: "Nasrin Akter", role: "Program Director", bio: "Expert in education and women empowerment with a passion for sustainable change.", image: null },
  { name: "Karim Uddin", role: "Healthcare Coordinator", bio: "Medical professional dedicated to bringing healthcare to rural communities.", image: null },
  { name: "Shirin Islam", role: "Finance & Operations", bio: "Certified accountant ensuring transparency and efficiency in fund management.", image: null },
];

const MEMBER_COLORS = ["bg-primary", "bg-green", "bg-gold", "bg-purple-600", "bg-pink-500", "bg-teal-500"];

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return members.length > 0 ? members : null;
  } catch {
    return null;
  }
}

async function getCoreValues() {
  try {
    const items = await prisma.contentItem.findMany({
      where: { section: "about-values", active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const [settings, dbTeam, dbValues] = await Promise.all([getSettings(), getTeamMembers(), getCoreValues()]);
  const teamMembers = dbTeam ?? FALLBACK_TEAM;

  const founderName = settings?.founderName || "Dr. Ahmed Rahman";

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-primary via-[#0d3578] to-green py-20 md:py-28"
        style={settings?.aboutBannerImage ? {
          backgroundImage: `url(${settings.aboutBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {settings?.aboutBannerImage && <div className="absolute inset-0 bg-primary/70" />}
        {!settings?.aboutBannerImage && <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            About Us
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            Who We Are
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Dola Foundation is a non-profit organization committed to creating
            lasting positive change in the lives of vulnerable communities across
            Bangladesh.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">About</span>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-gold/15 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                Our Story
              </span>
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-dark mb-5 leading-tight">
                A Decade of Changing Lives
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {settings?.aboutText ? (
                  settings.aboutText
                    .split(/\n+/)
                    .filter((paragraph) => paragraph.trim().length > 0)
                    .map((paragraph, i) => <p key={i}>{paragraph}</p>)
                ) : (
                  <>
                    <p>
                      Founded in 2015 by Dr. Ahmed Rahman, Dola Foundation began as
                      a small initiative to provide education support to 20 children
                      in a rural village in Sylhet. What started as a passion project
                      has grown into a fully operational NGO serving thousands of
                      people across 8 districts.
                    </p>
                    <p>
                      The name "Dola" represents the Bangla concept of a swing — a
                      symbol of the gentle, uplifting motion of lives being elevated
                      from poverty and despair to dignity and hope. We believe every
                      person deserves the opportunity to swing upward.
                    </p>
                    <p>
                      Over the years, we've built schools, operated health camps,
                      distributed relief supplies during floods and other disasters,
                      trained thousands of youth, and provided care to hundreds of
                      orphaned children. Our work continues to expand because the
                      need is great and our community of supporters grows every day.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: settings?.aboutStat1Value || "2015", label: settings?.aboutStat1Label || "Founded", icon: settings?.aboutStat1Icon || "🏛️" },
                { value: settings?.aboutStat2Value || "5,000+", label: settings?.aboutStat2Label || "Lives Impacted", icon: settings?.aboutStat2Icon || "❤️" },
                { value: settings?.aboutStat3Value || "8", label: settings?.aboutStat3Label || "Districts Served", icon: settings?.aboutStat3Icon || "📍" },
                { value: settings?.aboutStat4Value || "500+", label: settings?.aboutStat4Label || "Volunteers", icon: settings?.aboutStat4Icon || "👥" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-gray-100"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="font-poppins font-black text-2xl text-primary">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary rounded-3xl p-8 md:p-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-poppins font-bold text-2xl text-white mb-3">
                Our Mission
              </h3>
              <p className="text-white/80 leading-relaxed">
                {settings?.missionText ||
                  "To empower vulnerable communities in Bangladesh through sustainable programs in education, healthcare, livelihood, and environmental conservation — ensuring that every individual has access to their fundamental rights and the opportunity to live with dignity."}
              </p>
            </div>
            <div className="bg-green rounded-3xl p-8 md:p-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-poppins font-bold text-2xl text-white mb-3">
                Our Vision
              </h3>
              <p className="text-white/80 leading-relaxed">
                {settings?.visionText ||
                  "A Bangladesh where no child goes without education, no family suffers from preventable illness, no community is left behind in development, and where every person — regardless of their background — can live a life full of potential and hope."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Our Values"
            title="What Drives Us"
            subtitle="These core values guide everything we do — from program design to how we treat every person we serve."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbValues
              ? dbValues.map((value) => (
                  <div
                    key={value.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-2xl">
                      {value.icon || "💡"}
                    </div>
                    <h3 className="font-poppins font-bold text-lg text-dark mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))
              : values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`w-12 h-12 ${value.bg} rounded-xl flex items-center justify-center mb-4`}
                      >
                        <Icon className={`w-6 h-6 ${value.color}`} />
                      </div>
                      <h3 className="font-poppins font-bold text-lg text-dark mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-card p-8 md:p-12 relative">
            <div className="absolute top-8 right-8 text-primary/10">
              <svg width="80" height="60" viewBox="0 0 80 60" fill="currentColor">
                <path d="M0 60V36C0 24 4 14.667 12 8L20 0h16L24 12c-4 4-6 8.667-6 14v6h14V60H0zm44 0V36c0-12 4-21.333 12-28L64 0h16L68 12c-4 4-6 8.667-6 14v6h14V60H44z" />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-8">
              {settings?.founderImage ? (
                <img
                  src={settings.founderImage}
                  alt={founderName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                  {founderName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="inline-block bg-gold/15 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  Founder's Message
                </span>
                <blockquote className="text-gray-600 text-base leading-relaxed mb-6 italic">
                  "{settings?.founderMessage ||
                    "When I started Dola Foundation in 2015, I had one dream: that no child in Bangladesh would miss out on education simply because of poverty. A decade later, that dream has grown into something far greater. We now serve thousands of families, operating programs that span education, health, environment, and youth empowerment. But we have not yet finished our work. As long as there are children without schools, families without healthcare, and communities without clean water, Dola Foundation will continue to act. I invite you to join us on this journey of hope."}"
                </blockquote>
                <div>
                  <div className="font-poppins font-bold text-dark">
                    {founderName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Founder & Executive Director, Dola Foundation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Our Team"
            title="Meet the Team"
            subtitle="Dedicated professionals and community leaders driving our mission forward every day."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 text-center transition-all duration-300 hover:-translate-y-1"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 ${MEMBER_COLORS[index % MEMBER_COLORS.length]} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="font-poppins font-bold text-dark mb-1">
                  {member.name}
                </h3>
                <div className="text-primary text-xs font-semibold mb-3">
                  {member.role}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
