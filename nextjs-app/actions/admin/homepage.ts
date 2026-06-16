"use server";

import { requireAdmin } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidateHomepage() {
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

async function saveSettings(data: Record<string, string | undefined>) {
  const existing = await prisma.siteSettings.findFirst();
  return existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
    : await prisma.siteSettings.create({ data });
}

export async function updateHomeStatsSection(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      homeStatsBadge: (formData.get("homeStatsBadge") as string) || undefined,
      homeStatsTitle: (formData.get("homeStatsTitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateHomeStatsSection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateProgramsSection(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      programsSectionBadge: (formData.get("programsSectionBadge") as string) || undefined,
      programsSectionTitle: (formData.get("programsSectionTitle") as string) || undefined,
      programsSectionSubtitle: (formData.get("programsSectionSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateProgramsSection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateProjectsSection(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      projectsSectionBadge: (formData.get("projectsSectionBadge") as string) || undefined,
      projectsSectionTitle: (formData.get("projectsSectionTitle") as string) || undefined,
      projectsSectionSubtitle: (formData.get("projectsSectionSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateProjectsSection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateStoriesSection(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      storiesSectionBadge: (formData.get("storiesSectionBadge") as string) || undefined,
      storiesSectionTitle: (formData.get("storiesSectionTitle") as string) || undefined,
      storiesSectionSubtitle: (formData.get("storiesSectionSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateStoriesSection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateGallerySection(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      gallerySectionBadge: (formData.get("gallerySectionBadge") as string) || undefined,
      gallerySectionTitle: (formData.get("gallerySectionTitle") as string) || undefined,
      gallerySectionSubtitle: (formData.get("gallerySectionSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateGallerySection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateVideoSection(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      videoSectionBadge: (formData.get("videoSectionBadge") as string) || undefined,
      videoSectionTitle: (formData.get("videoSectionTitle") as string) || undefined,
      videoSectionSubtitle: (formData.get("videoSectionSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateVideoSection]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateHomeVolunteerCta(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      homeVolunteerCtaBadge: (formData.get("homeVolunteerCtaBadge") as string) || undefined,
      homeVolunteerCtaTitle: (formData.get("homeVolunteerCtaTitle") as string) || undefined,
      homeVolunteerCtaSubtitle: (formData.get("homeVolunteerCtaSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateHomeVolunteerCta]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}

export async function updateHomeDonationCta(formData: FormData) {
  try {
    await requireAdmin();
    const settings = await saveSettings({
      homeDonationCtaBadge: (formData.get("homeDonationCtaBadge") as string) || undefined,
      homeDonationCtaTitleLine1: (formData.get("homeDonationCtaTitleLine1") as string) || undefined,
      homeDonationCtaTitleLine2: (formData.get("homeDonationCtaTitleLine2") as string) || undefined,
      homeDonationCtaSubtitle: (formData.get("homeDonationCtaSubtitle") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateHomeDonationCta]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}
