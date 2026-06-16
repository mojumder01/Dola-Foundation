import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import ImpactStats from "@/components/home/ImpactStats";
import ProgramsSection from "@/components/home/ProgramsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import SuccessStories from "@/components/home/SuccessStories";
import GalleryPreview from "@/components/home/GalleryPreview";
import VideoSection from "@/components/home/VideoSection";
import VolunteerCTA from "@/components/home/VolunteerCTA";
import DonationCTA from "@/components/home/DonationCTA";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dola Foundation | Empowering Lives, Inspiring Hope",
  description:
    "Dola Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and sustainable development programs across Bangladesh.",
};

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getPrograms() {
  try {
    return await prisma.program.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

async function getVideos() {
  try {
    return await prisma.video.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
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

const DEFAULT_SECTION_ORDER = [
  "stats",
  "programs",
  "projects",
  "testimonials",
  "gallery",
  "video",
  "volunteer",
  "donation",
];

export default async function HomePage() {
  const [
    settings,
    galleryImages,
    testimonials,
    programs,
    projects,
    videos,
    homeVolunteerBenefits,
    homeDonationTrust,
  ] = await Promise.all([
    getSettings(),
    getGalleryImages(),
    getTestimonials(),
    getPrograms(),
    getProjects(),
    getVideos(),
    getDBItems("home-volunteer-benefits"),
    getDBItems("home-donation-trust"),
  ]);

  const heroStats = settings
    ? [
        { label: settings.stat1Label, value: settings.stat1Value },
        { label: settings.stat2Label, value: settings.stat2Value },
        { label: settings.stat3Label, value: settings.stat3Value },
        { label: settings.stat4Label, value: settings.stat4Value },
      ]
    : undefined;

  const sections: Record<string, React.ReactNode> = {
    stats: (
      <ImpactStats
        key="stats"
        stats={heroStats}
        badge={settings?.homeStatsBadge}
        title={settings?.homeStatsTitle}
      />
    ),
    programs: (
      <ProgramsSection
        key="programs"
        programs={programs.map((program) => ({
          id: program.id,
          title: program.title,
          description: program.description,
          icon: program.icon,
          slug: program.slug,
        }))}
        badge={settings?.programsSectionBadge}
        title={settings?.programsSectionTitle}
        subtitle={settings?.programsSectionSubtitle}
      />
    ),
    projects: (
      <ProjectsSection
        key="projects"
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          status: p.status,
          location: p.location,
          startDate: p.startDate,
          gallery: p.gallery,
        }))}
        badge={settings?.projectsSectionBadge}
        title={settings?.projectsSectionTitle}
        subtitle={settings?.projectsSectionSubtitle}
      />
    ),
    testimonials: (
      <SuccessStories
        key="testimonials"
        testimonials={testimonials.map((testimonial) => ({
          id: testimonial.id,
          name: testimonial.name,
          quote: testimonial.quote,
          program: testimonial.program,
          image: testimonial.image,
        }))}
        badge={settings?.storiesSectionBadge}
        title={settings?.storiesSectionTitle}
        subtitle={settings?.storiesSectionSubtitle}
      />
    ),
    gallery: (
      <GalleryPreview
        key="gallery"
        images={galleryImages.map((image) => ({
          id: image.id,
          url: image.url,
          title: image.title,
          category: image.category,
        }))}
        badge={settings?.gallerySectionBadge}
        title={settings?.gallerySectionTitle}
        subtitle={settings?.gallerySectionSubtitle}
      />
    ),
    video: (
      <VideoSection
        key="video"
        videos={videos.map((v) => ({ id: v.id, title: v.title, youtubeUrl: v.youtubeUrl, description: v.description }))}
        badge={settings?.videoSectionBadge}
        title={settings?.videoSectionTitle}
        subtitle={settings?.videoSectionSubtitle}
      />
    ),
    volunteer: (
      <VolunteerCTA
        key="volunteer"
        badge={settings?.homeVolunteerCtaBadge}
        title={settings?.homeVolunteerCtaTitle}
        subtitle={settings?.homeVolunteerCtaSubtitle}
        benefits={homeVolunteerBenefits?.map((item) => ({
          icon: item.icon,
          title: item.title || "",
          description: item.description,
        }))}
        stats={heroStats}
      />
    ),
    donation: (
      <DonationCTA
        key="donation"
        badge={settings?.homeDonationCtaBadge}
        titleLine1={settings?.homeDonationCtaTitleLine1}
        titleLine2={settings?.homeDonationCtaTitleLine2}
        subtitle={settings?.homeDonationCtaSubtitle}
        trustPoints={homeDonationTrust?.map((item) => item.title || "").filter(Boolean)}
      />
    ),
  };

  const requestedOrder = ((settings as any)?.sectionOrder || "")
    .split(",")
    .map((k: string) => k.trim())
    .filter((k: string) => sections[k]);
  const remaining = DEFAULT_SECTION_ORDER.filter((k) => !requestedOrder.includes(k));
  const order = [...requestedOrder, ...remaining];

  return (
    <>
      <HeroSection
        title={settings?.heroTitle}
        subtitle={settings?.heroSubtitle}
        image={settings?.heroImage}
        announcementText={(settings as any)?.announcementText}
        announcementEnabled={(settings as any)?.announcementEnabled ?? true}
        stats={heroStats}
      />
      {order.map((key) => sections[key])}
    </>
  );
}
