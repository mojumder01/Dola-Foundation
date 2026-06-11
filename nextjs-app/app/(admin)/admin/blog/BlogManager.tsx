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
import { FileText, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/actions/admin/blog";
import { formatDate } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  author: string;
  createdAt: Date;
  published: boolean;
  excerpt: string | null;
  content: string;
};

export default function BlogManager({ posts }: { posts: Post[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const publishedRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditingPost(null);
    setShowModal(true);
  }

  function openEdit(post: Post) {
    setEditingPost(post);
    setShowModal(true);
  }

  function handleDelete(post: Post) {
    if (
      !confirm(
        `Are you sure you want to delete "${post.title}"? This cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      await deleteBlogPost(post.id);
      router.refresh();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("published", publishedRef.current?.checked ? "true" : "false");
    startTransition(async () => {
      if (editingPost) {
        await updateBlogPost(editingPost.id, fd);
      } else {
        await createBlogPost(fd);
      }
      router.refresh();
      setShowModal(false);
      setEditingPost(null);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">
            Blog
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage blog posts and articles
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#0F3D8C]" />
          <h2 className="font-semibold text-[#1A1A2E]">
            All Posts ({posts.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Author
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-400"
                  >
                    No blog posts yet. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#1A1A2E] max-w-xs truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {post.category || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{post.author}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={post.published ? "approved" : "pending"}
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "New Post"}
            </DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={editingPost?.title || ""}
                placeholder="Post title"
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                defaultValue={editingPost?.excerpt || ""}
                placeholder="Short description..."
              />
            </div>
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                required
                rows={5}
                defaultValue={editingPost?.content || ""}
                placeholder="Post content..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingPost?.category || ""}
                  placeholder="e.g. Education"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={editingPost?.author || "Dola Foundation"}
                  placeholder="Author name"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={publishedRef}
                type="checkbox"
                id="published"
                name="published"
                defaultChecked={editingPost?.published ?? false}
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Published
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
                ) : editingPost ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
