import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const revalidate = 0;

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

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([getImages(), getSettings()]);
  const headingFont = (settings as any)?.bannerHeadingFont === "inter" ? "font-inter" : "font-poppins";
  const bannerTextColor = (settings as any)?.galleryBannerTextColor || "#FFFFFF";
  const bannerBadge = (settings as any)?.galleryBannerBadge || "Gallery";
  const bannerTitle = (settings as any)?.galleryBannerTitle || "Our Gallery";
  const bannerSubtitle =
    (settings as any)?.galleryBannerSubtitle ||
    "Glimpses of our work and impact — moments that capture the spirit of change.";

  return (
    <div className="pt-20">
      {/* Hero */}
      {settings?.galleryBannerImage ? (
        <section className="relative bg-gradient-to-br from-primary to-green min-h-[180px] md:min-h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.galleryBannerImage} alt="" className="w-full h-auto block" />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: (settings as any).galleryBannerOverlayColor || "#0F3D8C",
              opacity: ((settings as any).galleryBannerOverlayOpacity ?? 80) / 100,
            }}
          />
          <div className="absolute inset-0 flex items-center py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ color: bannerTextColor }}>
            {bannerBadge}
          </span>
          <h1 className={`${headingFont} font-black text-4xl md:text-5xl mb-5`} style={{ color: bannerTextColor }}>
            {bannerTitle}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: bannerTextColor, opacity: 0.8 }}>
            {bannerSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm" style={{ color: bannerTextColor, opacity: 0.6 }}>
            <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span>/</span>
            <span style={{ opacity: 1 }}>Gallery</span>
          </div>
        </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-primary to-green min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ color: bannerTextColor }}>
            {bannerBadge}
          </span>
          <h1 className={`${headingFont} font-black text-4xl md:text-5xl mb-5`} style={{ color: bannerTextColor }}>
            {bannerTitle}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: bannerTextColor, opacity: 0.8 }}>
            {bannerSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm" style={{ color: bannerTextColor, opacity: 0.6 }}>
            <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span>/</span>
            <span style={{ opacity: 1 }}>Gallery</span>
          </div>
        </div>
        </section>
      )}

      <GalleryGrid images={images} />
    </div>
  );
}
