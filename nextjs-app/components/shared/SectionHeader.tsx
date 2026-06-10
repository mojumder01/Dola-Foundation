"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        centered && "text-center",
        "max-w-3xl",
        centered && "mx-auto",
        className
      )}
    >
      {badge && (
        <span className="inline-block bg-[#F4B400]/15 text-[#F4B400] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-poppins font-bold text-3xl md:text-4xl leading-tight",
          light ? "text-white" : "text-[#1A1A2E]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            light ? "text-white/80" : "text-gray-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
