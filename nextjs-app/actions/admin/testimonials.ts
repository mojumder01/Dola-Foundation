"use server";

import { requireAdmin } from "@/lib/guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
  try {
    await requireAdmin();
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, testimonials };
  } catch (error) {
    return { success: false, testimonials: [] };
  }
}

export async function createTestimonial(formData: FormData) {
  try {
    await requireAdmin();
    const testimonial = await prisma.testimonial.create({
      data: {
        name: formData.get("name") as string,
        nameBn: (formData.get("nameBn") as string) || undefined,
        quote: formData.get("quote") as string,
        quoteBn: (formData.get("quoteBn") as string) || undefined,
        program: (formData.get("program") as string) || undefined,
        programBn: (formData.get("programBn") as string) || undefined,
        image: (formData.get("image") as string) || undefined,
        active: formData.get("active") === "true",
      },
    });
    revalidatePath('/admin/testimonials');
    revalidatePath("/", "layout");
    return { success: true, testimonial };
  } catch (error) {
    return { success: false, error: "Failed to create testimonial" };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        nameBn: (formData.get("nameBn") as string) || undefined,
        quote: formData.get("quote") as string,
        quoteBn: (formData.get("quoteBn") as string) || undefined,
        program: (formData.get("program") as string) || undefined,
        programBn: (formData.get("programBn") as string) || undefined,
        image: (formData.get("image") as string) || undefined,
        active: formData.get("active") === "true",
      },
    });
    revalidatePath('/admin/testimonials');
    revalidatePath("/", "layout");
    return { success: true, testimonial };
  } catch (error) {
    return { success: false, error: "Failed to update testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requireAdmin();
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath('/admin/testimonials');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete testimonial" };
  }
}

export async function toggleTestimonialActive(id: string, active: boolean) {
  try {
    await requireAdmin();
    await prisma.testimonial.update({ where: { id }, data: { active } });
    revalidatePath('/admin/testimonials');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
