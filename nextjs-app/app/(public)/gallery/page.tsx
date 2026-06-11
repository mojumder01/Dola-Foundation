import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos from Dola Foundation's programs, projects, and events across Bangladesh.",
};

async function getImages() {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getImages();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F3D8C] to-[#1F9D55] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Gallery
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            Our Gallery
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Glimpses of our work and impact — moments that capture the spirit of change.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Gallery</span>
          </div>
        </div>
      </section>

      <GalleryGrid images={images} />
    </div>
  );
}
