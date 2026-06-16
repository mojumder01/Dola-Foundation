import { prisma } from "@/lib/prisma";
import { getContentItems } from "@/actions/admin/content-items";
import {
  updateVolunteerHero,
  updateVolunteerWhySection,
  updateVolunteerHowSection,
  updateVolunteerApplySection,
} from "@/actions/admin/volunteer-page";
import SectionSaveForm from "@/components/admin/SectionSaveForm";
import ContentManager from "@/app/(admin)/admin/content/ContentManager";
import { HeartHandshake } from "lucide-react";

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function AdminVolunteerPagePage() {
  const [settings, benefits, steps] = await Promise.all([
    getSettings(),
    getContentItems("volunteer-benefits"),
    getContentItems("volunteer-steps"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-dark flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-primary" />
          Volunteer Page
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit every section of the public <strong>/volunteer</strong> page. Each section saves
          independently — changes only apply when you click its Save button.
        </p>
      </div>

      <div className="space-y-6">
        <SectionSaveForm
          title="Hero Section"
          description="The badge, headline, and subtitle shown at the top of the page."
          action={updateVolunteerHero}
          fields={[
            {
              name: "volunteerPageBadge",
              label: "Badge Text",
              defaultValue: settings?.volunteerPageBadge || "",
              placeholder: "Get Involved",
              bn: { name: "volunteerPageBadgeBn", defaultValue: (settings as any)?.volunteerPageBadgeBn || "" },
            },
            {
              name: "volunteerPageTitle",
              label: "Title",
              defaultValue: settings?.volunteerPageTitle || "",
              placeholder: "Volunteer With Us",
              bn: { name: "volunteerPageTitleBn", defaultValue: (settings as any)?.volunteerPageTitleBn || "" },
            },
            {
              name: "volunteerPageSubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.volunteerPageSubtitle || "",
              placeholder:
                "Your time, skills, and passion can change lives. Join our community of 500+ volunteers working to build a better Bangladesh.",
              bn: { name: "volunteerPageSubtitleBn", defaultValue: (settings as any)?.volunteerPageSubtitleBn || "" },
            },
          ]}
        />

        <SectionSaveForm
          title="Why Volunteer Section"
          description="The heading and description above the benefits cards."
          action={updateVolunteerWhySection}
          fields={[
            {
              name: "volunteerWhyHeading",
              label: "Heading",
              defaultValue: settings?.volunteerWhyHeading || "",
              placeholder: "Why Volunteer With Us?",
              bn: { name: "volunteerWhyHeadingBn", defaultValue: (settings as any)?.volunteerWhyHeadingBn || "" },
            },
            {
              name: "volunteerWhyDescription",
              label: "Description",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.volunteerWhyDescription || "",
              placeholder:
                "Volunteering with Dola Foundation is a rewarding experience that benefits both you and the communities we serve.",
              bn: { name: "volunteerWhyDescriptionBn", defaultValue: (settings as any)?.volunteerWhyDescriptionBn || "" },
            },
          ]}
        />

        <ContentManager
          section="volunteer-benefits"
          title="Benefit Cards"
          pageHint="/volunteer page · Why Volunteer section"
          items={benefits}
          iconPlaceholder="❤️"
        />

        <SectionSaveForm
          title="How It Works Section"
          description="The heading above the numbered steps."
          action={updateVolunteerHowSection}
          fields={[
            {
              name: "volunteerHowHeading",
              label: "Heading",
              defaultValue: settings?.volunteerHowHeading || "",
              placeholder: "How It Works",
              bn: { name: "volunteerHowHeadingBn", defaultValue: (settings as any)?.volunteerHowHeadingBn || "" },
            },
          ]}
        />

        <ContentManager
          section="volunteer-steps"
          title="Steps"
          pageHint="/volunteer page · How It Works section"
          items={steps}
          showIcon={false}
        />

        <SectionSaveForm
          title="Apply Section"
          description="The heading and subtitle shown above the volunteer registration form."
          action={updateVolunteerApplySection}
          fields={[
            {
              name: "volunteerApplyHeading",
              label: "Heading",
              defaultValue: settings?.volunteerApplyHeading || "",
              placeholder: "Apply to Volunteer",
              bn: { name: "volunteerApplyHeadingBn", defaultValue: (settings as any)?.volunteerApplyHeadingBn || "" },
            },
            {
              name: "volunteerApplySubtitle",
              label: "Subtitle",
              type: "textarea",
              rows: 2,
              defaultValue: settings?.volunteerApplySubtitle || "",
              placeholder: "Fill in the form below and we'll get back to you within 3-5 business days.",
              bn: { name: "volunteerApplySubtitleBn", defaultValue: (settings as any)?.volunteerApplySubtitleBn || "" },
            },
          ]}
        />
      </div>
    </div>
  );
}
