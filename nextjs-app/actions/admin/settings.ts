"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  try {
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
    const existing = await prisma.siteSettings.findFirst();

    const data = {
      siteName: (formData.get("siteName") as string) || undefined,
      tagline: (formData.get("tagline") as string) || undefined,
      logoUrl: (formData.get("logoUrl") as string) || undefined,
      heroTitle: formData.get("heroTitle") as string,
      heroSubtitle: formData.get("heroSubtitle") as string,
      heroImage: (formData.get("heroImage") as string) || undefined,
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
