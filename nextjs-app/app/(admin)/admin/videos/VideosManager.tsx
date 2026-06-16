"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Video, Plus, Edit, Trash2, Loader2, Youtube } from "lucide-react";
import { createVideo, updateVideo, deleteVideo } from "@/actions/admin/videos";

type VideoItem = {
  id: string;
  title: string;
  titleBn?: string | null;
  youtubeUrl: string;
  description: string | null;
  descriptionBn?: string | null;
  published: boolean;
  order: number;
  createdAt: Date;
};

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]+)/);
  return match ? match[1] : null;
}

export default function VideosManager({ videos }: { videos: VideoItem[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  function openNew() { setEditing(null); setFormError(null); setShowModal(true); }
  function openEdit(v: VideoItem) { setEditing(v); setFormError(null); setShowModal(true); }

  function handleDelete(v: VideoItem) {
    if (!confirm(`Delete "${v.title}"?`)) return;
    startTransition(async () => {
      await deleteVideo(v.id);
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("published", (e.currentTarget.querySelector("#published") as HTMLInputElement)?.checked ? "true" : "false");
    setFormError(null);
    startTransition(async () => {
      const result = editing ? await updateVideo(editing.id, fd) : await createVideo(fd);
      if (!result.success) { setFormError((result as any).error || "Failed to save"); return; }
      router.refresh();
      setShowModal(false);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">Videos</h1>
          <p className="text-gray-500 text-sm mt-1">Manage YouTube videos shown on the website</p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl shadow-card p-12 text-center text-gray-400">
            <Youtube className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No videos yet. Add your first YouTube video!</p>
          </div>
        ) : (
          videos.map((v) => {
            const ytId = getYouTubeId(v.youtubeUrl);
            return (
              <div key={v.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                {ytId ? (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Youtube className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-dark text-sm leading-snug">{v.title}</h3>
                    <Badge variant={v.published ? "approved" : "pending"} className="flex-shrink-0">
                      {v.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  {v.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{v.description}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(v)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(v)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Video" : "Add YouTube Video"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{formError}</div>}
            <div>
              <Label htmlFor="title">Title * <span className="text-gray-400 font-normal">(English)</span></Label>
              <Input id="title" name="title" required defaultValue={editing?.title || ""} placeholder="Video title" />
            </div>
            <div>
              <Label htmlFor="titleBn">Title <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
              <Input id="titleBn" name="titleBn" defaultValue={editing?.titleBn || ""} placeholder="বাংলায় লিখুন" />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL *</Label>
              <Input id="youtubeUrl" name="youtubeUrl" required defaultValue={editing?.youtubeUrl || ""} placeholder="https://www.youtube.com/watch?v=..." />
              <p className="text-xs text-gray-400 mt-1">Paste the full YouTube video URL</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="description">Description <span className="text-gray-400 font-normal">(English)</span></Label>
                <Textarea id="description" name="description" rows={2} defaultValue={editing?.description || ""} placeholder="Short description..." />
              </div>
              <div>
                <Label htmlFor="descriptionBn">Description <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                <Textarea id="descriptionBn" name="descriptionBn" rows={2} defaultValue={editing?.descriptionBn || ""} placeholder="বাংলায় লিখুন" />
              </div>
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing?.order ?? 0} placeholder="0" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" name="published" defaultChecked={editing?.published ?? true} className="w-4 h-4 rounded" />
              <Label htmlFor="published" className="cursor-pointer">Published (visible on website)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : editing ? "Update Video" : "Add Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
