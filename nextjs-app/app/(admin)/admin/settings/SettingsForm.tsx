"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Loader2, Save, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from "@/actions/admin/settings";

const DEFAULT_SECTION_ORDER = [
  "stats",
  "programs",
  "projects",
  "testimonials",
  "gallery",
  "video",
  "volunteer",
  "donation",
];

const SECTION_LABELS: Record<string, string> = {
  stats: "📊 Impact Statistics",
  programs: "📚 Programs",
  projects: "🌍 Projects",
  testimonials: "⭐ Success Stories",
  gallery: "🖼️ Gallery Preview",
  video: "🎬 Video Section",
  volunteer: "🤝 Volunteer CTA",
  donation: "❤️ Donation CTA",
};

function parseSectionOrder(raw?: string | null): string[] {
  const keys = (raw || "").split(",").map((k) => k.trim()).filter(Boolean);
  const valid = keys.filter((k) => DEFAULT_SECTION_ORDER.includes(k));
  const missing = DEFAULT_SECTION_ORDER.filter((k) => !valid.includes(k));
  return [...valid, ...missing];
}

function SectionOrderEditor({ initial }: { initial?: string | null }) {
  const [order, setOrder] = useState<string[]>(() => parseSectionOrder(initial));

  function move(index: number, direction: -1 | 1) {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  return (
    <div>
      <input type="hidden" name="sectionOrder" value={order.join(",")} />
      <div className="space-y-2">
        {order.map((key, index) => (
          <div
            key={key}
            className="flex items-center justify-between bg-[#F8FAFC] border border-gray-100 rounded-xl px-4 py-2.5"
          >
            <span className="text-sm font-medium text-gray-700">
              {index + 1}. {SECTION_LABELS[key] || key}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        The Hero section always appears first and isn't reorderable. Changes apply after you click "Save Changes" below.
      </p>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </>
      )}
    </Button>
  );
}

const BANNER_OVERLAY_PREFIXES = ["about", "programs", "projects", "volunteer", "blog", "gallery", "donate", "contact"];

export default function SettingsForm({ settings }: { settings: any }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpacities, setOverlayOpacities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      BANNER_OVERLAY_PREFIXES.map((prefix) => [prefix, (settings as any)?.[`${prefix}BannerOverlayOpacity`] ?? 80])
    )
  );

  async function handleAction(formData: FormData) {
    const result = await updateSiteSettings(formData);
    if (result?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result?.error || "Failed to save — is the database connected? Check /api/health");
    }
  }

  return (
    <form action={handleAction} className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Settings saved successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Branding */}
      <div id="branding" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          Branding
        </h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="label-base" htmlFor="siteName">Site Name</Label>
              <Input id="siteName" name="siteName" defaultValue={settings?.siteName || ""} placeholder="Dola Foundation" />
            </div>
            <div>
              <Label className="label-base" htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={settings?.tagline || ""} placeholder="Empowering Lives" />
            </div>
          </div>
          <div>
            <Label className="label-base" htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" name="logoUrl" defaultValue={settings?.logoUrl || ""} placeholder="https://..." />
          </div>
          <div>
            <Label className="label-base" htmlFor="faviconUrl">Favicon URL (Browser Tab Icon)</Label>
            <Input id="faviconUrl" name="faviconUrl" defaultValue={(settings as any)?.faviconUrl || ""} placeholder="https://... (square image, 32×32 or 512×512px)" />
            <p className="text-xs text-gray-400 mt-1">Upload a square PNG/ICO to ImgBB.com → paste URL here. Appears in browser tabs and bookmarks.</p>
          </div>
        </div>
      </div>

      {/* Theme Colors */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          Theme Colors
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Pick your brand colors — changes apply to the live website immediately after saving.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="label-base" htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                defaultValue={settings?.primaryColor || "#0F3D8C"}
                className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-500 font-mono">
                {settings?.primaryColor || "#0F3D8C"}
              </span>
            </div>
          </div>
          <div>
            <Label className="label-base" htmlFor="accentColor">Accent Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                id="accentColor"
                name="accentColor"
                defaultValue={settings?.accentColor || "#F4B400"}
                className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-500 font-mono">
                {settings?.accentColor || "#F4B400"}
              </span>
            </div>
          </div>
          <div>
            <Label className="label-base" htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                id="secondaryColor"
                name="secondaryColor"
                defaultValue={settings?.secondaryColor || "#1F9D55"}
                className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-500 font-mono">
                {settings?.secondaryColor || "#1F9D55"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Label className="label-base" htmlFor="bannerHeadingFont">Banner Heading Font</Label>
          <select
            id="bannerHeadingFont"
            name="bannerHeadingFont"
            defaultValue={(settings as any)?.bannerHeadingFont || "poppins"}
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white"
          >
            <option value="poppins">Poppins</option>
            <option value="inter">Inter</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">Font used for the bold heading text on every page banner.</p>
        </div>
      </div>

      {/* Hero Section */}
      <div id="hero" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          Hero Section
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="label-base" htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" name="heroTitle" defaultValue={settings?.heroTitle} placeholder="Empowering Lives, Inspiring Hope" />
          </div>
          <div>
            <Label className="label-base" htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={settings?.heroSubtitle} rows={2} />
          </div>
          <div>
            <Label className="label-base" htmlFor="heroImage">Hero Background Image URL</Label>
            <Input id="heroImage" name="heroImage" defaultValue={settings?.heroImage || ""} placeholder="https://..." />
          </div>
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="label-base mb-0">Announcement Bar</Label>
                <p className="text-xs text-gray-400">The badge shown at the top of the hero section</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="announcementEnabled"
                  value="true"
                  defaultChecked={(settings as any)?.announcementEnabled ?? true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div>
              <Label className="label-base" htmlFor="announcementText">Announcement Text</Label>
              <Input
                id="announcementText"
                name="announcementText"
                defaultValue={(settings as any)?.announcementText || ""}
                placeholder="✨ Empowering Communities Since 2015"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Page Banners */}
      <div id="banners" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1 pb-3 border-b border-gray-100">
          Page Banner Images
        </h2>
        <p className="text-xs text-gray-500 mb-4 mt-2">
          Optional full-width banner image for each page's hero section. If empty, the default color gradient is shown.
          <br/><span className="text-primary font-medium">Free image hosts: ImgBB.com, Imgur.com · Recommended: 1920×600px, WebP/JPG, max 500KB</span>
        </p>
        <div className="space-y-6">
          {[
            { prefix: "about", name: "aboutBannerImage", label: "About Page Banner", page: "/about" },
            { prefix: "programs", name: "programsBannerImage", label: "Programs Page Banner", page: "/programs" },
            { prefix: "projects", name: "projectsBannerImage", label: "Projects Page Banner", page: "/projects" },
            { prefix: "volunteer", name: "volunteerBannerImage", label: "Volunteer Page Banner", page: "/volunteer" },
            { prefix: "blog", name: "blogBannerImage", label: "Blog Page Banner", page: "/blog" },
            { prefix: "gallery", name: "galleryBannerImage", label: "Gallery Page Banner", page: "/gallery" },
            { prefix: "donate", name: "donateBannerImage", label: "Donate Page Banner", page: "/donate" },
            { prefix: "contact", name: "contactBannerImage", label: "Contact Page Banner", page: "/contact" },
          ].map(({ prefix, name, label, page }) => {
            const overlayColorName = `${prefix}BannerOverlayColor`;
            const overlayOpacityName = `${prefix}BannerOverlayOpacity`;
            const overlayColor = (settings as any)?.[overlayColorName] || "#0F3D8C";
            const overlayOpacity = overlayOpacities[prefix] ?? 80;
            const badgeName = `${prefix}BannerBadge`;
            const titleName = `${prefix}BannerTitle`;
            const subtitleName = `${prefix}BannerSubtitle`;
            const textColorName = `${prefix}BannerTextColor`;
            const textColor = (settings as any)?.[textColorName] || "#FFFFFF";
            return (
              <div key={name} className="border border-gray-100 rounded-xl p-4">
                <Label className="label-base" htmlFor={name}>
                  {label} <span className="text-gray-400 font-normal text-xs">({page})</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={name}
                    name={name}
                    defaultValue={(settings as any)?.[name] || ""}
                    placeholder="https://... leave empty for color gradient"
                  />
                  {(settings as any)?.[name] && (
                    <img src={(settings as any)[name]} alt="" className="h-10 w-16 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap items-end gap-4 mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <Label className="label-base text-xs" htmlFor={overlayColorName}>Overlay Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        id={overlayColorName}
                        name={overlayColorName}
                        defaultValue={overlayColor}
                        className="h-9 w-14 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <span className="text-xs text-gray-500 font-mono">{overlayColor}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <Label className="label-base text-xs" htmlFor={overlayOpacityName}>
                      Overlay Brightness/Darkness ({overlayOpacity}% dark)
                    </Label>
                    <input
                      type="range"
                      id={overlayOpacityName}
                      name={overlayOpacityName}
                      min={0}
                      max={100}
                      value={overlayOpacity}
                      onChange={(e) =>
                        setOverlayOpacities((prev) => ({ ...prev, [prefix]: Number(e.target.value) }))
                      }
                      className="w-full mt-2 accent-primary"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">0% = fully bright image, 100% = fully solid overlay color</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <Label className="label-base text-xs" htmlFor={badgeName}>Badge Text</Label>
                    <Input
                      id={badgeName}
                      name={badgeName}
                      defaultValue={(settings as any)?.[badgeName] || ""}
                      placeholder="e.g. About Us"
                    />
                  </div>
                  <div>
                    <Label className="label-base text-xs" htmlFor={textColorName}>Text Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        id={textColorName}
                        name={textColorName}
                        defaultValue={textColor}
                        className="h-9 w-14 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <span className="text-xs text-gray-500 font-mono">{textColor}</span>
                    </div>
                  </div>
                  {prefix !== "donate" && (
                    <>
                      <div className="sm:col-span-2">
                        <Label className="label-base text-xs" htmlFor={titleName}>Heading Text</Label>
                        <Input
                          id={titleName}
                          name={titleName}
                          defaultValue={(settings as any)?.[titleName] || ""}
                          placeholder="Leave empty to use the default page heading"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="label-base text-xs" htmlFor={subtitleName}>Subtitle Text</Label>
                        <Textarea
                          id={subtitleName}
                          name={subtitleName}
                          rows={2}
                          defaultValue={(settings as any)?.[subtitleName] || ""}
                          placeholder="Leave empty to use the default page subtitle"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donate Page */}
      <div id="donate-page" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1 pb-3 border-b border-gray-100">
          Donate Page
        </h2>
        <p className="text-xs text-gray-500 mb-4 mt-2">
          The headline and subtitle shown in the hero section of the <strong>/donate</strong> page.
        </p>
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <Label className="label-base mb-0">Accept Donations</Label>
              <p className="text-xs text-gray-400">
                Turn off to hide donation forms and "Donate Now" buttons site-wide and show a "currently not accepting donations" notice on the /donate page.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
              <input
                type="checkbox"
                name="donationsEnabled"
                value="true"
                defaultChecked={(settings as any)?.donationsEnabled ?? true}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div>
            <Label className="label-base" htmlFor="donatePageTitle">Donate Page Title</Label>
            <Input id="donatePageTitle" name="donatePageTitle" defaultValue={(settings as any)?.donatePageTitle || ""} placeholder="Donate to Dola Foundation" />
          </div>
          <div>
            <Label className="label-base" htmlFor="donatePageSubtitle">Donate Page Subtitle</Label>
            <Textarea id="donatePageSubtitle" name="donatePageSubtitle" defaultValue={(settings as any)?.donatePageSubtitle || ""} rows={2} placeholder="Your generous donation directly funds our programs..." />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div id="stats" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1 pb-3 border-b border-gray-100">
          Impact Statistics
        </h2>
        <p className="text-xs text-gray-500 mb-4 mt-2">
          These 4 numbers appear on the homepage in the <strong>"Creating Real Change"</strong> section and in the hero area.
          <br />
          <span className="text-primary font-medium">Value</span> = the number shown (e.g. <code className="bg-gray-100 px-1 rounded">5,000+</code> or <code className="bg-gray-100 px-1 rounded">12</code>).
          <span className="ml-1 text-primary font-medium">Label</span> = the text below it (e.g. <code className="bg-gray-100 px-1 rounded">Lives Impacted</code>).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { i: 1, valueEx: "5,000+", labelEx: "Lives Impacted" },
            { i: 2, valueEx: "12", labelEx: "Active Programs" },
            { i: 3, valueEx: "8", labelEx: "Districts Reached" },
            { i: 4, valueEx: "500+", labelEx: "Volunteers" },
          ].map(({ i, valueEx, labelEx }) => (
            <div key={i} className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{i}</span>
                Statistic #{i}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="label-base" htmlFor={`stat${i}Value`}>Number / Value</Label>
                  <Input
                    id={`stat${i}Value`}
                    name={`stat${i}Value`}
                    defaultValue={(settings as any)?.[`stat${i}Value`]}
                    placeholder={valueEx}
                  />
                  <p className="text-xs text-gray-400 mt-1">e.g. {valueEx}</p>
                </div>
                <div>
                  <Label className="label-base" htmlFor={`stat${i}Label`}>Label / Title</Label>
                  <Input
                    id={`stat${i}Label`}
                    name={`stat${i}Label`}
                    defaultValue={(settings as any)?.[`stat${i}Label`]}
                    placeholder={labelEx}
                  />
                  <p className="text-xs text-gray-400 mt-1">e.g. {labelEx}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 text-xs text-blue-700">
          <span>💡</span>
          <span>Tip: Add <strong>+</strong> at the end of the Value to show a "+" sign (e.g. <code className="bg-blue-100 px-1 rounded">5,000+</code>). Use commas for thousands (e.g. <code className="bg-blue-100 px-1 rounded">10,000+</code>).</span>
        </div>
      </div>

      {/* Homepage Section Order */}
      <div id="section-order" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1 pb-3 border-b border-gray-100">
          Homepage Section Order
        </h2>
        <p className="text-xs text-gray-500 mb-4 mt-2">
          Use the arrows to move sections up or down. This controls the order they appear in on the homepage.
        </p>
        <SectionOrderEditor initial={(settings as any)?.sectionOrder} />
      </div>

      {/* About */}
      <div id="about" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          About Section
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="label-base" htmlFor="aboutText">About Text</Label>
            <Textarea id="aboutText" name="aboutText" defaultValue={settings?.aboutText || ""} rows={4} />
          </div>
          <div>
            <Label className="label-base" htmlFor="missionText">Mission Statement</Label>
            <Textarea id="missionText" name="missionText" defaultValue={settings?.missionText || ""} rows={3} />
          </div>
          <div>
            <Label className="label-base" htmlFor="visionText">Vision Statement</Label>
            <Textarea id="visionText" name="visionText" defaultValue={settings?.visionText || ""} rows={3} />
          </div>
        </div>
      </div>

      {/* About Page Stats */}
      <div id="about-stats" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1 pb-3 border-b border-gray-100">
          About Page Stats
        </h2>
        <p className="text-xs text-gray-500 mb-4 mt-2">
          These 4 numbers appear in the "A Decade of Changing Lives" section on the <strong>About</strong> page.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { i: 1, iconEx: "🏛️", valueEx: "2015", labelEx: "Founded" },
            { i: 2, iconEx: "❤️", valueEx: "5,000+", labelEx: "Lives Impacted" },
            { i: 3, iconEx: "📍", valueEx: "8", labelEx: "Districts Served" },
            { i: 4, iconEx: "👥", valueEx: "500+", labelEx: "Volunteers" },
          ].map(({ i, iconEx, valueEx, labelEx }) => (
            <div key={i} className="bg-[#F8FAFC] rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{i}</span>
                Statistic #{i}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="label-base" htmlFor={`aboutStat${i}Icon`}>Icon</Label>
                  <Input
                    id={`aboutStat${i}Icon`}
                    name={`aboutStat${i}Icon`}
                    defaultValue={(settings as any)?.[`aboutStat${i}Icon`]}
                    placeholder={iconEx}
                  />
                </div>
                <div>
                  <Label className="label-base" htmlFor={`aboutStat${i}Value`}>Value</Label>
                  <Input
                    id={`aboutStat${i}Value`}
                    name={`aboutStat${i}Value`}
                    defaultValue={(settings as any)?.[`aboutStat${i}Value`]}
                    placeholder={valueEx}
                  />
                </div>
                <div>
                  <Label className="label-base" htmlFor={`aboutStat${i}Label`}>Label</Label>
                  <Input
                    id={`aboutStat${i}Label`}
                    name={`aboutStat${i}Label`}
                    defaultValue={(settings as any)?.[`aboutStat${i}Label`]}
                    placeholder={labelEx}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder */}
      <div id="founder" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          Founder's Message
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="label-base" htmlFor="founderName">Founder Name</Label>
            <Input id="founderName" name="founderName" defaultValue={settings?.founderName || ""} />
          </div>
          <div>
            <Label className="label-base" htmlFor="founderImage">Founder Photo URL</Label>
            <Input id="founderImage" name="founderImage" defaultValue={settings?.founderImage || ""} placeholder="https://..." />
          </div>
          <div>
            <Label className="label-base" htmlFor="founderMessage">Message</Label>
            <Textarea id="founderMessage" name="founderMessage" defaultValue={settings?.founderMessage || ""} rows={5} />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div id="contact" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          Contact Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="label-base" htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={settings?.address || ""} />
          </div>
          <div>
            <Label className="label-base" htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={settings?.phone || ""} />
          </div>
          <div>
            <Label className="label-base" htmlFor="email">Email</Label>
            <Input id="email" name="email" defaultValue={settings?.email || ""} />
          </div>
          <div>
            <Label className="label-base" htmlFor="officeHours">Office Hours</Label>
            <Textarea id="officeHours" name="officeHours" defaultValue={(settings as any)?.officeHours || ""} rows={2} placeholder={"Saturday – Thursday\n9:00 AM – 5:00 PM"} />
          </div>
          <div className="sm:col-span-2">
            <Label className="label-base" htmlFor="googleMapsEmbedUrl">Google Maps Embed URL</Label>
            <Input
              id="googleMapsEmbedUrl"
              name="googleMapsEmbedUrl"
              defaultValue={(settings as any)?.googleMapsEmbedUrl || ""}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Go to Google Maps → search your address → Share → Embed a map → copy the <code className="bg-gray-100 px-1 rounded">src</code> URL from the iframe code (must contain <code className="bg-gray-100 px-1 rounded">/maps/embed</code>).
              If left empty or pasted incorrectly, the Contact page automatically shows a map generated from your Address above instead.
            </p>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-4 pb-3 border-b border-gray-100">
          Social Media Links
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { id: "facebookUrl", label: "Facebook URL" },
            { id: "instagramUrl", label: "Instagram URL" },
            { id: "twitterUrl", label: "Twitter URL" },
            { id: "youtubeUrl", label: "YouTube URL" },
          ].map((social) => (
            <div key={social.id}>
              <Label className="label-base" htmlFor={social.id}>{social.label}</Label>
              <Input
                id={social.id}
                name={social.id}
                defaultValue={(settings as any)?.[social.id] || ""}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div id="footer" className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1 pb-3 border-b border-gray-100">
          Footer
        </h2>
        <p className="text-xs text-gray-500 mb-4 mt-2">
          The short mission paragraph shown under the logo in the website footer.
        </p>
        <div>
          <Label className="label-base" htmlFor="footerMissionText">Footer Mission Text</Label>
          <Textarea
            id="footerMissionText"
            name="footerMissionText"
            defaultValue={(settings as any)?.footerMissionText || ""}
            rows={3}
            placeholder="We are dedicated to empowering communities through sustainable development, education, healthcare, and social welfare programs across Bangladesh."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
