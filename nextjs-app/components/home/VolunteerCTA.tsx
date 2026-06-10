"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, CheckCircle, ArrowRight, Heart, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Heart,
    title: "Make Real Impact",
    description: "Directly contribute to programs that change lives in your community.",
  },
  {
    icon: Globe,
    title: "Build Skills",
    description: "Gain valuable experience, leadership skills, and professional development.",
  },
  {
    icon: BookOpen,
    title: "Learn & Grow",
    description: "Access training programs, workshops, and networking opportunities.",
  },
];

export default function VolunteerCTA() {
  return (
    <section className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F9D55] to-[#0F3D8C] rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side */}
            <div className="p-10 md:p-14">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                  Join Us
                </span>
                <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
                  Join Our Mission to Change Lives
                </h2>
                <p className="text-white/80 text-base leading-relaxed mb-8">
                  Become a volunteer and make a tangible difference in the lives
                  of those who need it most. Your time and skills are invaluable.
                </p>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {benefit.title}
                          </div>
                          <div className="text-white/70 text-xs mt-0.5">
                            {benefit.description}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <Link href="/volunteer">
                  <Button variant="default" size="lg">
                    <Users className="w-5 h-5 mr-2" />
                    Apply to Volunteer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right side - decorative */}
            <div className="relative hidden md:flex items-center justify-center p-10 bg-white/10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "500+", label: "Active Volunteers", icon: "👥" },
                    { value: "8", label: "Districts", icon: "📍" },
                    { value: "12", label: "Programs", icon: "🎯" },
                    { value: "5000+", label: "Lives Impacted", icon: "❤️" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white/20 backdrop-blur rounded-2xl p-5 text-center border border-white/30"
                    >
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="font-poppins font-black text-2xl text-white">
                        {stat.value}
                      </div>
                      <div className="text-white/70 text-xs mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
