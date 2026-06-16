"use server";

import { requireAdmin } from "@/lib/guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function getProjects(status?: string) {
  try {
    await requireAdmin();
    const projects = await prisma.project.findMany({
      where: status && status !== "ALL" ? { status: status as any } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, projects };
  } catch (error) {
    return { success: false, projects: [] };
  }
}

function collectGallery(formData: FormData): string[] {
  return ["gallery1", "gallery2", "gallery3", "gallery4"]
    .map((k) => (formData.get(k) as string || "").trim())
    .filter(Boolean);
}

export async function createProject(formData: FormData) {
  try {
    await requireAdmin();
    const title = formData.get("title") as string;
    const budgetRaw = formData.get("budget") as string;
    const project = await prisma.project.create({
      data: {
        title,
        titleBn: (formData.get("titleBn") as string) || undefined,
        slug: slugify(title),
        description: formData.get("description") as string,
        descriptionBn: (formData.get("descriptionBn") as string) || undefined,
        location: (formData.get("location") as string) || undefined,
        status: (formData.get("status") as any) || "ONGOING",
        published: formData.get("published") === "true",
        impact: (formData.get("impact") as string) || undefined,
        impactBn: (formData.get("impactBn") as string) || undefined,
        budget: budgetRaw ? parseFloat(budgetRaw) : undefined,
        gallery: collectGallery(formData),
      },
    });
    revalidatePath('/admin/projects');
    revalidatePath("/", "layout");
    return { success: true, project };
  } catch (error) {
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const budgetRaw = formData.get("budget") as string;
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        titleBn: (formData.get("titleBn") as string) || undefined,
        description: formData.get("description") as string,
        descriptionBn: (formData.get("descriptionBn") as string) || undefined,
        location: (formData.get("location") as string) || undefined,
        status: (formData.get("status") as any) || "ONGOING",
        published: formData.get("published") === "true",
        impact: (formData.get("impact") as string) || undefined,
        impactBn: (formData.get("impactBn") as string) || undefined,
        budget: budgetRaw ? parseFloat(budgetRaw) : undefined,
        gallery: collectGallery(formData),
      },
    });
    revalidatePath('/admin/projects');
    revalidatePath("/", "layout");
    return { success: true, project };
  } catch (error) {
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    revalidatePath('/admin/projects');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
