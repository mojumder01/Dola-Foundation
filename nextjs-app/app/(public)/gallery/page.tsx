import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos from Dola Foundation's programs, projects, and events across Bangladesh.",
};

const categories = ["All", "Education", "Healthcare", "Charity", "Environment", "Youth", "Events"];

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", alt: "Children in classroom", category: "Education", span: "col-span-2" },
  { id: 2, src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", alt: "Medical camp", category: "Healthcare", span: "" },
  { id: 3, src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80", alt: "Community gathering", category: "Events", span: "" },
  { id: 4, src: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&q=80", alt: "Food distribution", category: "Charity", span: "" },
  { id: 5, src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80", alt: "Volunteer activities", category: "Events", span: "" },
  { id: 6, src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80", alt: "Tree planting", category: "Environment", span: "col-span-2" },
  { id: 7, src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", alt: "Youth training", category: "Youth", span: "" },
  { id: 8, src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80", alt: "Children playing", category: "Education", span: "" },
  { id: 9, src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80", alt: "Health checkup", category: "Healthcare", span: "" },
  { id: 10, src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&q=80", alt: "Skills workshop", category: "Youth", span: "" },
  { id: 11, src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", alt: "Relief distribution", category: "Charity", span: "" },
  { id: 12, src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80", alt: "Nature conservation", category: "Environment", span: "" },
];

export default function GalleryPage() {
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

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-30">
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

      {/* Gallery Grid */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-4"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-sm font-semibold">{image.alt}</span>
                  <div className="mt-1">
                    <span className="bg-[#F4B400] text-[#1A1A2E] text-xs font-semibold px-2 py-0.5 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
