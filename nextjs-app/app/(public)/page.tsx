import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ImpactStats from "@/components/home/ImpactStats";
import ProgramsSection from "@/components/home/ProgramsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import SuccessStories from "@/components/home/SuccessStories";
import GalleryPreview from "@/components/home/GalleryPreview";
import VolunteerCTA from "@/components/home/VolunteerCTA";
import DonationCTA from "@/components/home/DonationCTA";

export const metadata: Metadata = {
  title: "Dola Foundation | Empowering Lives, Inspiring Hope",
  description:
    "Dola Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and sustainable development programs across Bangladesh.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactStats />
      <ProgramsSection />
      <ProjectsSection />
      <SuccessStories />
      <GalleryPreview />
      <VolunteerCTA />
      <DonationCTA />
    </>
  );
}
