"use server";
import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const SECTION_PUBLIC_PATH: Record<string, string> = {
  "about-values": "/about",
  "volunteer-benefits": "/volunteer",
  "volunteer-steps": "/volunteer",
  "donate-trust": "/donate",
  "donate-why": "/donate",
  "home-volunteer-benefits": "/",
  "home-donation-trust": "/",
};

const SECTION_ADMIN_PATH: Record<string, string> = {
  "volunteer-benefits": "/admin/volunteer-page",
  "volunteer-steps": "/admin/volunteer-page",
  "home-volunteer-benefits": "/admin/homepage",
  "home-donation-trust": "/admin/homepage",
};

function revalidateSection(section: string) {
  revalidatePath(SECTION_ADMIN_PATH[section] || "/admin/content");
  const publicPath = SECTION_PUBLIC_PATH[section];
  if (publicPath) revalidatePath(publicPath);
}

export async function getContentItems(section: string) {
  try {
    await requireAdmin();
    return await prisma.contentItem.findMany({
      where: { section },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function createContentItem(section: string, formData: FormData) {
  try {
    await requireAdmin();
    await prisma.contentItem.create({
      data: {
        section,
        icon: (formData.get("icon") as string) || undefined,
        title: (formData.get("title") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidateSection(section);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create item" };
  }
}

export async function updateContentItem(id: string, section: string, formData: FormData) {
  try {
    await requireAdmin();
    await prisma.contentItem.update({
      where: { id },
      data: {
        icon: (formData.get("icon") as string) || undefined,
        title: (formData.get("title") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidateSection(section);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteContentItem(id: string, section: string) {
  try {
    await requireAdmin();
    await prisma.contentItem.delete({ where: { id } });
    revalidateSection(section);
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function toggleContentItem(id: string, section: string, active: boolean) {
  try {
    await requireAdmin();
    await prisma.contentItem.update({ where: { id }, data: { active } });
    revalidateSection(section);
    return { success: true };
  } catch {
    return { success: false };
  }
}
