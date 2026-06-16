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
      homeStatsBadgeBn: (formData.get("homeStatsBadgeBn") as string) || undefined,
      homeStatsTitle: (formData.get("homeStatsTitle") as string) || undefined,
      homeStatsTitleBn: (formData.get("homeStatsTitleBn") as string) || undefined,
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
      programsSectionBadgeBn: (formData.get("programsSectionBadgeBn") as string) || undefined,
      programsSectionTitle: (formData.get("programsSectionTitle") as string) || undefined,
      programsSectionTitleBn: (formData.get("programsSectionTitleBn") as string) || undefined,
      programsSectionSubtitle: (formData.get("programsSectionSubtitle") as string) || undefined,
      programsSectionSubtitleBn: (formData.get("programsSectionSubtitleBn") as string) || undefined,
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
      projectsSectionBadgeBn: (formData.get("projectsSectionBadgeBn") as string) || undefined,
      projectsSectionTitle: (formData.get("projectsSectionTitle") as string) || undefined,
      projectsSectionTitleBn: (formData.get("projectsSectionTitleBn") as string) || undefined,
      projectsSectionSubtitle: (formData.get("projectsSectionSubtitle") as string) || undefined,
      projectsSectionSubtitleBn: (formData.get("projectsSectionSubtitleBn") as string) || undefined,
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
      storiesSectionBadgeBn: (formData.get("storiesSectionBadgeBn") as string) || undefined,
      storiesSectionTitle: (formData.get("storiesSectionTitle") as string) || undefined,
      storiesSectionTitleBn: (formData.get("storiesSectionTitleBn") as string) || undefined,
      storiesSectionSubtitle: (formData.get("storiesSectionSubtitle") as string) || undefined,
      storiesSectionSubtitleBn: (formData.get("storiesSectionSubtitleBn") as string) || undefined,
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
      gallerySectionBadgeBn: (formData.get("gallerySectionBadgeBn") as string) || undefined,
      gallerySectionTitle: (formData.get("gallerySectionTitle") as string) || undefined,
      gallerySectionTitleBn: (formData.get("gallerySectionTitleBn") as string) || undefined,
      gallerySectionSubtitle: (formData.get("gallerySectionSubtitle") as string) || undefined,
      gallerySectionSubtitleBn: (formData.get("gallerySectionSubtitleBn") as string) || undefined,
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
      videoSectionBadgeBn: (formData.get("videoSectionBadgeBn") as string) || undefined,
      videoSectionTitle: (formData.get("videoSectionTitle") as string) || undefined,
      videoSectionTitleBn: (formData.get("videoSectionTitleBn") as string) || undefined,
      videoSectionSubtitle: (formData.get("videoSectionSubtitle") as string) || undefined,
      videoSectionSubtitleBn: (formData.get("videoSectionSubtitleBn") as string) || undefined,
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
      homeVolunteerCtaBadgeBn: (formData.get("homeVolunteerCtaBadgeBn") as string) || undefined,
      homeVolunteerCtaTitle: (formData.get("homeVolunteerCtaTitle") as string) || undefined,
      homeVolunteerCtaTitleBn: (formData.get("homeVolunteerCtaTitleBn") as string) || undefined,
      homeVolunteerCtaSubtitle: (formData.get("homeVolunteerCtaSubtitle") as string) || undefined,
      homeVolunteerCtaSubtitleBn: (formData.get("homeVolunteerCtaSubtitleBn") as string) || undefined,
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
      homeDonationCtaBadgeBn: (formData.get("homeDonationCtaBadgeBn") as string) || undefined,
      homeDonationCtaTitleLine1: (formData.get("homeDonationCtaTitleLine1") as string) || undefined,
      homeDonationCtaTitleLine1Bn: (formData.get("homeDonationCtaTitleLine1Bn") as string) || undefined,
      homeDonationCtaTitleLine2: (formData.get("homeDonationCtaTitleLine2") as string) || undefined,
      homeDonationCtaTitleLine2Bn: (formData.get("homeDonationCtaTitleLine2Bn") as string) || undefined,
      homeDonationCtaSubtitle: (formData.get("homeDonationCtaSubtitle") as string) || undefined,
      homeDonationCtaSubtitleBn: (formData.get("homeDonationCtaSubtitleBn") as string) || undefined,
    });
    revalidateHomepage();
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateHomeDonationCta]", error);
    return { success: false, error: error?.message || "Failed to update section" };
  }
}
