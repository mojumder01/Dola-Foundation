"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markContactRead(id: string) {
  try {
    await prisma.contact.update({ where: { id }, data: { isRead: true } });
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({ where: { id } });
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false };
  }
}
