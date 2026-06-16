import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/shared/BlogCard";
import { getLocale, pickLocale } from "@/lib/locale";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest news, stories, and insights from Dola Foundation.",
};

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
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

export default async function BlogPage() {
  const [locale, posts, settings] = await Promise.all([getLocale(), getPosts(), getSettings()]);
  const t = (en?: string | null, bn?: string | null) => pickLocale(en, bn, locale);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-dark to-primary py-20 md:py-28"
        style={settings?.blogBannerImage ? {
          backgroundImage: `url(${settings.blogBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {settings?.blogBannerImage && <div className="absolute inset-0 bg-primary/70" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {locale === "bn" ? "ব্লগ" : "Blog"}
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            {locale === "bn" ? "গল্প ও অন্তর্দৃষ্টি" : "Stories & Insights"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {locale === "bn"
              ? "আমাদের কাজ, আমরা যাদের জীবন স্পর্শ করি, এবং যাত্রার পথে আমরা যা শিখি তার গল্প পড়ুন।"
              : "Read about the work we do, the lives we touch, and the lessons we learn along the way."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">{locale === "bn" ? "হোম" : "Home"}</Link>
            <span>/</span>
            <span className="text-white">{locale === "bn" ? "ব্লগ" : "Blog"}</span>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">
                {locale === "bn" ? "এখনও কোনো প্রকাশিত পোস্ট নেই।" : "No published posts yet."}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {locale === "bn"
                  ? "অ্যাডমিন প্যানেল থেকে প্রকাশিত ব্লগ পোস্ট এখানে দেখা যাবে।"
                  : "Blog posts published from the admin panel will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  title={t(post.title, post.titleBn)}
                  slug={post.slug}
                  excerpt={t(post.excerpt, post.excerptBn) || undefined}
                  coverImage={post.coverImage ?? undefined}
                  category={t(post.category, post.categoryBn) || undefined}
                  author={t(post.author, post.authorBn)}
                  publishedAt={post.publishedAt ?? post.createdAt}
                  index={index}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
