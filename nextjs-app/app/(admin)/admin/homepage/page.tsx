import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getContentItems } from "@/actions/admin/content-items";
import {
  updateHomeStatsSection,
  updateProgramsSection,
  updateProjectsSection,
  updateStoriesSection,
  updateGallerySection,
  updateVideoSection,
  updateHomeVolunteerCta,
  updateHomeDonationCta,
} from "@/actions/admin/homepage";
import SectionSaveForm from "@/components/admin/SectionSaveForm";
import ContentManager from "@/app/(admin)/admin/content/ContentManager";
import { LayoutGrid } from "lucide-react";

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function AdminHomepagePage() {
  const [settings, volunteerBenefits, donationTrust] = await Promise.all([
    getSettings(),
    getContentItems("home-volunteer-benefits"),
    getContentItems("home-donation-trust"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-dark flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-primary" />
          Homepage
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit every section of the public homepage. Each section saves independently — changes
          only apply when you click its Save button. The Hero banner and the 4 headline stat
          values are managed in{" "}
          <Link href="/admin/settings" className="text-primary underline">
            Settings
          </Link>
          .
        </p>
      </div>

      <div className="space-y-6">
        <SectionSaveForm
          title="Impact Stats Heading"
          description="The small badge and heading shown above the impact stats counters."
          action={updateHomeStatsSection}
          fields={[
            {
              name: "homeStatsBadge",
              label: "Badge Text",
              defaultValue: settings?.homeStatsBadge || "",
              placeholder: "Our Impact",
              bn: { name: "homeStatsBadgeBn", defaultValue: (settings as any)?.homeStatsBadgeBn || "" },
            },
            {
              name: "homeStatsTitle",
              label: "Title",
              defaultValue: settings?.homeStatsTitle || "",
              placeholder: "Creating Real Change",
              bn: { name: "homeStatsTitleBn", defaultValue: (settings as any)?.homeStatsTitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Programs Section"
          description="The heading shown above the programs grid."
          action={updateProgramsSection}
          fields={[
            {
              name: "programsSectionBadge",
              label: "Badge Text",
              defaultValue: settings?.programsSectionBadge || "",
              placeholder: "What We Do",
              bn: { name: "programsSectionBadgeBn", defaultValue: (settings as any)?.programsSectionBadgeBn || "" },
            },
            {
              name: "programsSectionTitle",
              label: "Title",
              defaultValue: settings?.programsSectionTitle || "",
              placeholder: "Our Programs",
              bn: { name: "programsSectionTitleBn", defaultValue: (settings as any)?.programsSectionTitleBn || "" },
            },
            {
              name: "programsSectionSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.programsSectionSubtitle || "",
              placeholder:
                "We run six comprehensive programs designed to address the most critical needs of vulnerable communities in Bangladesh.",
              bn: { name: "programsSectionSubtitleBn", defaultValue: (settings as any)?.programsSectionSubtitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Projects Section"
          description="The heading shown above the featured projects grid."
          action={updateProjectsSection}
          fields={[
            {
              name: "projectsSectionBadge",
              label: "Badge Text",
              defaultValue: settings?.projectsSectionBadge || "",
              placeholder: "Our Work",
              bn: { name: "projectsSectionBadgeBn", defaultValue: (settings as any)?.projectsSectionBadgeBn || "" },
            },
            {
              name: "projectsSectionTitle",
              label: "Title",
              defaultValue: settings?.projectsSectionTitle || "",
              placeholder: "Featured Projects",
              bn: { name: "projectsSectionTitleBn", defaultValue: (settings as any)?.projectsSectionTitleBn || "" },
            },
            {
              name: "projectsSectionSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.projectsSectionSubtitle || "",
              placeholder:
                "Discover some of our impactful projects transforming lives and communities across Bangladesh.",
              bn: { name: "projectsSectionSubtitleBn", defaultValue: (settings as any)?.projectsSectionSubtitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Success Stories Section"
          description="The heading shown above the testimonial cards."
          action={updateStoriesSection}
          fields={[
            {
              name: "storiesSectionBadge",
              label: "Badge Text",
              defaultValue: settings?.storiesSectionBadge || "",
              placeholder: "Success Stories",
              bn: { name: "storiesSectionBadgeBn", defaultValue: (settings as any)?.storiesSectionBadgeBn || "" },
            },
            {
              name: "storiesSectionTitle",
              label: "Title",
              defaultValue: settings?.storiesSectionTitle || "",
              placeholder: "Lives We've Changed",
              bn: { name: "storiesSectionTitleBn", defaultValue: (settings as any)?.storiesSectionTitleBn || "" },
            },
            {
              name: "storiesSectionSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.storiesSectionSubtitle || "",
              placeholder:
                "Read the stories of real people whose lives have been transformed through our programs and your generous support.",
              bn: { name: "storiesSectionSubtitleBn", defaultValue: (settings as any)?.storiesSectionSubtitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Gallery Section"
          description="The heading shown above the homepage gallery preview."
          action={updateGallerySection}
          fields={[
            {
              name: "gallerySectionBadge",
              label: "Badge Text",
              defaultValue: settings?.gallerySectionBadge || "",
              placeholder: "Gallery",
              bn: { name: "gallerySectionBadgeBn", defaultValue: (settings as any)?.gallerySectionBadgeBn || "" },
            },
            {
              name: "gallerySectionTitle",
              label: "Title",
              defaultValue: settings?.gallerySectionTitle || "",
              placeholder: "Our Gallery",
              bn: { name: "gallerySectionTitleBn", defaultValue: (settings as any)?.gallerySectionTitleBn || "" },
            },
            {
              name: "gallerySectionSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.gallerySectionSubtitle || "",
              placeholder: "Glimpses of our work and impact across communities.",
              bn: { name: "gallerySectionSubtitleBn", defaultValue: (settings as any)?.gallerySectionSubtitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Videos Section"
          description="The heading shown above the homepage video grid."
          action={updateVideoSection}
          fields={[
            {
              name: "videoSectionBadge",
              label: "Badge Text",
              defaultValue: settings?.videoSectionBadge || "",
              placeholder: "Watch & Learn",
              bn: { name: "videoSectionBadgeBn", defaultValue: (settings as any)?.videoSectionBadgeBn || "" },
            },
            {
              name: "videoSectionTitle",
              label: "Title",
              defaultValue: settings?.videoSectionTitle || "",
              placeholder: "Our Videos",
              bn: { name: "videoSectionTitleBn", defaultValue: (settings as any)?.videoSectionTitleBn || "" },
            },
            {
              name: "videoSectionSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.videoSectionSubtitle || "",
              placeholder: "Watch our latest videos to learn more about our work and impact across Bangladesh.",
              bn: { name: "videoSectionSubtitleBn", defaultValue: (settings as any)?.videoSectionSubtitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Volunteer CTA Section"
          description="The badge, headline, and subtitle in the 'Join Our Mission' banner."
          action={updateHomeVolunteerCta}
          fields={[
            {
              name: "homeVolunteerCtaBadge",
              label: "Badge Text",
              defaultValue: settings?.homeVolunteerCtaBadge || "",
              placeholder: "Join Us",
              bn: { name: "homeVolunteerCtaBadgeBn", defaultValue: (settings as any)?.homeVolunteerCtaBadgeBn || "" },
            },
            {
              name: "homeVolunteerCtaTitle",
              label: "Title",
              defaultValue: settings?.homeVolunteerCtaTitle || "",
              placeholder: "Join Our Mission to Change Lives",
              bn: { name: "homeVolunteerCtaTitleBn", defaultValue: (settings as any)?.homeVolunteerCtaTitleBn || "" },
            },
            {
              name: "homeVolunteerCtaSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.homeVolunteerCtaSubtitle || "",
              placeholder:
                "Become a volunteer and make a tangible difference in the lives of those who need it most. Your time and skills are invaluable.",
              bn: { name: "homeVolunteerCtaSubtitleBn", defaultValue: (settings as any)?.homeVolunteerCtaSubtitleBn || "" },
            },
          ]}
        />

        <ContentManager
          section="home-volunteer-benefits"
          title="Volunteer CTA Benefit List"
          pageHint="Homepage · Volunteer CTA section"
          items={volunteerBenefits}
          iconPlaceholder="❤️"
        />

        <SectionSaveForm
          title="Donation CTA Section"
          description="The badge, headline, and subtitle in the 'Your Generosity Changes Lives' banner."
          action={updateHomeDonationCta}
          fields={[
            {
              name: "homeDonationCtaBadge",
              label: "Badge Text",
              defaultValue: settings?.homeDonationCtaBadge || "",
              placeholder: "Support Our Mission",
              bn: { name: "homeDonationCtaBadgeBn", defaultValue: (settings as any)?.homeDonationCtaBadgeBn || "" },
            },
            {
              name: "homeDonationCtaTitleLine1",
              label: "Title (Line 1)",
              defaultValue: settings?.homeDonationCtaTitleLine1 || "",
              placeholder: "Your Generosity",
              bn: { name: "homeDonationCtaTitleLine1Bn", defaultValue: (settings as any)?.homeDonationCtaTitleLine1Bn || "" },
            },
            {
              name: "homeDonationCtaTitleLine2",
              label: "Title (Line 2, gold)",
              defaultValue: settings?.homeDonationCtaTitleLine2 || "",
              placeholder: "Changes Lives",
              bn: { name: "homeDonationCtaTitleLine2Bn", defaultValue: (settings as any)?.homeDonationCtaTitleLine2Bn || "" },
            },
            {
              name: "homeDonationCtaSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.homeDonationCtaSubtitle || "",
              placeholder:
                "Every donation, big or small, makes a real difference in the lives of the people we serve. Join thousands of donors who are helping us build a better Bangladesh.",
              bn: { name: "homeDonationCtaSubtitleBn", defaultValue: (settings as any)?.homeDonationCtaSubtitleBn || "" },
            },
          ]}
        />

        <ContentManager
          section="home-donation-trust"
          title="Donation CTA Trust Points"
          pageHint="Homepage · Donation CTA section"
          items={donationTrust}
          showIcon={false}
          showDescription={false}
        />
      </div>
    </div>
  );
}
