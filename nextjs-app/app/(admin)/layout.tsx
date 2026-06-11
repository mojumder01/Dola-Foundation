import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";

async function getThemeSettings() {
  try {
    return await prisma.siteSettings.findFirst({
      select: { primaryColor: true, accentColor: true, secondaryColor: true },
    });
  } catch {
    return null;
  }
}

function hexToRgb(hex: string): string {
  try {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  } catch {
    return "15 61 140";
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const theme = await getThemeSettings();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --tw-primary: ${hexToRgb(theme?.primaryColor ?? "#0F3D8C")};
          --tw-gold: ${hexToRgb(theme?.accentColor ?? "#F4B400")};
          --tw-green: ${hexToRgb(theme?.secondaryColor ?? "#1F9D55")};
        }
      `,
        }}
      />
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </>
  );
}
