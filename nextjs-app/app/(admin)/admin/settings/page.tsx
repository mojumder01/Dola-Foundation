import { getSiteSettings } from "@/actions/admin/settings";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const { settings } = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-dark">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Control every piece of content on the website — branding, colors, homepage sections, contact info, and social links.
        </p>
      </div>

      {/* Quick navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "🎨 Branding & Colors", href: "#branding" },
          { label: "🏠 Hero Section", href: "#hero" },
          { label: "🖼️ Page Banners", href: "#banners" },
          { label: "📊 Homepage Stats", href: "#stats" },
          { label: "🔢 Section Order", href: "#section-order" },
          { label: "ℹ️ About & Mission", href: "#about" },
          { label: "📈 About Page Stats", href: "#about-stats" },
          { label: "👤 Founder Message", href: "#founder" },
          { label: "📞 Contact & Social", href: "#contact" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-xs bg-gray-100 hover:bg-primary hover:text-white text-gray-600 px-3 py-1.5 rounded-full transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
