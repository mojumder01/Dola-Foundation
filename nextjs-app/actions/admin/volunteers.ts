"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateVolunteerStatus(id: string, status: string) {
  try {
    await prisma.volunteer.update({
      where: { id },
      data: { status: status as any },
    });
    revalidatePath("/admin/volunteers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteVolunteer(id: string) {
  try {
    await prisma.volunteer.delete({ where: { id } });
    revalidatePath("/admin/volunteers");
    return { success: true };
  } catch {
    return { success: false };
  }
}
