import { getSiteSettings } from "@/actions/admin/settings";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const { settings } = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit homepage content, contact info, and social links
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
