"use client";

import { motion } from "framer-motion";
import { Users, Heart, MapPin, HeartHandshake } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

const defaultStats = [
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "Lives Impacted",
    description: "People whose lives we've touched",
    color: "text-gold",
    bgColor: "bg-gold/20",
  },
  {
    icon: Heart,
    value: 12,
    suffix: "",
    label: "Active Programs",
    description: "Ongoing development programs",
    color: "text-green",
    bgColor: "bg-green/20",
  },
  {
    icon: MapPin,
    value: 8,
    suffix: "",
    label: "Districts Reached",
    description: "Across Bangladesh",
    color: "text-blue-300",
    bgColor: "bg-blue-300/20",
  },
  {
    icon: HeartHandshake,
    value: 500,
    suffix: "+",
    label: "Volunteers",
    description: "Dedicated change-makers",
    color: "text-pink-300",
    bgColor: "bg-pink-300/20",
  },
];

interface ImpactStatsProps {
  stats?: { label?: string | null; value?: string | null }[];
}

export default function ImpactStats({ stats: statsProp }: ImpactStatsProps) {
  const stats = defaultStats.map((defaultStat, index) => {
    const override = statsProp?.[index];
    if (!override) return defaultStat;
    const parsedValue = parseInt(
      (override.value || "").replace(/[^0-9]/g, ""),
      10
    );
    return {
      ...defaultStat,
      label: override.label || defaultStat.label,
      value: Number.isNaN(parsedValue) ? defaultStat.value : parsedValue,
      suffix:
        override.value && !Number.isNaN(parsedValue)
          ? override.value.trim().endsWith("+")
            ? "+"
            : ""
          : defaultStat.suffix,
    };
  });

  return (
    <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Our Impact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-poppins font-bold text-3xl md:text-4xl text-white"
          >
            Creating Real Change
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div
                    className={`font-poppins font-black text-4xl md:text-5xl ${stat.color} mb-2`}
                  >
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      delay={index * 200}
                    />
                  </div>
                  <div className="font-semibold text-white mb-1 text-base">
                    {stat.label}
                  </div>
                  <div className="text-white/60 text-xs">{stat.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
