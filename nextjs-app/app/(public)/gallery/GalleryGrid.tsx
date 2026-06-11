"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
  order: number;
};

const CATEGORIES = ["All", "Education", "Healthcare", "Charity", "Environment", "Youth", "Events"];

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? images : images.filter((img) => img.category === active);

  return (
    <>
      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  active === cat
                    ? "bg-[#0F3D8C] text-white border-[#0F3D8C]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#0F3D8C] hover:text-[#0F3D8C]"
                }`}
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
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">
                {active === "All" ? "No photos yet." : `No photos in "${active}" yet.`}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Photos added from the admin panel will appear here.
              </p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-4"
                >
                  <img
                    src={image.url}
                    alt={image.title || "Gallery image"}
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {(image.title || image.category) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {image.title && (
                        <span className="text-white text-sm font-semibold block">{image.title}</span>
                      )}
                      {image.category && (
                        <span className="bg-[#F4B400] text-[#1A1A2E] text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">
                          {image.category}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
