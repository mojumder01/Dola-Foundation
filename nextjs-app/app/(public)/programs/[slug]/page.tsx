import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const programsData: Record<string, any> = {
  education: {
    title: "Education Program",
    icon: "📚",
    description:
      "We believe education is the most powerful tool for breaking the cycle of poverty. Our education program has been running since 2015, establishing free learning centers, providing school supplies, and supporting thousands of children in rural Bangladesh.",
    longDescription: `Education is at the heart of everything we do. When a child receives quality education, it doesn't just benefit that child — it transforms families and entire communities. Our Education Program has helped over 2,000 children access quality learning, many of whom were previously out of school.

We operate 15 learning centers across 5 districts, each staffed with trained teachers using our locally-developed curriculum. Beyond the classroom, we provide school bags, stationery, uniforms, and nutritious snacks to ensure children come to school ready to learn.

For families who cannot afford secondary or university education, we provide scholarships to deserving students. Our adult literacy program runs evening classes for parents, particularly mothers, who missed educational opportunities in their own childhood.`,
    objectives: [
      "Establish and operate free learning centers in rural areas",
      "Provide school supplies, uniforms, and daily nutritious snacks",
      "Train and continuously support local teachers",
      "Offer merit and need-based scholarships for higher education",
      "Run adult literacy programs for parents and community members",
      "Advocate for girls' education and inclusion",
    ],
    stats: [
      { label: "Students Enrolled", value: "2,000+" },
      { label: "Learning Centers", value: "15" },
      { label: "Districts Covered", value: "5" },
      { label: "Scholarships Given", value: "200+" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80",
    ],
    gradient: "from-blue-500 to-blue-700",
    color: "#3b82f6",
  },
  healthcare: {
    title: "Healthcare Program",
    icon: "🏥",
    description:
      "Access to basic healthcare remains a critical challenge in rural Bangladesh. Our mobile health clinics and health camps have served over 8,000 patients, bringing life-saving medical care directly to those who need it most.",
    longDescription: `In rural Bangladesh, the nearest hospital can be hours away — and for many families, even if they could reach it, they cannot afford treatment. Our Healthcare Program bridges this gap by bringing medical services directly to remote communities through mobile health units.

Our four mobile clinics travel weekly routes across six districts, staffed with doctors, nurses, and community health workers. They provide general consultations, basic diagnostics, medicines, and referrals for serious cases. We also run specialized maternal health clinics to reduce preventable deaths during pregnancy and childbirth.

Preventive care is equally important. Our health education campaigns cover topics like hygiene, nutrition, disease prevention, and mental health. We partner with local schools and mosques to reach the entire community.`,
    objectives: [
      "Operate 4 mobile health clinics across 6 districts",
      "Provide free medical consultations and essential medicines",
      "Support maternal and child health through dedicated clinics",
      "Run nutrition awareness and hygiene education campaigns",
      "Train community health workers for ongoing local support",
      "Facilitate referrals and transport for critical cases",
    ],
    stats: [
      { label: "Patients Served", value: "8,000+" },
      { label: "Mobile Health Units", value: "4" },
      { label: "Health Camps", value: "50+" },
      { label: "Community Workers", value: "40+" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    ],
    gradient: "from-green-500 to-green-700",
    color: "#22c55e",
  },
  "charity-relief": {
    title: "Charity & Relief",
    icon: "🤝",
    description:
      "When families face poverty or disaster, Dola Foundation provides immediate, compassionate support. We distribute food, clothing, emergency materials, and cash support to ensure no family goes without basic necessities.",
    longDescription: `Bangladesh is one of the most disaster-prone countries in the world, with floods, cyclones, and droughts affecting millions every year. Our Charity & Relief program responds quickly and effectively when communities are in crisis.

We maintain emergency supply stocks in strategic locations, allowing us to deploy relief within hours of a disaster. Our rapid response teams distribute food packages, clean water, sanitation kits, and shelter materials to affected families.

Beyond emergency response, we run a monthly food support program for the most vulnerable households — widows, elderly without family support, and single-parent families. During Ramadan and Eid, we distribute food packages and clothing to hundreds of families.`,
    objectives: [
      "Distribute monthly food packages to 500+ vulnerable families",
      "Maintain emergency stocks for rapid disaster response",
      "Provide Ramadan food baskets and Eid clothing packages",
      "Support widows, the elderly, and single-parent households",
      "Distribute Qurbani meat to underprivileged families",
      "Provide emergency cash grants for families in extreme need",
    ],
    stats: [
      { label: "Families Helped", value: "1,500+" },
      { label: "Relief Packages", value: "5,000+" },
      { label: "Emergency Responses", value: "20+" },
      { label: "Monthly Recipients", value: "500+" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80",
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    ],
    gradient: "from-yellow-500 to-orange-600",
    color: "#f59e0b",
  },
  environment: {
    title: "Environment Program",
    icon: "🌿",
    description:
      "Climate change threatens Bangladesh's future. We respond with tree planting, clean water initiatives, solar energy, and community education to build environmental resilience.",
    longDescription: `Bangladesh faces an existential threat from climate change. Rising sea levels, increasing cyclone intensity, and unpredictable rainfall patterns threaten millions of livelihoods. Our Environment Program takes direct action to both mitigate these impacts and help communities adapt.

Since 2018, we've planted over 50,000 trees across coastal and inland areas, working with schools, communities, and local governments. Each tree planting event is also an educational opportunity — teaching communities about the importance of forests for water cycles, air quality, and biodiversity.

Our clean water initiative has installed 75 deep tube wells in drought-prone areas, giving 10,000+ people reliable access to safe drinking water. We're also promoting solar energy as an affordable, clean alternative to fossil fuels in off-grid communities.`,
    objectives: [
      "Plant 100,000 trees annually across Bangladesh",
      "Install deep tube wells for clean drinking water access",
      "Promote solar energy in 100+ rural households per year",
      "Organize monthly river, canal, and beach clean-up drives",
      "Train 500+ community members annually on climate adaptation",
      "Advocate for environmental policy changes at the local level",
    ],
    stats: [
      { label: "Trees Planted", value: "50,000+" },
      { label: "Wells Installed", value: "75" },
      { label: "Clean-up Events", value: "40+" },
      { label: "Communities Trained", value: "30+" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80",
    ],
    gradient: "from-emerald-500 to-teal-700",
    color: "#10b981",
  },
  "youth-development": {
    title: "Youth Development",
    icon: "🌟",
    description:
      "Bangladesh's youth are its greatest asset. We invest in them through vocational training, digital skills, leadership programs, and entrepreneurship support to prepare them for a competitive future.",
    longDescription: `Bangladesh has one of the largest youth populations in the world — and this demographic dividend can only be realized if young people have access to quality skills training, education, and opportunities. Our Youth Development Program is designed to do exactly that.

We run 8 different training programs covering vocational skills (sewing, electrical work, plumbing, construction), digital literacy (computer skills, social media marketing, e-commerce), and professional development (communication, leadership, CV writing, interview skills).

Our youth entrepreneurship initiative has helped 60+ young people start their own small businesses, with seed funding, mentorship, and market access support. We also organize annual youth leadership camps where 100+ young people develop confidence, vision, and teamwork skills.`,
    objectives: [
      "Provide vocational and technical training to 300+ youth annually",
      "Offer digital literacy and coding programs",
      "Organize quarterly leadership camps and workshops",
      "Support youth entrepreneurship with funding and mentorship",
      "Create mentorship networks with successful professionals",
      "Facilitate job placement and internship opportunities",
    ],
    stats: [
      { label: "Youth Trained", value: "1,200+" },
      { label: "Skill Programs", value: "8" },
      { label: "Job Placements", value: "400+" },
      { label: "Entrepreneurs Supported", value: "60+" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80",
    ],
    gradient: "from-purple-500 to-purple-700",
    color: "#a855f7",
  },
  "orphan-care": {
    title: "Orphan Care Program",
    icon: "❤️",
    description:
      "Every child deserves love, care, and a future. We provide holistic support to orphaned and vulnerable children — education, nutrition, healthcare, emotional support, and pathways to independence.",
    longDescription: `There are an estimated 5 million orphans in Bangladesh. Behind each statistic is a real child — with dreams, potential, and the need for love and care. Our Orphan Care Program is built around this simple truth.

We provide full sponsorships that cover education (school fees, supplies, uniforms), healthcare (regular checkups, medicines), nutrition (daily balanced meals), and clothing. Beyond material support, we invest deeply in the emotional and psychological wellbeing of the children we serve, with trained counselors and mentors.

As children in our program grow older, we transition them into our Youth Development Program, ensuring they graduate not just from school, but into confident, skilled adults ready for independent life. We celebrate every milestone — graduations, first jobs, and new beginnings.`,
    objectives: [
      "Support 250+ orphaned children with full sponsorships",
      "Ensure regular health checkups and medical care",
      "Provide daily nutritious meals through our meal programs",
      "Offer psychological counseling and emotional support",
      "Prepare youth for independence through skills training",
      "Connect graduates with employment and life opportunities",
    ],
    stats: [
      { label: "Children Supported", value: "250+" },
      { label: "Full Sponsorships", value: "100+" },
      { label: "Annual Graduations", value: "20+" },
      { label: "Employed Alumni", value: "60+" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    ],
    gradient: "from-pink-500 to-rose-600",
    color: "#ec4899",
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
}

async function getProgram(slug: string) {
  try {
    const db = await prisma.program.findUnique({ where: { slug } });
    if (db && db.published) {
      return {
        title: db.title,
        icon: db.icon || "🌟",
        description: db.description,
        longDescription: db.longDescription || db.description,
        objectives: db.objectives ?? [],
        stats: [
          db.stat1Label && db.stat1Value ? { label: db.stat1Label, value: db.stat1Value } : null,
          db.stat2Label && db.stat2Value ? { label: db.stat2Label, value: db.stat2Value } : null,
          db.stat3Label && db.stat3Value ? { label: db.stat3Label, value: db.stat3Value } : null,
        ].filter(Boolean),
        gallery: db.gallery ?? [],
        gradient: "from-primary to-green",
        color: "#0F3D8C",
      };
    }
  } catch {
    // fall through to static data
  }
  return programsData[slug] ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: program.title,
    description: program.description,
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${program.gradient} py-20 md:py-28 relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {program.icon}
            </div>
            <div>
              <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-3">
                {program.title}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {program.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {program.stats.map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <div className="font-poppins font-black text-3xl" style={{ color: program.color }}>
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
                <h2 className="font-poppins font-bold text-2xl text-dark mb-4">
                  About This Program
                </h2>
                <div className="prose-content">
                  {program.longDescription.split("\n\n").map((para: string, i: number) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-2xl shadow-card p-8">
                <h2 className="font-poppins font-bold text-2xl text-dark mb-5">
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {program.gallery.map((img: string, i: number) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                      <img
                        src={img}
                        alt={`${program.title} photo ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Objectives */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-poppins font-bold text-lg text-dark mb-4">
                  Key Objectives
                </h3>
                <ul className="space-y-3">
                  {program.objectives.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: program.color }} />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Donate CTA */}
              <div className={`bg-gradient-to-br ${program.gradient} rounded-2xl p-6 text-white`}>
                <h3 className="font-poppins font-bold text-lg mb-2">
                  Support This Program
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Your donation directly funds {program.title.toLowerCase()} activities and impacts real lives.
                </p>
                <Link href="/donate">
                  <Button variant="default" className="w-full">
                    Donate Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Volunteer CTA */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-6">
                <h3 className="font-poppins font-bold text-lg text-dark mb-2">
                  Volunteer With Us
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Help deliver this program on the ground. Your skills can change lives.
                </p>
                <Link href="/volunteer">
                  <Button variant="primary" className="w-full">
                    Apply to Volunteer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
