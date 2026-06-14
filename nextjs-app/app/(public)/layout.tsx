import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getNavPrograms() {
  try {
    const programs = await prisma.program.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { title: true, slug: true },
    });
    return programs.map((p) => ({ label: p.title, href: `/programs/${p.slug}` }));
  } catch {
    return [];
  }
}

function hexToRgb(hex: string): string {
  try {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  } catch {
    return '15 61 140';
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navPrograms] = await Promise.all([getSettings(), getNavPrograms()]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --tw-primary: ${hexToRgb(settings?.primaryColor ?? '#0F3D8C')};
          --tw-gold: ${hexToRgb(settings?.accentColor ?? '#F4B400')};
          --tw-green: ${hexToRgb(settings?.secondaryColor ?? '#1F9D55')};
        }
      `}} />
      <div className="min-h-screen flex flex-col">
        <Navbar
          logoUrl={settings?.logoUrl}
          siteName={settings?.siteName}
          tagline={settings?.tagline}
          programs={navPrograms}
        />
        <main className="flex-1">{children}</main>
        <Footer
          settings={
            settings
              ? {
                  siteName: settings.siteName,
                  tagline: settings.tagline,
                  logoUrl: settings.logoUrl,
                  address: settings.address,
                  phone: settings.phone,
                  email: settings.email,
                  facebookUrl: settings.facebookUrl,
                  instagramUrl: settings.instagramUrl,
                  twitterUrl: settings.twitterUrl,
                  youtubeUrl: settings.youtubeUrl,
                }
              : null
          }
        />
      </div>
    </>
  );
}
