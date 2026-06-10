"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function getBlogPosts(publishedOnly = false) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, posts };
  } catch (error) {
    return { success: false, posts: [] };
  }
}

export async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    return { success: true, post };
  } catch (error) {
    return { success: false, post: null };
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: slugify(title),
        excerpt: (formData.get("excerpt") as string) || undefined,
        content: formData.get("content") as string,
        coverImage: (formData.get("coverImage") as string) || undefined,
        category: (formData.get("category") as string) || undefined,
        tags: JSON.parse((formData.get("tags") as string) || "[]"),
        author: (formData.get("author") as string) || "Dola Foundation",
        published: formData.get("published") === "true",
        publishedAt:
          formData.get("published") === "true" ? new Date() : undefined,
      },
    });
    return { success: true, post };
  } catch (error) {
    return { success: false, error: "Failed to create post" };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const published = formData.get("published") === "true";
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        excerpt: (formData.get("excerpt") as string) || undefined,
        content: formData.get("content") as string,
        coverImage: (formData.get("coverImage") as string) || undefined,
        category: (formData.get("category") as string) || undefined,
        author: (formData.get("author") as string) || "Dola Foundation",
        published,
        publishedAt: published ? new Date() : undefined,
      },
    });
    return { success: true, post };
  } catch (error) {
    return { success: false, error: "Failed to update post" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function toggleBlogPublished(id: string, published: boolean) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { published, publishedAt: published ? new Date() : null },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
