import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Dola Foundation's ongoing, completed, and upcoming projects transforming lives across Bangladesh.",
};

const FALLBACK_PROJECTS = [
  {
    id: "1",
    title: "School Construction in Sylhet",
    slug: "school-construction-sylhet",
    description:
      "Building a fully equipped primary school for 500+ children in a remote area of Sylhet, providing quality education infrastructure with 8 classrooms, library, and playground.",
    status: "ONGOING" as const,
    location: "Sylhet, Bangladesh",
    startDate: new Date("2024-01-01"),
    budget: 2500000,
    gallery: [],
  },
  {
    id: "2",
    title: "Mobile Health Clinic Program",
    slug: "mobile-health-clinic",
    description:
      "A fleet of mobile health units bringing medical care directly to remote villages without access to healthcare facilities across 6 districts.",
    status: "ONGOING" as const,
    location: "Multiple Districts",
    startDate: new Date("2023-06-01"),
    budget: 1800000,
    gallery: [],
  },
  {
    id: "3",
    title: "Clean Water Wells Initiative",
    slug: "clean-water-wells",
    description:
      "Installed 50 deep tube wells across drought-prone areas to provide clean drinking water to 10,000+ people in Rajshahi Division.",
    status: "COMPLETED" as const,
    location: "Rajshahi Division",
    startDate: new Date("2023-01-01"),
    budget: 750000,
    gallery: [],
  },
  {
    id: "4",
    title: "Youth Skills Training Center",
    slug: "youth-skills-training",
    description:
      "Establishing a permanent vocational training center in Dhaka offering courses in sewing, electrical work, digital skills, and entrepreneurship.",
    status: "UPCOMING" as const,
    location: "Dhaka, Bangladesh",
    startDate: new Date("2025-06-01"),
    budget: 3000000,
    gallery: [],
  },
  {
    id: "5",
    title: "Tree Planting Drive 2024",
    slug: "tree-planting-2024",
    description:
      "Planting 25,000 trees across coastal and inland areas of Chittagong Division in collaboration with local communities and schools.",
    status: "COMPLETED" as const,
    location: "Chittagong Division",
    startDate: new Date("2024-03-01"),
    budget: 400000,
    gallery: [],
  },
  {
    id: "6",
    title: "Flood Relief 2024",
    slug: "flood-relief-2024",
    description:
      "Emergency relief distribution to 3,000 flood-affected families in Sylhet and Sunamganj with food, clean water, and shelter materials.",
    status: "COMPLETED" as const,
    location: "Sylhet & Sunamganj",
    startDate: new Date("2024-08-01"),
    budget: 1200000,
    gallery: [],
  },
];

const statusConfig = {
  ONGOING: { label: "Ongoing", variant: "ongoing" as const },
  COMPLETED: { label: "Completed", variant: "completed" as const },
  UPCOMING: { label: "Upcoming", variant: "upcoming" as const },
};

async function getProjects() {
  try {
    const dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProjects.length === 0) return FALLBACK_PROJECTS;
    return dbProjects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      status: p.status,
      location: p.location,
      startDate: p.startDate ?? p.createdAt,
      gallery: p.gallery ?? [],
    }));
  } catch {
    return FALLBACK_PROJECTS;
  }
}

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  const headingFont = (settings as any)?.bannerHeadingFont === "inter" ? "font-inter" : "font-poppins";
  const bannerTextColor = (settings as any)?.projectsBannerTextColor || "#FFFFFF";
  const bannerBadge = (settings as any)?.projectsBannerBadge || "Our Work";
  const bannerTitle = (settings as any)?.projectsBannerTitle || "Our Projects";
  const bannerSubtitle =
    (settings as any)?.projectsBannerSubtitle ||
    "Concrete, impactful projects delivering real change in communities across Bangladesh.";
  return (
    <div className="pt-20">
      {/* Hero */}
      {settings?.projectsBannerImage ? (
        <section className="relative bg-gradient-to-br from-primary to-[#1a4da0] min-h-[180px] md:min-h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.projectsBannerImage} alt="" className="w-full h-auto block" />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: (settings as any).projectsBannerOverlayColor || "#0F3D8C",
              opacity: ((settings as any).projectsBannerOverlayOpacity ?? 80) / 100,
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
            <span style={{ opacity: 1 }}>Projects</span>
          </div>
        </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-primary to-[#1a4da0] min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center py-16">
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
            <span style={{ opacity: 1 }}>Projects</span>
          </div>
        </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Filter:</span>
            {["All", "Ongoing", "Completed", "Upcoming"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-primary hover:text-white"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const { label, variant } = statusConfig[project.status];
              const coverImage = project.gallery?.[0];
              return (
                <div
                  key={project.id}
                  className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary/10 to-green/10 overflow-hidden flex items-center justify-center">
                    {coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏗️</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-poppins font-bold text-lg text-dark mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateShort(project.startDate)}
                      </span>
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:text-gold transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
