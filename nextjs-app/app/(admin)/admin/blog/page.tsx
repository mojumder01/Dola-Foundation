import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">Manage blog posts and articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#0F3D8C]" />
          <h2 className="font-semibold text-[#1A1A2E]">All Posts ({posts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Author</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No blog posts yet. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#1A1A2E] max-w-xs truncate">{post.title}</p>
                      <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{post.category || "—"}</td>
                    <td className="py-3 px-4 text-gray-500">{post.author}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(post.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={post.published ? "approved" : "pending"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <button className="p-1.5 text-gray-400 hover:text-[#0F3D8C] hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
