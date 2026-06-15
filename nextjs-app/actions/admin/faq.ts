"use server";
import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFAQs() {
  try {
    await requireAdmin();
    return await prisma.fAQ.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export async function createFAQ(formData: FormData) {
  try {
    await requireAdmin();
    await prisma.fAQ.create({
      data: {
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
        category: (formData.get("category") as string) || undefined,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/contact");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create FAQ" };
  }
}

export async function updateFAQ(id: string, formData: FormData) {
  try {
    await requireAdmin();
    await prisma.fAQ.update({
      where: { id },
      data: {
        question: formData.get("question") as string,
        answer: formData.get("answer") as string,
        category: (formData.get("category") as string) || undefined,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/faq");
    revalidatePath("/contact");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update FAQ" };
  }
}

export async function deleteFAQ(id: string) {
  try {
    await requireAdmin();
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath("/admin/faq");
    revalidatePath("/contact");
    return { success: true };
  } catch {
    return { success: false };
  }
}
