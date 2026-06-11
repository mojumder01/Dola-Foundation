"use client";

import { useState, useTransition, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/actions/admin/testimonials";

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  program: string | null;
  image: string | null;
  active: boolean;
};

export default function TestimonialsManager({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const activeRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditingItem(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(item: Testimonial) {
    setEditingItem(item);
    setFormError(null);
    setShowModal(true);
  }

  function handleDelete(item: Testimonial) {
    if (
      !confirm(
        `Are you sure you want to delete testimonial from "${item.name}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteTestimonial(item.id);
      if (!result.success) {
        alert("Failed to delete testimonial. Check if the database is connected.");
        return;
      }
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("active", activeRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      let result;
      if (editingItem) {
        result = await updateTestimonial(editingItem.id, fd);
      } else {
        result = await createTestimonial(fd);
      }
      if (!result.success) {
        setFormError((result as any).error || "Failed to save. Is the database connected?");
        return;
      }
      router.refresh();
      setShowModal(false);
      setEditingItem(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">
            Testimonials
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage success stories</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No testimonials added yet.</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={openNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-card p-5 group"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#F4B400] fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-4 line-clamp-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1A1A2E] text-sm">
                    {t.name}
                  </p>
                  {t.program && (
                    <p className="text-xs text-gray-400">{t.program}</p>
                  )}
                  <Badge
                    variant={t.active ? "approved" : "pending"}
                    className="mt-1"
                  >
                    {t.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    disabled={isPending}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Testimonial" : "New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {formError}
              </div>
            )}
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={editingItem?.name || ""}
                placeholder="Person's name"
              />
            </div>
            <div>
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                name="quote"
                required
                rows={4}
                defaultValue={editingItem?.quote || ""}
                placeholder="Their testimonial..."
              />
            </div>
            <div>
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                name="program"
                defaultValue={editingItem?.program || ""}
                placeholder="e.g. Education Program"
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                defaultValue={editingItem?.image || ""}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={activeRef}
                type="checkbox"
                id="active"
                name="active"
                defaultChecked={editingItem?.active ?? true}
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>
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
                    Saving...
                  </>
                ) : editingItem ? (
                  "Update Testimonial"
                ) : (
                  "Add Testimonial"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
