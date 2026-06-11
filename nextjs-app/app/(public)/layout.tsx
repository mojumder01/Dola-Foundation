import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logoUrl={settings?.logoUrl}
        siteName={settings?.siteName}
        tagline={settings?.tagline}
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
  );
}
