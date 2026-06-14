"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from "@/actions/admin/settings";

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

export default function SettingsForm({ settings }: { settings: any }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
