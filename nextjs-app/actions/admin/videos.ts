"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guard";

export async function getVideos() {
  try {
    await requireAdmin();
    return await prisma.video.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export async function createVideo(formData: FormData) {
  try {
    await requireAdmin();
    await prisma.video.create({
      data: {
        title: formData.get("title") as string,
        youtubeUrl: formData.get("youtubeUrl") as string,
        description: (formData.get("description") as string) || undefined,
        published: formData.get("published") === "true",
        order: parseInt((formData.get("order") as string) || "0"),
      },
    });
    revalidatePath("/admin/videos");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create video" };
  }
}

export async function updateVideo(id: string, formData: FormData) {
  try {
    await requireAdmin();
    await prisma.video.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        youtubeUrl: formData.get("youtubeUrl") as string,
        description: (formData.get("description") as string) || undefined,
        published: formData.get("published") === "true",
        order: parseInt((formData.get("order") as string) || "0"),
      },
    });
    revalidatePath("/admin/videos");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update video" };
  }
}

export async function deleteVideo(id: string) {
  try {
    await requireAdmin();
    await prisma.video.delete({ where: { id } });
    revalidatePath("/admin/videos");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false };
  }
}
