"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const amounts = [
  { value: 500, label: "৳500", impact: "Feeds a family for a week" },
  { value: 1000, label: "৳1,000", impact: "Provides school supplies for a child" },
  { value: 2500, label: "৳2,500", impact: "Covers one medical consultation" },
  { value: 5000, label: "৳5,000", impact: "Sponsors a child's education for a month" },
];

export default function DonationCTA() {
  const [selectedAmount, setSelectedAmount] = useState(1000);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#0F3D8C] to-[#1a4da0] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full translate-x-48 -translate-y-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 translate-y-32 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#F4B400]/20 border border-[#F4B400]/30 text-[#F4B400] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Support Our Mission
            </span>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-5 leading-tight">
              Your Generosity
              <br />
              <span className="text-[#F4B400]">Changes Lives</span>
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-8">
              Every donation, big or small, makes a real difference in the lives
              of the people we serve. Join thousands of donors who are helping us
              build a better Bangladesh.
            </p>

            <div className="space-y-3">
              {[
                "100% of donations reach those in need",
                "Full transparency with annual reports",
                "Tax deductible contribution",
                "Dedicated project tracking updates",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-white/85 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#F4B400] flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right donation box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="font-poppins font-bold text-xl text-[#1A1A2E] mb-2">
              Make a Donation
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Choose an amount or enter a custom amount
            </p>

            {/* Amount selector */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {amounts.map((amount) => (
                <button
                  key={amount.value}
                  onClick={() => setSelectedAmount(amount.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedAmount === amount.value
                      ? "border-[#0F3D8C] bg-[#0F3D8C]/5"
                      : "border-gray-200 hover:border-[#0F3D8C]/40"
                  }`}
                >
                  <div
                    className={`font-poppins font-bold text-lg ${
                      selectedAmount === amount.value
                        ? "text-[#0F3D8C]"
                        : "text-[#1A1A2E]"
                    }`}
                  >
                    {amount.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {amount.impact}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected impact */}
            {selectedAmount && (
              <div className="bg-[#F4B400]/10 border border-[#F4B400]/20 rounded-xl p-3 mb-5 text-center">
                <span className="text-[#1A1A2E] text-sm">
                  <span className="font-bold text-[#0F3D8C]">
                    {amounts.find((a) => a.value === selectedAmount)?.label}
                  </span>{" "}
                  —{" "}
                  {amounts.find((a) => a.value === selectedAmount)?.impact}
                </span>
              </div>
            )}

            <Link href={`/donate?amount=${selectedAmount}`} className="block">
              <Button variant="default" size="lg" className="w-full">
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Secure payment • 💯 100% goes to programs
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
