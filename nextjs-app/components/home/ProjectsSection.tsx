"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import ProjectCard from "@/components/shared/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredProjects = [
  {
    id: "1",
    title: "School Construction in Sylhet",
    slug: "school-construction-sylhet",
    description:
      "Building a fully equipped primary school for 500+ children in a remote area of Sylhet, providing quality education infrastructure.",
    status: "ONGOING" as const,
    location: "Sylhet, Bangladesh",
    startDate: new Date("2024-01-01"),
    gallery: [],
  },
  {
    id: "2",
    title: "Mobile Health Clinic Program",
    slug: "mobile-health-clinic",
    description:
      "A fleet of mobile health units bringing medical care directly to remote villages without access to healthcare facilities.",
    status: "ONGOING" as const,
    location: "Multiple Districts",
    startDate: new Date("2023-06-01"),
    gallery: [],
  },
  {
    id: "3",
    title: "Clean Water Wells Initiative",
    slug: "clean-water-wells",
    description:
      "Installing 50 deep tube wells across drought-prone areas to provide clean drinking water to 10,000+ people.",
    status: "COMPLETED" as const,
    location: "Rajshahi Division",
    startDate: new Date("2023-01-01"),
    gallery: [],
  },
];

interface ProjectsSectionProps {
  projects?: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    status: "ONGOING" | "COMPLETED" | "UPCOMING";
    location: string | null;
    startDate: Date | null;
    gallery: string[];
  }>;
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const displayProjects = projects && projects.length > 0 ? projects : featuredProjects;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Work"
          title="Featured Projects"
          subtitle="Discover some of our impactful projects transforming lives and communities across Bangladesh."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              {...project}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link href="/projects">
            <Button variant="primary" size="lg">
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
