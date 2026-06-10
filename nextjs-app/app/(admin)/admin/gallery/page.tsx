import { prisma } from "@/lib/prisma";
import { Images, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

const demoImages = [
  { id: "1", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80", title: "Education Program", category: "Education", order: 1 },
  { id: "2", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80", title: "Healthcare Camp", category: "Healthcare", order: 2 },
  { id: "3", url: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400&q=80", title: "Food Distribution", category: "Charity", order: 3 },
  { id: "4", url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&q=80", title: "Tree Planting", category: "Environment", order: 4 },
  { id: "5", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80", title: "Youth Training", category: "Youth", order: 5 },
  { id: "6", url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80", title: "Orphan Care", category: "Care", order: 6 },
];

export default async function AdminGalleryPage() {
  let images = await getImages();
  if (images.length === 0) images = demoImages as any;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage photo gallery ({images.length} images)</p>
        </div>
        <Button variant="primary" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Education", "Healthcare", "Charity", "Environment", "Youth", "Events"].map((cat) => (
          <button
            key={cat}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-[#0F3D8C] hover:text-[#0F3D8C] transition-colors first:bg-[#0F3D8C] first:text-white first:border-[#0F3D8C]"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Upload card */}
        <div className="relative aspect-square bg-[#F8FAFC] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0F3D8C] hover:bg-blue-50/50 transition-all group">
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#0F3D8C] transition-colors" />
          <span className="text-xs text-gray-400 group-hover:text-[#0F3D8C] mt-1 transition-colors">Upload</span>
        </div>

        {images.map((image: any) => (
          <div key={image.id} className="relative aspect-square group overflow-hidden rounded-2xl">
            <img
              src={image.url}
              alt={image.title || "Gallery image"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {image.category && (
              <div className="absolute bottom-2 left-2 right-2">
                <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
                  {image.category}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
