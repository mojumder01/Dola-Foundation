"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const programSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  objectives: z.array(z.string()).optional(),
  icon: z.string().optional(),
  bannerImage: z.string().optional(),
  stat1Label: z.string().optional(),
  stat1Value: z.string().optional(),
  stat2Label: z.string().optional(),
  stat2Value: z.string().optional(),
  stat3Label: z.string().optional(),
  stat3Value: z.string().optional(),
  order: z.number().optional(),
  published: z.boolean().default(true),
});

export async function getPrograms() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, programs };
  } catch (error) {
    return { success: false, programs: [] };
  }
}

export async function createProgram(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const objectivesRaw = formData.get("objectives") as string;
    const objectives = objectivesRaw
      ? objectivesRaw.split("\n").map((o) => o.trim()).filter(Boolean)
      : [];

    const data = {
      title,
      slug: slugify(title),
      description: formData.get("description") as string,
      objectives,
      icon: (formData.get("icon") as string) || undefined,
      bannerImage: (formData.get("bannerImage") as string) || undefined,
      stat1Label: (formData.get("stat1Label") as string) || undefined,
      stat1Value: (formData.get("stat1Value") as string) || undefined,
      stat2Label: (formData.get("stat2Label") as string) || undefined,
      stat2Value: (formData.get("stat2Value") as string) || undefined,
      stat3Label: (formData.get("stat3Label") as string) || undefined,
      stat3Value: (formData.get("stat3Value") as string) || undefined,
      published: formData.get("published") === "true",
    };

    const program = await prisma.program.create({ data });
    revalidatePath('/admin/programs');
    revalidatePath("/", "layout");
    return { success: true, program };
  } catch (error) {
    return { success: false, error: "Failed to create program" };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const objectivesRaw = formData.get("objectives") as string;
    const objectives = objectivesRaw
      ? objectivesRaw.split("\n").map((o) => o.trim()).filter(Boolean)
      : undefined;

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        description: formData.get("description") as string,
        icon: (formData.get("icon") as string) || undefined,
        bannerImage: (formData.get("bannerImage") as string) || undefined,
        objectives: objectives ?? [],
        stat1Label: (formData.get("stat1Label") as string) || undefined,
        stat1Value: (formData.get("stat1Value") as string) || undefined,
        stat2Label: (formData.get("stat2Label") as string) || undefined,
        stat2Value: (formData.get("stat2Value") as string) || undefined,
        stat3Label: (formData.get("stat3Label") as string) || undefined,
        stat3Value: (formData.get("stat3Value") as string) || undefined,
        published: formData.get("published") === "true",
      },
    });
    revalidatePath('/admin/programs');
    revalidatePath("/", "layout");
    return { success: true, program };
  } catch (error) {
    return { success: false, error: "Failed to update program" };
  }
}

export async function deleteProgram(id: string) {
  try {
    await prisma.program.delete({ where: { id } });
    revalidatePath('/admin/programs');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete program" };
  }
}

export async function toggleProgramPublished(id: string, published: boolean) {
  try {
    await prisma.program.update({ where: { id }, data: { published } });
    revalidatePath('/admin/programs');
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
