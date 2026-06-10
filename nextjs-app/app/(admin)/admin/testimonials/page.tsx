import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage success stories</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No testimonials added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-card p-5 group">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#F4B400] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-4 line-clamp-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1A1A2E] text-sm">{t.name}</p>
                  {t.program && <p className="text-xs text-gray-400">{t.program}</p>}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
