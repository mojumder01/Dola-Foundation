"use server";
import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPaymentMethods() {
  try {
    await requireAdmin();
    return await prisma.paymentMethodConfig.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}

export async function createPaymentMethod(formData: FormData) {
  try {
    await requireAdmin();
    await prisma.paymentMethodConfig.create({
      data: {
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        accountInfo: (formData.get("accountInfo") as string) || undefined,
        instructions: (formData.get("instructions") as string) || undefined,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/payment-methods");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create payment method" };
  }
}

export async function updatePaymentMethod(id: string, formData: FormData) {
  try {
    await requireAdmin();
    await prisma.paymentMethodConfig.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        accountInfo: (formData.get("accountInfo") as string) || undefined,
        instructions: (formData.get("instructions") as string) || undefined,
        order: parseInt((formData.get("order") as string) || "0"),
        active: formData.get("active") === "true",
      },
    });
    revalidatePath("/admin/payment-methods");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update payment method" };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await requireAdmin();
    await prisma.paymentMethodConfig.delete({ where: { id } });
    revalidatePath("/admin/payment-methods");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function togglePaymentMethod(id: string, active: boolean) {
  try {
    await requireAdmin();
    await prisma.paymentMethodConfig.update({ where: { id }, data: { active } });
    revalidatePath("/admin/payment-methods");
    revalidatePath("/donate");
    return { success: true };
  } catch {
    return { success: false };
  }
}
