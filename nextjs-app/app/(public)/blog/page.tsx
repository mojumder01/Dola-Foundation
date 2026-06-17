import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/shared/BlogCard";

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
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-dark to-primary min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center py-16"
        style={settings?.blogBannerImage ? {
          backgroundImage: `url(${settings.blogBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {settings?.blogBannerImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: (settings as any).blogBannerOverlayColor || "#0F3D8C",
              opacity: ((settings as any).blogBannerOverlayOpacity ?? 80) / 100,
            }}
          />
        )}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Blog
          </span>
          <h1 className="font-poppins font-black text-4xl md:text-5xl text-white mb-5">
            Stories & Insights
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Read about the work we do, the lives we touch, and the lessons we learn along the way.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Blog</span>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">No published posts yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                Blog posts published from the admin panel will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt ?? undefined}
                  coverImage={post.coverImage ?? undefined}
                  category={post.category ?? undefined}
                  author={post.author}
                  publishedAt={post.publishedAt ?? post.createdAt}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
