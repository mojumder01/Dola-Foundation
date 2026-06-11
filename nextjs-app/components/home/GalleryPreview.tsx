"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";

const fallbackImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
    alt: "Children in education program",
    category: "Education",
    span: "col-span-1 row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    alt: "Healthcare camp",
    category: "Healthcare",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80",
    alt: "Community development",
    category: "Community",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80",
    alt: "Food distribution",
    category: "Charity",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80",
    alt: "Volunteer activities",
    category: "Volunteer",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80",
    alt: "Youth programs",
    category: "Youth",
    span: "col-span-1 row-span-1",
  },
];

interface GalleryPreviewProps {
  images?: {
    id: string;
    url: string;
    title?: string | null;
    category?: string | null;
  }[];
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const galleryImages =
    images && images.length > 0
      ? images.map((image) => ({
          id: image.id,
          src: image.url,
          alt: image.title || "Gallery image",
          category: image.category || "",
        }))
      : fallbackImages;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <SectionHeader
            badge="Gallery"
            title="Our Gallery"
            subtitle="Glimpses of our work and impact across communities."
            centered={false}
          />
          <Link href="/gallery">
            <Button variant="primary" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              View Full Gallery
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                index === 0 ? "row-span-2" : ""
              }`}
              style={{ aspectRatio: index === 0 ? "1/2" : "4/3" }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                style={{ height: "100%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-sm font-semibold">
                  {image.alt}
                </span>
                <div className="text-[#F4B400] text-xs mt-0.5">
                  {image.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
