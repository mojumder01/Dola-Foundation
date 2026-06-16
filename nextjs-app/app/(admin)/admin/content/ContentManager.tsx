"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Layers, Plus, Edit, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import {
  createContentItem,
  updateContentItem,
  deleteContentItem,
  toggleContentItem,
} from "@/actions/admin/content-items";

type ContentItem = {
  id: string;
  icon: string | null;
  title: string | null;
  description: string | null;
  active: boolean;
  order: number;
};

export default function ContentManager({
  section,
  title,
  pageHint,
  items,
  showIcon = true,
  showDescription = true,
  iconPlaceholder = "💡",
}: {
  section: string;
  title: string;
  pageHint: string;
  items: ContentItem[];
  showIcon?: boolean;
  showDescription?: boolean;
  iconPlaceholder?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const activeRef = useRef<HTMLInputElement>(null);

  function openNew() { setEditing(null); setFormError(null); setShowModal(true); }
  function openEdit(i: ContentItem) { setEditing(i); setFormError(null); setShowModal(true); }

  function handleDelete(i: ContentItem) {
    if (!confirm(`Delete "${i.title || "this item"}"?`)) return;
    startTransition(async () => {
      await deleteContentItem(i.id, section);
      router.refresh();
    });
  }

  function handleToggle(i: ContentItem) {
    startTransition(async () => {
      await toggleContentItem(i.id, section, !i.active);
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("active", activeRef.current?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      const result = editing
        ? await updateContentItem(editing.id, section, fd)
        : await createContentItem(section, fd);
      if (!result.success) { setFormError((result as any).error || "Failed to save"); return; }
      router.refresh();
      setShowModal(false);
      setEditing(null);
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-dark">{title}</h2>
            <p className="text-xs text-gray-400">{pageHint} &middot; {items.length} item{items.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </div>
      <div className="divide-y divide-gray-50">
        {items.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No items yet — the page will show its built-in defaults.</div>
        ) : (
          items.map((i) => (
            <div key={i.id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50/50">
              <div className="flex-1 min-w-0 flex items-start gap-3">
                {showIcon && i.icon && <div className="text-2xl flex-shrink-0">{i.icon}</div>}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={i.active ? "approved" : "pending"}>{i.active ? "Active" : "Disabled"}</Badge>
                    <span className="text-xs text-gray-400">Order: {i.order}</span>
                  </div>
                  {i.title && <p className="font-medium text-dark text-sm">{i.title}</p>}
                  {showDescription && i.description && <p className="text-sm text-gray-500 mt-0.5">{i.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleToggle(i)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-primary rounded-lg transition-colors" title={i.active ? "Disable" : "Enable"}>
                  {i.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => openEdit(i)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(i)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Item" : "New Item"} — {title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{formError}</div>}
            <div className={showIcon ? "grid grid-cols-3 gap-4" : ""}>
              {showIcon && (
                <div>
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input id="icon" name="icon" defaultValue={editing?.icon || ""} placeholder={iconPlaceholder} />
                </div>
              )}
              <div className={showIcon ? "col-span-2" : ""}>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required defaultValue={editing?.title || ""} />
              </div>
            </div>
            {showDescription && (
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={editing?.description || ""} />
              </div>
            )}
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing?.order ?? 0} />
            </div>
            <div className="flex items-center gap-2">
              <input ref={activeRef} type="checkbox" id="active" name="active" defaultChecked={editing?.active ?? true} className="w-4 h-4 rounded" />
              <Label htmlFor="active" className="cursor-pointer">Active (visible on the public page)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
