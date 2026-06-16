import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";
import { getLocale, pickLocale } from "@/lib/locale";

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
  const [locale, images, settings] = await Promise.all([getLocale(), getImages(), getSettings()]);
  const t = (en?: string | null, bn?: string | null) => pickLocale(en, bn, locale);

  const localizedImages = images.map((image) => ({
    ...image,
    title: t(image.title, image.titleBn) || null,
  }));

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-primary to-green py-20 md:py-28"
        style={settings?.galleryBannerImage ? {
          backgroundImage: `url(${settings.galleryBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {settings?.galleryBannerImage && <div className="absolute inset-0 bg-primary/70" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {locale === "bn" ? "গ্যালারি" : "Gallery"}
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            {locale === "bn" ? "আমাদের গ্যালারি" : "Our Gallery"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {locale === "bn"
              ? "আমাদের কাজ ও প্রভাবের কিছু মুহূর্ত — যা পরিবর্তনের চেতনাকে ধারণ করে।"
              : "Glimpses of our work and impact — moments that capture the spirit of change."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">{locale === "bn" ? "হোম" : "Home"}</Link>
            <span>/</span>
            <span className="text-white">{locale === "bn" ? "গ্যালারি" : "Gallery"}</span>
          </div>
        </div>
      </section>

      <GalleryGrid images={localizedImages} locale={locale} />
    </div>
  );
}
