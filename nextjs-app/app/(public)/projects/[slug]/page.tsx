import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

const projectsData: Record<string, any> = {
  "school-construction-sylhet": {
    title: "School Construction in Sylhet",
    description: "Building a fully equipped primary school for 500+ children in a remote area of Sylhet.",
    fullDescription: `This project addresses one of the most critical educational needs in rural Sylhet — the complete absence of a primary school for hundreds of children who would otherwise have to walk hours each day or remain uneducated.

The school complex includes 8 modern classrooms with proper lighting and ventilation, a library stocked with books and learning materials, separate washrooms for boys and girls, a playground with safe equipment, and a teachers' office.

We are building this school in close collaboration with the local community, who have donated land and provide voluntary labor. The construction follows eco-friendly principles with energy-efficient design and rainwater harvesting.`,
    status: "ONGOING",
    location: "Sylhet, Bangladesh",
    startDate: new Date("2024-01-01"),
    budget: 2500000,
    impact: "Upon completion, this school will provide quality primary education to 500+ children from 5 surrounding villages, eliminating the need for children to travel dangerous distances. It will also create employment for 12 local teachers and administrative staff.",
    gallery: [
      "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    ],
    milestones: [
      { label: "Land secured and community agreement", done: true },
      { label: "Foundation and structure complete", done: true },
      { label: "Roof and walls completed", done: false },
      { label: "Interior fixtures and furniture", done: false },
      { label: "School inauguration", done: false },
    ],
  },
  "mobile-health-clinic": {
    title: "Mobile Health Clinic Program",
    description: "Bringing medical care directly to remote villages through mobile health units.",
    fullDescription: `The Mobile Health Clinic Program is one of our most impactful ongoing initiatives. Operating across 6 districts, our four specially equipped vehicles serve as fully functional medical clinics on wheels.

Each unit is staffed by a doctor, two nurses, and a community health worker. They follow weekly routes, visiting pre-scheduled villages and setting up temporary clinics in community centers, mosque courtyards, or school grounds.

Services include: general consultations, basic blood tests, blood pressure and diabetes screening, maternal health checkups, child vaccination support, and distribution of essential medicines.`,
    status: "ONGOING",
    location: "Multiple Districts, Bangladesh",
    startDate: new Date("2023-06-01"),
    budget: 1800000,
    impact: "Since launch, our mobile clinics have conducted 8,000+ consultations, detected 200+ cases of hypertension and diabetes, supported 300+ pregnant women, and distributed medicines worth over ৳500,000 free of charge.",
    gallery: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    ],
    milestones: [
      { label: "Program launch with 2 clinics", done: true },
      { label: "Expanded to 4 mobile units", done: true },
      { label: "6-district coverage achieved", done: true },
      { label: "Expand to 8 districts", done: false },
      { label: "Add specialist services", done: false },
    ],
  },
  "clean-water-wells": {
    title: "Clean Water Wells Initiative",
    description: "Providing clean drinking water to thousands in drought-prone areas through deep tube wells.",
    fullDescription: `Access to clean drinking water is a fundamental human right, yet many communities in Rajshahi Division face severe water scarcity and contamination issues. This project installed 50 deep tube wells providing safe drinking water to over 10,000 people.

Each well was installed at a depth of 200-250 feet to access clean aquifer water, away from surface contamination. Communities were trained on well maintenance and water safety practices. A local maintenance committee was formed for each well to ensure longevity.

This project was funded through a combination of individual donations, corporate CSR partnerships, and a government matching grant.`,
    status: "COMPLETED",
    location: "Rajshahi Division",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    budget: 750000,
    impact: "The project provided clean water access to 10,000+ people across 50 villages. Waterborne disease rates dropped by an estimated 40% in served areas. Women and children no longer have to walk long distances to collect water, freeing up time for education and livelihoods.",
    gallery: [
      "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&q=80",
      "https://images.unsplash.com/photo-1543207037-840a0a359376?w=800&q=80",
    ],
    milestones: [
      { label: "Site surveys and community selection", done: true },
      { label: "25 wells installed (Phase 1)", done: true },
      { label: "25 wells installed (Phase 2)", done: true },
      { label: "Community training completed", done: true },
      { label: "6-month follow-up assessment", done: true },
    ],
  },
};

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = projectsData[params.slug];
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.description };
}

export function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

const statusConfig: Record<string, { label: string; variant: any; color: string }> = {
  ONGOING: { label: "Ongoing", variant: "ongoing", color: "#22c55e" },
  COMPLETED: { label: "Completed", variant: "completed", color: "#3b82f6" },
  UPCOMING: { label: "Upcoming", variant: "upcoming", color: "#f59e0b" },
};

export default function ProjectDetailPage({ params }: PageProps) {
  const project = projectsData[params.slug];
  if (!project) notFound();

  const status = statusConfig[project.status];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F3D8C] to-[#1a4da0] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <div className="flex flex-wrap items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-4">
                {project.title}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-5 mt-5 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Started {formatDate(project.startDate)}
                </span>
                {project.budget && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    Budget: {formatCurrency(project.budget)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-card p-8">
                <h2 className="font-poppins font-bold text-2xl text-[#1A1A2E] mb-4">About This Project</h2>
                <div>
                  {project.fullDescription.split("\n\n").map((para: string, i: number) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-8">
                <h2 className="font-poppins font-bold text-2xl text-[#1A1A2E] mb-4">Impact</h2>
                <p className="text-gray-600 leading-relaxed">{project.impact}</p>
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-8">
                  <h2 className="font-poppins font-bold text-2xl text-[#1A1A2E] mb-5">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {project.gallery.map((img: string, i: number) => (
                      <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                        <img src={img} alt={`Project photo ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Milestones */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-poppins font-bold text-lg text-[#1A1A2E] mb-4">Project Milestones</h3>
                <div className="space-y-3">
                  {project.milestones.map((milestone: any, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: milestone.done ? "#22c55e" : "#d1d5db" }}
                      />
                      <span className={`text-sm ${milestone.done ? "text-gray-700" : "text-gray-400"}`}>
                        {milestone.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donate */}
              <div className="bg-gradient-to-br from-[#0F3D8C] to-[#1a4da0] rounded-2xl p-6 text-white">
                <h3 className="font-poppins font-bold text-lg mb-2">Support This Project</h3>
                <p className="text-white/80 text-sm mb-4">
                  Your donation directly funds this project and its impact on the community.
                </p>
                <Link href="/donate">
                  <Button variant="default" className="w-full">Donate Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
