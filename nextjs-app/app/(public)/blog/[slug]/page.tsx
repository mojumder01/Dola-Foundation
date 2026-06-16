import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const posts: Record<string, any> = {
  "education-transforming-rural-communities": {
    title: "How Education Is Transforming Rural Communities in Sylhet",
    excerpt: "A look inside our learning centers and the incredible stories of children who now have access to quality education for the first time.",
    coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
    category: "Education",
    author: "Dola Foundation",
    publishedAt: new Date("2024-10-15"),
    tags: ["Education", "Rural Development", "Children", "Bangladesh"],
    content: `
      <h2>The Challenge of Rural Education</h2>
      <p>In the remote hills and plains of Sylhet, thousands of children have grown up without access to a school. The nearest government school may be hours away on foot, crossing rivers and rough terrain. For families struggling with daily survival, education can feel like a luxury they cannot afford.</p>

      <p>When Dola Foundation began its Education Program in 2015, we saw this reality firsthand. We visited villages where children spent their days helping with household work or agricultural labor — not because their parents didn't value education, but because there simply was no accessible school.</p>

      <h2>What We Built</h2>
      <p>Our first learning center in Sylhet opened in a repurposed community building — a single room with 30 children, one trained teacher, and a set of donated books. Within a year, we had 100 students and were turning children away for lack of space.</p>

      <p>Today, we operate 15 learning centers across 5 districts, each with trained teachers, proper classrooms, and a comprehensive curriculum. We provide school bags, stationery, and uniforms to every enrolled student — removing the financial barriers that keep children home.</p>

      <h2>Stories of Change</h2>
      <p>Fatima was 9 years old when she enrolled in our Sylhet learning center. Her family had never seen a member attend school. Today, at 15, Fatima is the top student in her government school, where she transitioned after completing our foundational program. Her parents call her their "doctor-in-training."</p>

      <p>Cases like Fatima's remind us why this work matters. Education isn't just about reading and writing — it's about possibility, dignity, and breaking cycles that have trapped families for generations.</p>

      <h2>The Road Ahead</h2>
      <p>We still have much to do. Thousands of children in rural Bangladesh remain out of school. Our goal is to reach 5,000 students by 2026, expanding into 3 new districts and building permanent school structures in communities with the greatest need.</p>

      <p>Every donation to our Education Program directly funds teacher salaries, school supplies, and center operations. You can sponsor a child's education for just ৳1,000 per month. Will you join us?</p>
    `,
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  // DB posts take priority; fall back to the built-in demo post, then a
  // coming-soon placeholder so the page never crashes.
  try {
    const dbPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (dbPost && dbPost.published) {
      return {
        title: dbPost.title,
        excerpt: dbPost.excerpt || "",
        coverImage: dbPost.coverImage,
        category: dbPost.category,
        author: dbPost.author,
        publishedAt: dbPost.publishedAt ?? dbPost.createdAt,
        tags: dbPost.tags,
        content: dbPost.content,
      };
    }
  } catch {
    // DB unreachable — fall through to hardcoded content
  }
  return posts[slug] || null;
}

async function getRelatedPosts(slug: string) {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take: 2,
      select: { title: true, slug: true },
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [dbPost, relatedPosts] = await Promise.all([getPost(slug), getRelatedPosts(slug)]);
  const post = dbPost || {
    title: "Blog Post Not Found",
    excerpt: "",
    coverImage: null,
    category: "General",
    author: "Dola Foundation",
    publishedAt: new Date(),
    tags: [],
    content: "<p>This post is coming soon. Please check back later.</p>",
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-dark py-20 md:py-32 overflow-hidden">
        {post.coverImage && (
          <>
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
          </>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          {post.category && (
            <span className="inline-block bg-gold text-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="font-poppins font-black text-3xl md:text-5xl text-white mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-8 md:p-10">
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-6 bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-dark">Share this article</span>
                  <div className="flex gap-2 ml-auto">
                    <button className="w-9 h-9 bg-[#1877f2] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 bg-[#1da1f2] rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                      <Twitter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-primary rounded-2xl p-6 text-white">
                <h3 className="font-poppins font-bold text-lg mb-2">Support Our Work</h3>
                <p className="text-white/80 text-sm mb-4">
                  Stories like this are made possible by generous donors like you.
                </p>
                <Link
                  href="/donate"
                  className="block w-full bg-gold text-dark font-semibold py-2.5 rounded-xl text-center hover:bg-gold-500 transition-colors text-sm"
                >
                  Donate Now
                </Link>
              </div>

              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-poppins font-bold text-lg text-dark mb-3">
                    Related Articles
                  </h3>
                  <div className="space-y-3">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="block text-sm text-gray-600 hover:text-primary transition-colors border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                      >
                        {related.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
