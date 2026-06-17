"use server";

import { requireAdmin } from "@/lib/guard";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  try {
    await requireAdmin();
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }
    return { success: true, settings };
  } catch (error) {
    return { success: false, settings: null };
  }
}

export async function updateSiteSettings(formData: FormData) {
  try {
    await requireAdmin();
    const existing = await prisma.siteSettings.findFirst();

    const data = {
      siteName: (formData.get("siteName") as string) || undefined,
      tagline: (formData.get("tagline") as string) || undefined,
      logoUrl: (formData.get("logoUrl") as string) || undefined,
      faviconUrl: (formData.get("faviconUrl") as string) || undefined,
      primaryColor: (formData.get("primaryColor") as string) || undefined,
      accentColor: (formData.get("accentColor") as string) || undefined,
      secondaryColor: (formData.get("secondaryColor") as string) || undefined,
      heroTitle: formData.get("heroTitle") as string,
      heroSubtitle: formData.get("heroSubtitle") as string,
      heroImage: (formData.get("heroImage") as string) || undefined,
      announcementText: (formData.get("announcementText") as string) || undefined,
      announcementEnabled: formData.get("announcementEnabled") === "true",
      donationsEnabled: formData.get("donationsEnabled") === "true",
      aboutText: (formData.get("aboutText") as string) || undefined,
      missionText: (formData.get("missionText") as string) || undefined,
      visionText: (formData.get("visionText") as string) || undefined,
      founderName: (formData.get("founderName") as string) || undefined,
      founderMessage: (formData.get("founderMessage") as string) || undefined,
      founderImage: (formData.get("founderImage") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      facebookUrl: (formData.get("facebookUrl") as string) || undefined,
      instagramUrl: (formData.get("instagramUrl") as string) || undefined,
      twitterUrl: (formData.get("twitterUrl") as string) || undefined,
      youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
      stat1Label: formData.get("stat1Label") as string,
      stat1Value: formData.get("stat1Value") as string,
      stat2Label: formData.get("stat2Label") as string,
      stat2Value: formData.get("stat2Value") as string,
      stat3Label: formData.get("stat3Label") as string,
      stat3Value: formData.get("stat3Value") as string,
      stat4Label: formData.get("stat4Label") as string,
      stat4Value: formData.get("stat4Value") as string,
      aboutBannerImage: (formData.get("aboutBannerImage") as string) || undefined,
      programsBannerImage: (formData.get("programsBannerImage") as string) || undefined,
      projectsBannerImage: (formData.get("projectsBannerImage") as string) || undefined,
      contactBannerImage: (formData.get("contactBannerImage") as string) || undefined,
      volunteerBannerImage: (formData.get("volunteerBannerImage") as string) || undefined,
      blogBannerImage: (formData.get("blogBannerImage") as string) || undefined,
      galleryBannerImage: (formData.get("galleryBannerImage") as string) || undefined,
      donateBannerImage: (formData.get("donateBannerImage") as string) || undefined,
      aboutBannerOverlayColor: (formData.get("aboutBannerOverlayColor") as string) || undefined,
      aboutBannerOverlayOpacity: formData.get("aboutBannerOverlayOpacity") ? Number(formData.get("aboutBannerOverlayOpacity")) : undefined,
      programsBannerOverlayColor: (formData.get("programsBannerOverlayColor") as string) || undefined,
      programsBannerOverlayOpacity: formData.get("programsBannerOverlayOpacity") ? Number(formData.get("programsBannerOverlayOpacity")) : undefined,
      projectsBannerOverlayColor: (formData.get("projectsBannerOverlayColor") as string) || undefined,
      projectsBannerOverlayOpacity: formData.get("projectsBannerOverlayOpacity") ? Number(formData.get("projectsBannerOverlayOpacity")) : undefined,
      contactBannerOverlayColor: (formData.get("contactBannerOverlayColor") as string) || undefined,
      contactBannerOverlayOpacity: formData.get("contactBannerOverlayOpacity") ? Number(formData.get("contactBannerOverlayOpacity")) : undefined,
      volunteerBannerOverlayColor: (formData.get("volunteerBannerOverlayColor") as string) || undefined,
      volunteerBannerOverlayOpacity: formData.get("volunteerBannerOverlayOpacity") ? Number(formData.get("volunteerBannerOverlayOpacity")) : undefined,
      blogBannerOverlayColor: (formData.get("blogBannerOverlayColor") as string) || undefined,
      blogBannerOverlayOpacity: formData.get("blogBannerOverlayOpacity") ? Number(formData.get("blogBannerOverlayOpacity")) : undefined,
      galleryBannerOverlayColor: (formData.get("galleryBannerOverlayColor") as string) || undefined,
      galleryBannerOverlayOpacity: formData.get("galleryBannerOverlayOpacity") ? Number(formData.get("galleryBannerOverlayOpacity")) : undefined,
      donateBannerOverlayColor: (formData.get("donateBannerOverlayColor") as string) || undefined,
      donateBannerOverlayOpacity: formData.get("donateBannerOverlayOpacity") ? Number(formData.get("donateBannerOverlayOpacity")) : undefined,
      aboutBannerBadge: (formData.get("aboutBannerBadge") as string) || undefined,
      aboutBannerTitle: (formData.get("aboutBannerTitle") as string) || undefined,
      aboutBannerSubtitle: (formData.get("aboutBannerSubtitle") as string) || undefined,
      aboutBannerTextColor: (formData.get("aboutBannerTextColor") as string) || undefined,
      programsBannerBadge: (formData.get("programsBannerBadge") as string) || undefined,
      programsBannerTitle: (formData.get("programsBannerTitle") as string) || undefined,
      programsBannerSubtitle: (formData.get("programsBannerSubtitle") as string) || undefined,
      programsBannerTextColor: (formData.get("programsBannerTextColor") as string) || undefined,
      projectsBannerBadge: (formData.get("projectsBannerBadge") as string) || undefined,
      projectsBannerTitle: (formData.get("projectsBannerTitle") as string) || undefined,
      projectsBannerSubtitle: (formData.get("projectsBannerSubtitle") as string) || undefined,
      projectsBannerTextColor: (formData.get("projectsBannerTextColor") as string) || undefined,
      contactBannerBadge: (formData.get("contactBannerBadge") as string) || undefined,
      contactBannerTitle: (formData.get("contactBannerTitle") as string) || undefined,
      contactBannerSubtitle: (formData.get("contactBannerSubtitle") as string) || undefined,
      contactBannerTextColor: (formData.get("contactBannerTextColor") as string) || undefined,
      volunteerBannerBadge: (formData.get("volunteerBannerBadge") as string) || undefined,
      volunteerBannerTitle: (formData.get("volunteerBannerTitle") as string) || undefined,
      volunteerBannerSubtitle: (formData.get("volunteerBannerSubtitle") as string) || undefined,
      volunteerBannerTextColor: (formData.get("volunteerBannerTextColor") as string) || undefined,
      blogBannerBadge: (formData.get("blogBannerBadge") as string) || undefined,
      blogBannerTitle: (formData.get("blogBannerTitle") as string) || undefined,
      blogBannerSubtitle: (formData.get("blogBannerSubtitle") as string) || undefined,
      blogBannerTextColor: (formData.get("blogBannerTextColor") as string) || undefined,
      galleryBannerBadge: (formData.get("galleryBannerBadge") as string) || undefined,
      galleryBannerTitle: (formData.get("galleryBannerTitle") as string) || undefined,
      galleryBannerSubtitle: (formData.get("galleryBannerSubtitle") as string) || undefined,
      galleryBannerTextColor: (formData.get("galleryBannerTextColor") as string) || undefined,
      donateBannerBadge: (formData.get("donateBannerBadge") as string) || undefined,
      donateBannerTextColor: (formData.get("donateBannerTextColor") as string) || undefined,
      bannerHeadingFont: (formData.get("bannerHeadingFont") as string) || undefined,
      googleMapsEmbedUrl: (formData.get("googleMapsEmbedUrl") as string) || undefined,
      donatePageTitle: (formData.get("donatePageTitle") as string) || undefined,
      donatePageSubtitle: (formData.get("donatePageSubtitle") as string) || undefined,
      officeHours: (formData.get("officeHours") as string) || undefined,
      footerMissionText: (formData.get("footerMissionText") as string) || undefined,
      sectionOrder: (formData.get("sectionOrder") as string) || undefined,
      aboutStat1Icon: (formData.get("aboutStat1Icon") as string) || undefined,
      aboutStat1Value: (formData.get("aboutStat1Value") as string) || undefined,
      aboutStat1Label: (formData.get("aboutStat1Label") as string) || undefined,
      aboutStat2Icon: (formData.get("aboutStat2Icon") as string) || undefined,
      aboutStat2Value: (formData.get("aboutStat2Value") as string) || undefined,
      aboutStat2Label: (formData.get("aboutStat2Label") as string) || undefined,
      aboutStat3Icon: (formData.get("aboutStat3Icon") as string) || undefined,
      aboutStat3Value: (formData.get("aboutStat3Value") as string) || undefined,
      aboutStat3Label: (formData.get("aboutStat3Label") as string) || undefined,
      aboutStat4Icon: (formData.get("aboutStat4Icon") as string) || undefined,
      aboutStat4Value: (formData.get("aboutStat4Value") as string) || undefined,
      aboutStat4Label: (formData.get("aboutStat4Label") as string) || undefined,
    };

    const settings = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
      : await prisma.siteSettings.create({ data });

    revalidatePath('/admin/settings');
    revalidatePath("/", "layout");
    return { success: true, settings };
  } catch (error: any) {
    console.error("[updateSiteSettings]", error);
    return { success: false, error: error?.message || "Failed to update settings" };
  }
}
