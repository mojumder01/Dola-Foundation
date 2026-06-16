import { prisma } from "@/lib/prisma";
import BlogManager from "./BlogManager";

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminBlogPage() {
  const [posts, galleryImages] = await Promise.all([getBlogPosts(), getGalleryImages()]);
  return <BlogManager posts={posts} galleryImages={galleryImages} />;
}
