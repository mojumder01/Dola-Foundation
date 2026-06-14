"use server";

import { requireAdmin } from "@/lib/guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  try {
    await requireAdmin();
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, members };
  } catch (error) {
    return { success: false, members: [] };
  }
}

export async function createTeamMember(formData: FormData) {
  try {
    await requireAdmin();
    const member = await prisma.teamMember.create({
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        bio: (formData.get("bio") as string) || undefined,
        image: (formData.get("image") as string) || undefined,
        active: formData.get("active") === "true",
      },
    });
    revalidatePath('/admin/team');
    revalidatePath("/", "layout");
    return { success: true, member };
  } catch (error) {
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMember(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        bio: (formData.get("bio") as string) || undefined,
        image: (formData.get("image") as string) || undefined,
        active: formData.get("active") === "true",
      },
    });
    revalidatePath('/admin/team');
    revalidatePath("/", "layout");
    return { success: true, member };
  } catch (error) {
    return { success: false, error: "Failed to update team member" };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await requireAdmin();
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath('/admin/team');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete team member" };
  }
}

export async function toggleTeamMemberActive(id: string, active: boolean) {
  try {
    await requireAdmin();
    await prisma.teamMember.update({ where: { id }, data: { active } });
    revalidatePath('/admin/team');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
