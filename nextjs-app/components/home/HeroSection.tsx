"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D8C] via-[#0d3578] to-[#1F9D55]" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="hero-particles" />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#F4B400]/10 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-[#F4B400]/20 border border-[#F4B400]/30 text-[#F4B400] text-sm font-semibold px-6 py-2 rounded-full mb-8"
          >
            ✨ Empowering Communities Since 2015
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-poppins font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6"
          >
            Empowering Lives,
            <br />
            <span className="text-[#F4B400]">Inspiring Hope</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            We work tirelessly to uplift underprivileged communities through
            education, healthcare, environmental protection, and sustainable
            development programs across Bangladesh.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/donate">
              <Button variant="default" size="xl" className="group">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Donate Now
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button variant="outline-white" size="xl">
                <Users className="w-5 h-5 mr-2" />
                Become A Volunteer
              </Button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="inline-flex flex-wrap items-center justify-center gap-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5"
          >
            {[
              { value: "5,000+", label: "Lives Impacted" },
              { value: "12", label: "Active Programs" },
              { value: "8", label: "Districts" },
              { value: "500+", label: "Volunteers" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-poppins font-black text-2xl text-[#F4B400]">
                  {stat.value}
                </div>
                <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1"
      >
        <span className="text-xs font-medium">Scroll Down</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
