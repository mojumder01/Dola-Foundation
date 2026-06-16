"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const avatarColors = ["bg-primary", "bg-green", "bg-gold"];

const fallbackTestimonials = [
  {
    id: 1,
    name: "Fatima Begum",
    quote:
      "Thanks to Dola Foundation's education program, my daughter is now attending school for the first time. I never thought this day would come. They gave my family hope when we had none.",
    program: "Education Program",
    location: "Sylhet",
    initial: "F",
    color: "bg-primary",
  },
  {
    id: 2,
    name: "Mohammad Rahim",
    quote:
      "The mobile health clinic saved my son's life. We live 30 km from the nearest hospital. Dola Foundation's doctors came to our village and treated him. I am forever grateful.",
    program: "Healthcare Program",
    location: "Rangpur",
    initial: "M",
    color: "bg-green",
  },
  {
    id: 3,
    name: "Sumaiya Khanam",
    quote:
      "The youth skills training program helped me start my own tailoring business. I now earn enough to support my family and even employ two other women from my village.",
    program: "Youth Development",
    location: "Khulna",
    initial: "S",
    color: "bg-gold",
  },
];

interface SuccessStoriesProps {
  testimonials?: {
    id: string;
    name: string;
    quote: string;
    program?: string | null;
    image?: string | null;
  }[];
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

export default function SuccessStories({
  testimonials: testimonialsProp,
  badge,
  title,
  subtitle,
}: SuccessStoriesProps) {
  const testimonials =
    testimonialsProp && testimonialsProp.length > 0
      ? testimonialsProp.map((testimonial, index) => ({
          id: testimonial.id,
          name: testimonial.name,
          quote: testimonial.quote,
          program: testimonial.program || "Dola Foundation",
          location: null as string | null,
          image: testimonial.image || null,
          initial: testimonial.name.charAt(0).toUpperCase(),
          color: avatarColors[index % avatarColors.length],
        }))
      : fallbackTestimonials.map((testimonial) => ({
          ...testimonial,
          id: String(testimonial.id),
          location: testimonial.location as string | null,
          image: null as string | null,
        }));

  return (
    <section className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green/5 rounded-full translate-x-48 translate-y-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge={badge || "Success Stories"}
          title={title || "Lives We've Changed"}
          subtitle={
            subtitle ||
            "Read the stories of real people whose lives have been transformed through our programs and your generous support."
          }
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-primary/10">
                <Quote className="w-12 h-12" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-gold text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Person */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {testimonial.initial}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-dark text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.program}
                    {testimonial.location ? ` • ${testimonial.location}` : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
