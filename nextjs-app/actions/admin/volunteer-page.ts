"use server";

import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidateVolunteerPage() {
  revalidatePath("/admin/volunteer-page");
  revalidatePath("/volunteer");
}

export async function updateVolunteerHero(formData: FormData) {
  try {
    await requireAdmin();
    const existing = await prisma.siteSettings.findFirst();
    const data = {
      volunteerPageBadge: (formData.get("volunteerPageBadge") as string) || undefined,
      volunteerPageBadgeBn: (formData.get("volunteerPageBadgeBn") as string) || undefined,
      volunteerPageTitle: (formData.get("volunteerPageTitle") as string) || undefined,
      volunteerPageTitleBn: (formData.get("volunteerPageTitleBn") as string) || undefined,
      volunteerPageSubtitle: (formData.get("volunteerPageSubtitle") as string) || undefined,
      volunteerPageSubtitleBn: (formData.get("volunteerPageSubtitleBn") as string) || undefined,
    };
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });
    revalidateVolunteerPage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateVolunteerHero]", error);
    return { success: false, error: error?.message || "Failed to update hero section" };
  }
}

export async function updateVolunteerWhySection(formData: FormData) {
  try {
    await requireAdmin();
    const existing = await prisma.siteSettings.findFirst();
    const data = {
      volunteerWhyHeading: (formData.get("volunteerWhyHeading") as string) || undefined,
      volunteerWhyHeadingBn: (formData.get("volunteerWhyHeadingBn") as string) || undefined,
      volunteerWhyDescription: (formData.get("volunteerWhyDescription") as string) || undefined,
      volunteerWhyDescriptionBn: (formData.get("volunteerWhyDescriptionBn") as string) || undefined,
    };
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });
    revalidateVolunteerPage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateVolunteerWhySection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateVolunteerHowSection(formData: FormData) {
  try {
    await requireAdmin();
    const existing = await prisma.siteSettings.findFirst();
    const data = {
      volunteerHowHeading: (formData.get("volunteerHowHeading") as string) || undefined,
      volunteerHowHeadingBn: (formData.get("volunteerHowHeadingBn") as string) || undefined,
    };
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });
    revalidateVolunteerPage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateVolunteerHowSection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateVolunteerApplySection(formData: FormData) {
  try {
    await requireAdmin();
    const existing = await prisma.siteSettings.findFirst();
    const data = {
      volunteerApplyHeading: (formData.get("volunteerApplyHeading") as string) || undefined,
      volunteerApplyHeadingBn: (formData.get("volunteerApplyHeadingBn") as string) || undefined,
      volunteerApplySubtitle: (formData.get("volunteerApplySubtitle") as string) || undefined,
      volunteerApplySubtitleBn: (formData.get("volunteerApplySubtitleBn") as string) || undefined,
    };
    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });
    revalidateVolunteerPage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateVolunteerApplySection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}
