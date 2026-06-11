"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  title: string;
  description: string;
  icon: string;
  slug: string;
  gradient: string;
  index?: number;
}

export default function ProgramCard({
  title,
  description,
  icon,
  slug,
  gradient,
  index = 0,
}: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      <div className={cn("h-2 bg-gradient-to-r", gradient)} />
      <div className="p-6">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br",
            gradient,
            "bg-opacity-10"
          )}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="font-poppins font-bold text-lg text-dark mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {description}
        </p>
        <Link
          href={`/programs/${slug}`}
          className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all group-hover:text-gold"
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
