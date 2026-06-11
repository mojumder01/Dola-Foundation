"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import ProgramCard from "@/components/shared/ProgramCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const gradients = [
  "from-blue-500 to-blue-700",
  "from-green-500 to-green-700",
  "from-yellow-500 to-orange-600",
  "from-emerald-500 to-teal-700",
  "from-purple-500 to-purple-700",
  "from-pink-500 to-rose-600",
];

const fallbackPrograms = [
  {
    id: "1",
    title: "Education",
    description:
      "Providing quality education and learning opportunities to underprivileged children and youth across rural Bangladesh.",
    icon: "📚",
    slug: "education",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: "2",
    title: "Healthcare",
    description:
      "Delivering essential healthcare services, health camps, and awareness programs to underserved communities.",
    icon: "🏥",
    slug: "healthcare",
    gradient: "from-green-500 to-green-700",
  },
  {
    id: "3",
    title: "Charity & Relief",
    description:
      "Providing immediate relief, food support, and essential supplies to families affected by poverty and disasters.",
    icon: "🤝",
    slug: "charity-relief",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    id: "4",
    title: "Environment",
    description:
      "Protecting our environment through tree planting, clean water initiatives, and climate action programs.",
    icon: "🌿",
    slug: "environment",
    gradient: "from-emerald-500 to-teal-700",
  },
  {
    id: "5",
    title: "Youth Development",
    description:
      "Empowering young people through skills training, vocational education, mentorship, and leadership programs.",
    icon: "🌟",
    slug: "youth-development",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    id: "6",
    title: "Orphan Care",
    description:
      "Providing loving care, education, nutrition, and life opportunities to orphaned and vulnerable children.",
    icon: "❤️",
    slug: "orphan-care",
    gradient: "from-pink-500 to-rose-600",
  },
];

interface ProgramsSectionProps {
  programs?: {
    id: string;
    title: string;
    description: string;
    icon?: string | null;
    slug: string;
  }[];
}

export default function ProgramsSection({
  programs: programsProp,
}: ProgramsSectionProps) {
  const programs =
    programsProp && programsProp.length > 0
      ? programsProp.map((program, index) => ({
          id: program.id,
          title: program.title,
          description: program.description,
          icon: program.icon || "❤️",
          slug: program.slug,
          gradient: gradients[index % gradients.length],
        }))
      : fallbackPrograms;

  return (
    <section className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="What We Do"
          title="Our Programs"
          subtitle="We run six comprehensive programs designed to address the most critical needs of vulnerable communities in Bangladesh."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <ProgramCard
              key={program.id}
              title={program.title}
              description={program.description}
              icon={program.icon}
              slug={program.slug}
              gradient={program.gradient}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link href="/programs">
            <Button variant="primary" size="lg">
              View All Programs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
