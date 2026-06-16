"use server";
import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPageContent(slug: string) {
  try {
    return await prisma.pageContent.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function upsertPageContent(slug: string, formData: FormData) {
  try {
    await requireAdmin();
    const published = formData.get("published") === "true";
    await prisma.pageContent.upsert({
      where: { slug },
      create: {
        slug,
        title: formData.get("title") as string,
        titleBn: (formData.get("titleBn") as string) || undefined,
        content: formData.get("content") as string,
        contentBn: (formData.get("contentBn") as string) || undefined,
        published,
      },
      update: {
        title: formData.get("title") as string,
        titleBn: (formData.get("titleBn") as string) || undefined,
        content: formData.get("content") as string,
        contentBn: (formData.get("contentBn") as string) || undefined,
        published,
      },
    });
    revalidatePath(`/admin/pages`);
    revalidatePath(`/${slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save page content" };
  }
}
