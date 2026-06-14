import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import ImpactStats from "@/components/home/ImpactStats";
import ProgramsSection from "@/components/home/ProgramsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import SuccessStories from "@/components/home/SuccessStories";
import GalleryPreview from "@/components/home/GalleryPreview";
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

export default async function HomePage() {
  const [settings, galleryImages, testimonials, programs, projects] = await Promise.all([
    getSettings(),
    getGalleryImages(),
    getTestimonials(),
    getPrograms(),
    getProjects(),
  ]);

  return (
    <>
      <HeroSection
        title={settings?.heroTitle}
        subtitle={settings?.heroSubtitle}
        image={settings?.heroImage}
      />
      <ImpactStats
        stats={
          settings
            ? [
                { label: settings.stat1Label, value: settings.stat1Value },
                { label: settings.stat2Label, value: settings.stat2Value },
                { label: settings.stat3Label, value: settings.stat3Value },
                { label: settings.stat4Label, value: settings.stat4Value },
              ]
            : undefined
        }
      />
      <ProgramsSection
        programs={programs.map((program) => ({
          id: program.id,
          title: program.title,
          description: program.description,
          icon: program.icon,
          slug: program.slug,
        }))}
      />
      <ProjectsSection projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          status: p.status,
          location: p.location,
          startDate: p.startDate,
          gallery: p.gallery,
        }))} />
      <SuccessStories
        testimonials={testimonials.map((testimonial) => ({
          id: testimonial.id,
          name: testimonial.name,
          quote: testimonial.quote,
          program: testimonial.program,
          image: testimonial.image,
        }))}
      />
      <GalleryPreview
        images={galleryImages.map((image) => ({
          id: image.id,
          url: image.url,
          title: image.title,
          category: image.category,
        }))}
      />
      <VolunteerCTA />
      <DonationCTA />
    </>
  );
}
