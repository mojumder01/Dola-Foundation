"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "ONGOING" | "COMPLETED" | "UPCOMING";
  location?: string | null;
  startDate?: Date | null;
  gallery?: string[];
  index?: number;
}

const statusConfig = {
  ONGOING: { label: "Ongoing", variant: "ongoing" as const },
  COMPLETED: { label: "Completed", variant: "completed" as const },
  UPCOMING: { label: "Upcoming", variant: "upcoming" as const },
};

export default function ProjectCard({
  title,
  slug,
  description,
  status,
  location,
  startDate,
  gallery = [],
  index = 0,
}: ProjectCardProps) {
  const { label, variant } = statusConfig[status];
  const coverImage = gallery[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary/10 to-green/10 overflow-hidden">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏗️</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={variant}>{label}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-poppins font-bold text-lg text-dark mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          )}
          {startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateShort(startDate)}
            </span>
          )}
        </div>

        <Link
          href={`/projects/${slug}`}
          className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all group-hover:text-gold"
        >
          View Details
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
