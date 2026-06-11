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

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark to-primary py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
