import { prisma } from "@/lib/prisma";
import BlogManager from "./BlogManager";

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return <BlogManager posts={posts} />;
}
