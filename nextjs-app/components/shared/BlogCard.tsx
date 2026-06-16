"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { formatDateShort, truncate } from "@/lib/utils";
import type { Locale } from "@/lib/locale";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: string | null;
  author?: string;
  publishedAt?: Date | null;
  index?: number;
  locale?: Locale;
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  author = "Dola Foundation",
  publishedAt,
  index = 0,
  locale = "en",
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative h-52 bg-gradient-to-br from-primary/10 to-green/10 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl">📰</div>
          </div>
        )}
        {category && (
          <div className="absolute top-3 left-3 bg-gold text-dark text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateShort(publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {author}
          </span>
        </div>

        <h3 className="font-poppins font-bold text-lg text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {excerpt}
          </p>
        )}

        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all group-hover:text-gold"
        >
          {locale === "bn" ? "আরও পড়ুন" : "Read More"}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
