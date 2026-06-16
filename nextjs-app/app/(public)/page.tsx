import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getLocale, pickLocale } from "@/lib/locale";
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
    locale,
    settings,
    galleryImages,
    testimonials,
    programs,
    projects,
    videos,
    homeVolunteerBenefits,
    homeDonationTrust,
  ] = await Promise.all([
    getLocale(),
    getSettings(),
    getGalleryImages(),
    getTestimonials(),
    getPrograms(),
    getProjects(),
    getVideos(),
    getDBItems("home-volunteer-benefits"),
    getDBItems("home-donation-trust"),
  ]);

  const t = (en?: string | null, bn?: string | null) => pickLocale(en, bn, locale);

  const heroStats = settings
    ? [
        { label: t(settings.stat1Label, settings.stat1LabelBn), value: settings.stat1Value },
        { label: t(settings.stat2Label, settings.stat2LabelBn), value: settings.stat2Value },
        { label: t(settings.stat3Label, settings.stat3LabelBn), value: settings.stat3Value },
        { label: t(settings.stat4Label, settings.stat4LabelBn), value: settings.stat4Value },
      ]
    : undefined;

  const sections: Record<string, React.ReactNode> = {
    stats: (
      <ImpactStats
        key="stats"
        stats={heroStats}
        badge={t(settings?.homeStatsBadge, settings?.homeStatsBadgeBn)}
        title={t(settings?.homeStatsTitle, settings?.homeStatsTitleBn)}
      />
    ),
    programs: (
      <ProgramsSection
        key="programs"
        programs={programs.map((program) => ({
          id: program.id,
          title: t(program.title, program.titleBn),
          description: t(program.description, program.descriptionBn),
          icon: program.icon,
          slug: program.slug,
        }))}
        badge={t(settings?.programsSectionBadge, settings?.programsSectionBadgeBn)}
        title={t(settings?.programsSectionTitle, settings?.programsSectionTitleBn)}
        subtitle={t(settings?.programsSectionSubtitle, settings?.programsSectionSubtitleBn)}
      />
    ),
    projects: (
      <ProjectsSection
        key="projects"
        projects={projects.map((p) => ({
          id: p.id,
          title: t(p.title, p.titleBn),
          slug: p.slug,
          description: t(p.description, p.descriptionBn),
          status: p.status,
          location: p.location,
          startDate: p.startDate,
          gallery: p.gallery,
        }))}
        badge={t(settings?.projectsSectionBadge, settings?.projectsSectionBadgeBn)}
        title={t(settings?.projectsSectionTitle, settings?.projectsSectionTitleBn)}
        subtitle={t(settings?.projectsSectionSubtitle, settings?.projectsSectionSubtitleBn)}
      />
    ),
    testimonials: (
      <SuccessStories
        key="testimonials"
        testimonials={testimonials.map((testimonial) => ({
          id: testimonial.id,
          name: t(testimonial.name, testimonial.nameBn),
          quote: t(testimonial.quote, testimonial.quoteBn),
          program: t(testimonial.program, testimonial.programBn),
          image: testimonial.image,
        }))}
        badge={t(settings?.storiesSectionBadge, settings?.storiesSectionBadgeBn)}
        title={t(settings?.storiesSectionTitle, settings?.storiesSectionTitleBn)}
        subtitle={t(settings?.storiesSectionSubtitle, settings?.storiesSectionSubtitleBn)}
      />
    ),
    gallery: (
      <GalleryPreview
        key="gallery"
        images={galleryImages.map((image) => ({
          id: image.id,
          url: image.url,
          title: t(image.title, image.titleBn),
          category: image.category,
        }))}
        badge={t(settings?.gallerySectionBadge, settings?.gallerySectionBadgeBn)}
        title={t(settings?.gallerySectionTitle, settings?.gallerySectionTitleBn)}
        subtitle={t(settings?.gallerySectionSubtitle, settings?.gallerySectionSubtitleBn)}
      />
    ),
    video: (
      <VideoSection
        key="video"
        videos={videos.map((v) => ({
          id: v.id,
          title: t(v.title, v.titleBn),
          youtubeUrl: v.youtubeUrl,
          description: t(v.description, v.descriptionBn),
        }))}
        badge={t(settings?.videoSectionBadge, settings?.videoSectionBadgeBn)}
        title={t(settings?.videoSectionTitle, settings?.videoSectionTitleBn)}
        subtitle={t(settings?.videoSectionSubtitle, settings?.videoSectionSubtitleBn)}
      />
    ),
    volunteer: (
      <VolunteerCTA
        key="volunteer"
        badge={t(settings?.homeVolunteerCtaBadge, settings?.homeVolunteerCtaBadgeBn)}
        title={t(settings?.homeVolunteerCtaTitle, settings?.homeVolunteerCtaTitleBn)}
        subtitle={t(settings?.homeVolunteerCtaSubtitle, settings?.homeVolunteerCtaSubtitleBn)}
        benefits={homeVolunteerBenefits?.map((item) => ({
          icon: item.icon,
          title: t(item.title, item.titleBn) || "",
          description: t(item.description, item.descriptionBn),
        }))}
        stats={heroStats}
      />
    ),
    donation: (
      <DonationCTA
        key="donation"
        badge={t(settings?.homeDonationCtaBadge, settings?.homeDonationCtaBadgeBn)}
        titleLine1={t(settings?.homeDonationCtaTitleLine1, settings?.homeDonationCtaTitleLine1Bn)}
        titleLine2={t(settings?.homeDonationCtaTitleLine2, settings?.homeDonationCtaTitleLine2Bn)}
        subtitle={t(settings?.homeDonationCtaSubtitle, settings?.homeDonationCtaSubtitleBn)}
        trustPoints={homeDonationTrust?.map((item) => t(item.title, item.titleBn)).filter(Boolean)}
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
        title={t(settings?.heroTitle, settings?.heroTitleBn)}
        subtitle={t(settings?.heroSubtitle, settings?.heroSubtitleBn)}
        image={settings?.heroImage}
        announcementText={t((settings as any)?.announcementText, (settings as any)?.announcementTextBn)}
        announcementEnabled={(settings as any)?.announcementEnabled ?? true}
        stats={heroStats}
      />
      {order.map((key) => sections[key])}
    </>
  );
}
