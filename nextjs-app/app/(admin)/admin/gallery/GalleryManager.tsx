"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { addGalleryImage, deleteGalleryImage } from "@/actions/admin/gallery";

type GalleryImage = {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
  order: number;
};

const CATEGORIES = [
  "All",
  "Education",
  "Healthcare",
  "Charity",
  "Environment",
  "Youth",
  "Events",
];

export default function GalleryManager({
  images,
}: {
  images: GalleryImage[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  function handleDelete(image: GalleryImage) {
    if (
      !confirm(
        `Are you sure you want to delete "${image.title || "this image"}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteGalleryImage(image.id);
      if (!result.success) {
        alert("Failed to delete image. Check if the database is connected.");
        return;
      }
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const url = fd.get("url") as string;
    const title = fd.get("title") as string;
    const category = fd.get("category") as string;
    setFormError(null);
    startTransition(async () => {
      const result = await addGalleryImage({
        url,
        title: title || undefined,
        category: category || undefined,
      });
      if (!result.success) {
        setFormError((result as any).error || "Failed to save. Is the database connected?");
        return;
      }
      router.refresh();
      setShowModal(false);
      form.reset();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">
            Gallery
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage photo gallery ({images.length} images)
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Upload card */}
        <button
          onClick={() => setShowModal(true)}
          className="relative aspect-square bg-[#F8FAFC] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-blue-50/50 transition-all group"
        >
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
          <span className="text-xs text-gray-400 group-hover:text-primary mt-1 transition-colors">
            Add Image
          </span>
        </button>

        {filteredImages.length === 0 && selectedCategory !== "All" ? (
          <div className="col-span-5 py-10 text-center text-gray-400">
            No images in this category yet.
          </div>
        ) : (
          filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square group overflow-hidden rounded-2xl"
            >
              <img
                src={image.url}
                alt={image.title || "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDelete(image)}
                  disabled={isPending}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
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
          ))
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {formError}
              </div>
            )}
            <div>
              <Label htmlFor="url">Image URL *</Label>
              <Input
                id="url"
                name="url"
                required
                type="url"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Image title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No category</option>
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Image"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
