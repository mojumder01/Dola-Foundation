"use server";

import { requireAdmin } from "@/lib/guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGalleryImages(category?: string) {
  try {
    await requireAdmin();
    const images = await prisma.galleryImage.findMany({
      where: category ? { category } : {},
      orderBy: { order: "asc" },
    });
    return { success: true, images };
  } catch (error) {
    return { success: false, images: [] };
  }
}

export async function addGalleryImage(data: {
  title?: string;
  url: string;
  publicId?: string;
  category?: string;
  order?: number;
}) {
  try {
    await requireAdmin();
    const image = await prisma.galleryImage.create({ data });
    revalidatePath('/admin/gallery');
    revalidatePath("/", "layout");
    return { success: true, image };
  } catch (error) {
    return { success: false, error: "Failed to add image" };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await requireAdmin();
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath('/admin/gallery');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete image" };
  }
}

export async function updateGalleryImageOrder(
  images: { id: string; order: number }[]
) {
  try {
    await requireAdmin();
    await Promise.all(
      images.map((img) =>
        prisma.galleryImage.update({
          where: { id: img.id },
          data: { order: img.order },
        })
      )
    );
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
