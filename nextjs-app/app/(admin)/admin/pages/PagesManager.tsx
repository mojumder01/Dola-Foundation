"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Eye, EyeOff } from "lucide-react";
import { upsertPageContent } from "@/actions/admin/pages";

type PageContent = {
  id: string;
  slug: string;
  title: string;
  titleBn?: string | null;
  content: string;
  contentBn?: string | null;
  published: boolean;
  updatedAt: Date;
} | null;

const MANAGED_PAGES = [
  { slug: "privacy-policy", label: "Privacy Policy", description: "Data usage, cookies, user rights" },
  { slug: "terms-of-use", label: "Terms of Use", description: "Website usage terms and conditions" },
];

export default function PagesManager({ pages }: { pages: Record<string, PageContent> }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  const activePage = activeSlug ? pages[activeSlug] : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeSlug) return;
    const fd = new FormData(e.currentTarget);
    const published = (e.currentTarget.querySelector("#published") as HTMLInputElement)?.checked;
    fd.set("published", published ? "true" : "false");
    setFormError(null);
    setSaveSuccess(false);
    startTransition(async () => {
      const result = await upsertPageContent(activeSlug, fd);
      if (!result.success) { setFormError((result as any).error || "Failed to save"); return; }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-dark">Page Content</h1>
        <p className="text-gray-500 text-sm mt-1">Manage Privacy Policy and Terms of Use pages</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Page list */}
        <div className="space-y-3">
          {MANAGED_PAGES.map((page) => {
            const existing = pages[page.slug];
            return (
              <button
                key={page.slug}
                onClick={() => { setActiveSlug(page.slug); setFormError(null); setSaveSuccess(false); }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${activeSlug === page.slug ? "border-primary bg-blue-50" : "border-gray-100 bg-white hover:border-gray-200"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-dark text-sm">{page.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{page.description}</p>
                    <p className="text-xs text-gray-400 mt-1">/{page.slug}</p>
                  </div>
                  {existing && (
                    existing.published
                      ? <Eye className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : <EyeOff className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                {existing && (
                  <p className="text-xs text-gray-400 mt-2">Last updated: {new Date(existing.updatedAt).toLocaleDateString()}</p>
                )}
                {!existing && <p className="text-xs text-orange-500 mt-2">Not created yet</p>}
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {!activeSlug ? (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a page to edit</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-poppins font-semibold text-lg text-dark mb-4">
                Edit: {MANAGED_PAGES.find(p => p.slug === activeSlug)?.label}
              </h2>
              {formError && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{formError}</div>}
              {saveSuccess && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm">✓ Saved successfully!</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title * <span className="text-gray-400 font-normal">(English)</span></Label>
                  <Input id="title" name="title" required defaultValue={activePage?.title || MANAGED_PAGES.find(p => p.slug === activeSlug)?.label || ""} placeholder="Page title" />
                </div>
                <div>
                  <Label htmlFor="titleBn">Page Title <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                  <Input id="titleBn" name="titleBn" defaultValue={activePage?.titleBn || ""} placeholder="বাংলায় লিখুন" />
                </div>
                <div>
                  <Label htmlFor="content">Content (HTML) * <span className="text-gray-400 font-normal">(English)</span></Label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={20}
                    defaultValue={activePage?.content || ""}
                    placeholder={`<h2>Section Title</h2>\n<p>Your content here...</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>`}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                  <p className="text-xs text-gray-400 mt-1">Write HTML directly. Tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;a&gt; are fully supported and styled automatically.</p>
                </div>
                <div>
                  <Label htmlFor="contentBn">Content (HTML) <span className="text-gray-400 font-normal">(বাংলা)</span></Label>
                  <textarea
                    id="contentBn"
                    name="contentBn"
                    rows={20}
                    defaultValue={activePage?.contentBn || ""}
                    placeholder="বাংলায় লিখুন"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional Bangla translation of the page content.</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="published" name="published" defaultChecked={activePage?.published ?? true} className="w-4 h-4 rounded" />
                    <Label htmlFor="published" className="cursor-pointer">Published (visible to public)</Label>
                  </div>
                  <Button type="submit" variant="primary" disabled={isPending}>
                    {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Page"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
