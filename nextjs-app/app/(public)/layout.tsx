import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getLocale, pickLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

async function getNavPrograms(locale: Awaited<ReturnType<typeof getLocale>>) {
  try {
    const programs = await prisma.program.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { title: true, titleBn: true, slug: true },
    });
    return programs.map((p) => ({
      label: pickLocale(p.title, p.titleBn, locale),
      href: `/programs/${p.slug}`,
    }));
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
  const locale = await getLocale();
  const [settings, navPrograms] = await Promise.all([getSettings(), getNavPrograms(locale)]);

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
          siteName={settings ? pickLocale(settings.siteName, settings.siteNameBn, locale) : undefined}
          tagline={settings ? pickLocale(settings.tagline, settings.taglineBn, locale) : undefined}
          programs={navPrograms}
          locale={locale}
        />
        <main className="flex-1">{children}</main>
        <Footer
          programs={navPrograms}
          locale={locale}
          settings={
            settings
              ? {
                  siteName: pickLocale(settings.siteName, settings.siteNameBn, locale),
                  tagline: pickLocale(settings.tagline, settings.taglineBn, locale),
                  logoUrl: settings.logoUrl,
                  address: settings.address,
                  phone: settings.phone,
                  email: settings.email,
                  facebookUrl: settings.facebookUrl,
                  instagramUrl: settings.instagramUrl,
                  twitterUrl: settings.twitterUrl,
                  youtubeUrl: settings.youtubeUrl,
                  footerMissionText: pickLocale(settings.footerMissionText, settings.footerMissionTextBn, locale),
                }
              : null
          }
        />
      </div>
    </>
  );
}
