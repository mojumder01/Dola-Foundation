"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  image?: string | null;
  announcementText?: string | null;
  announcementEnabled?: boolean | null;
  stats?: { label?: string | null; value?: string | null }[];
  donationsEnabled?: boolean;
}

const DEFAULT_STATS = [
  { value: "5,000+", label: "Lives Impacted" },
  { value: "12", label: "Active Programs" },
  { value: "8", label: "Districts" },
  { value: "500+", label: "Volunteers" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80";

export default function HeroSection({ title, subtitle, image, announcementText, announcementEnabled, stats, donationsEnabled = true }: HeroSectionProps) {
  const displayStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;
  const heading = title || "Empowering Lives, Inspiring Hope";
  const commaIndex = heading.indexOf(",");
  const headingStart =
    commaIndex > -1 ? heading.slice(0, commaIndex + 1) : null;
  const headingEnd =
    commaIndex > -1 ? heading.slice(commaIndex + 1).trim() : heading;

  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Decorative background shapes */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-green/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      <Leaf className="absolute top-28 left-6 w-10 h-10 text-green/20 -rotate-12 hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {announcementEnabled !== false && (announcementText || announcementEnabled === null || announcementEnabled === undefined) && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block bg-gold/15 border border-gold/30 text-gold-600 text-sm font-semibold px-5 py-2 rounded-full mb-6"
              >
                {announcementText || "✨ Empowering Communities Since 2015"}
              </motion.span>
            )}

            <h1 className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl text-dark leading-[1.15] mb-5">
              {headingStart ? (
                <>
                  {headingStart}
                  <br />
                  <span className="text-green">{headingEnd}</span>
                </>
              ) : (
                heading
              )}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              {subtitle ||
                "We work tirelessly to uplift underprivileged communities through education, healthcare, environmental protection, and sustainable development programs across Bangladesh."}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              {donationsEnabled && (
                <Link href="/donate">
                  <Button variant="default" size="lg" className="group">
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Donate Now
                  </Button>
                </Link>
              )}
              <Link href="/volunteer">
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Become A Volunteer
                </Button>
              </Link>
            </div>

            {/* Stat strip */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7 bg-white border border-gray-100 shadow-card rounded-2xl px-6 py-5">
              {displayStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-5">
                  {index > 0 && (
                    <span className="hidden sm:block w-px h-8 bg-gray-100" />
                  )}
                  <div>
                    <div className="font-poppins font-black text-xl md:text-2xl text-primary">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Featured image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-green/15 rounded-[3rem_6rem_3rem_6rem]" />
              <div className="absolute inset-4 rounded-[3rem_6rem_3rem_6rem] overflow-hidden">
                <img
                  src={image || FALLBACK_IMAGE}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-gold/20 rounded-2xl blur-sm"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-green/15 rounded-full blur-md"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Layered carve transition into the next section */}
      <div className="absolute bottom-0 left-0 right-0 leading-[0]">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-[50px] md:h-[90px]"
        >
          <path
            d="M0,40 C360,100 1080,0 1440,55 L1440,120 L0,120 Z"
            className="fill-green/10"
          />
          <path
            d="M0,60 C360,120 1080,25 1440,80 L1440,120 L0,120 Z"
            className="fill-green/25"
          />
          <path
            d="M0,85 C360,135 1080,45 1440,105 L1440,120 L0,120 Z"
            className="fill-primary"
          />
        </svg>
      </div>
    </section>
  );
}
