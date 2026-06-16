import { getContentItems } from "@/actions/admin/content-items";
import ContentManager from "./ContentManager";

export default async function AdminContentPage() {
  const [aboutValues, volunteerBenefits, volunteerSteps, donateTrust, donateWhy] = await Promise.all([
    getContentItems("about-values"),
    getContentItems("volunteer-benefits"),
    getContentItems("volunteer-steps"),
    getContentItems("donate-trust"),
    getContentItems("donate-why"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-dark">Content Sections</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage repeatable card and list content across the About, Volunteer, and Donate pages.
          Each section falls back to built-in defaults if left empty.
        </p>
      </div>

      <div className="space-y-6">
        <ContentManager
          section="about-values"
          title="Core Values"
          pageHint="/about page"
          items={aboutValues}
          iconPlaceholder="❤️"
        />
        <ContentManager
          section="volunteer-benefits"
          title="Why Volunteer Benefits"
          pageHint="/volunteer page"
          items={volunteerBenefits}
          iconPlaceholder="❤️"
        />
        <ContentManager
          section="volunteer-steps"
          title="How It Works Steps"
          pageHint="/volunteer page"
          items={volunteerSteps}
          showIcon={false}
        />
        <ContentManager
          section="donate-trust"
          title="Trust Indicators"
          pageHint="/donate page"
          items={donateTrust}
          showIcon={false}
          showDescription={false}
        />
        <ContentManager
          section="donate-why"
          title="Why Donate Points"
          pageHint="/donate page"
          items={donateWhy}
          showIcon={false}
          showDescription={false}
        />
      </div>
    </div>
  );
}
