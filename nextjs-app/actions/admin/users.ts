"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

type Role = "ADMIN" | "EDITOR" | "SUPER_ADMIN";

export async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function createUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as Role) || "ADMIN";
    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    console.error("[createUser]", error);
    return { success: false, error: error?.message || "Failed to create user" };
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = (formData.get("role") as Role) || "ADMIN";
    const password = formData.get("password") as string;
    const data: { name: string; email: string; role: Role; password?: string } = {
      name,
      email,
      role,
    };
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }
      data.password = await bcrypt.hash(password, 12);
    }
    const user = await prisma.user.update({ where: { id }, data });
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    console.error("[updateUser]", error);
    return { success: false, error: error?.message || "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    const count = await prisma.user.count();
    if (count <= 1) {
      return { success: false, error: "Cannot delete the last remaining user" };
    }
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("[deleteUser]", error);
    return { success: false, error: error?.message || "Failed to delete user" };
  }
}
