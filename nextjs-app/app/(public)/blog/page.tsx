import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/shared/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest news, stories, and insights from Dola Foundation.",
};

const posts = [
  {
    id: "1",
    title: "How Education Is Transforming Rural Communities in Sylhet",
    slug: "education-transforming-rural-communities",
    excerpt: "A look inside our learning centers and the incredible stories of children who now have access to quality education for the first time.",
    coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    category: "Education",
    author: "Dola Foundation",
    publishedAt: new Date("2024-10-15"),
  },
  {
    id: "2",
    title: "Our Mobile Health Clinics: Bringing Medicine to the Unreachable",
    slug: "mobile-health-clinics-unreachable-communities",
    excerpt: "How our four mobile health units are serving 8,000+ patients annually in areas where healthcare has never been accessible before.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    category: "Healthcare",
    author: "Dr. Karim Uddin",
    publishedAt: new Date("2024-09-20"),
  },
  {
    id: "3",
    title: "50,000 Trees and Counting: Our Journey Towards a Greener Bangladesh",
    slug: "50000-trees-greener-bangladesh",
    excerpt: "Reflecting on our tree planting journey and the communities who are now stewards of these young forests.",
    coverImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
    category: "Environment",
    author: "Dola Foundation",
    publishedAt: new Date("2024-08-05"),
  },
  {
    id: "4",
    title: "Sumaiya's Story: From Beneficiary to Business Owner",
    slug: "sumaiya-story-business-owner",
    excerpt: "How our Youth Skills Training program helped one young woman start her own tailoring business and transform her family's life.",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    category: "Youth Development",
    author: "Nasrin Akter",
    publishedAt: new Date("2024-07-12"),
  },
  {
    id: "5",
    title: "Flood Relief 2024: How We Responded in 48 Hours",
    slug: "flood-relief-2024-response",
    excerpt: "When floods devastated Sylhet and Sunamganj in August 2024, our team was on the ground within 48 hours with relief for 3,000 families.",
    coverImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    category: "Charity & Relief",
    author: "Dola Foundation",
    publishedAt: new Date("2024-08-25"),
  },
  {
    id: "6",
    title: "Annual Report 2023: A Year of Growth and Impact",
    slug: "annual-report-2023",
    excerpt: "Our annual report highlights the achievements, challenges, and learnings from 2023 — our most impactful year yet.",
    coverImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
    category: "Reports",
    author: "Dola Foundation",
    publishedAt: new Date("2024-03-01"),
  },
];

const categories = ["All", "Education", "Healthcare", "Environment", "Youth Development", "Charity & Relief", "Reports"];

export default function BlogPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A1A2E] to-[#0F3D8C] py-20 md:py-28">
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

      {/* Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all bg-gray-100 text-gray-600 hover:bg-[#0F3D8C] hover:text-white first:bg-[#0F3D8C] first:text-white"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                category={post.category}
                author={post.author}
                publishedAt={post.publishedAt}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
