"use server";
import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDonationImpacts() {
  try {
    await requireAdmin();
    return await prisma.donationImpact.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export async function createDonationImpact(formData: FormData) {
  try {
    await requireAdmin();
    await prisma.donationImpact.create({
      data: {
        icon: (formData.get("icon") as string) || "💝",
        amount: parseInt((formData.get("amount") as string) || "0"),
        impact: formData.get("impact") as string,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/donation-impact");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create impact amount" };
  }
}

export async function updateDonationImpact(id: string, formData: FormData) {
  try {
    await requireAdmin();
    await prisma.donationImpact.update({
      where: { id },
      data: {
        icon: (formData.get("icon") as string) || "💝",
        amount: parseInt((formData.get("amount") as string) || "0"),
        impact: formData.get("impact") as string,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/donation-impact");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update impact amount" };
  }
}

export async function deleteDonationImpact(id: string) {
  try {
    await requireAdmin();
    await prisma.donationImpact.delete({ where: { id } });
    revalidatePath("/admin/donation-impact");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function toggleDonationImpact(id: string, active: boolean) {
  try {
    await requireAdmin();
    await prisma.donationImpact.update({ where: { id }, data: { active } });
    revalidatePath("/admin/donation-impact");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false };
  }
}
