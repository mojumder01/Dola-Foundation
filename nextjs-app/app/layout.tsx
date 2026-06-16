import type { Metadata } from "next";
import { Poppins, Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale } from "@/lib/locale";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-bengali",
  display: "swap",
});

async function getFaviconUrl(): Promise<string | null> {
  try {
    const settings = await prisma.siteSettings.findFirst({ select: { faviconUrl: true } as any });
    return (settings as any)?.faviconUrl || null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: {
    default: "Dola Foundation | Empowering Lives, Inspiring Hope",
    template: "%s | Dola Foundation",
  },
  description:
    "Dola Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and sustainable development programs across Bangladesh.",
  keywords: [
    "NGO",
    "Bangladesh",
    "charity",
    "education",
    "healthcare",
    "development",
    "Dola Foundation",
    "volunteer",
    "donate",
  ],
  authors: [{ name: "Dola Foundation" }],
  creator: "Dola Foundation",
  publisher: "Dola Foundation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dolafoundation.com",
    siteName: "Dola Foundation",
    title: "Dola Foundation | Empowering Lives, Inspiring Hope",
    description:
      "Dola Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and sustainable development programs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dola Foundation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dola Foundation | Empowering Lives, Inspiring Hope",
    description:
      "Dola Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and sustainable development programs.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [faviconUrl, locale] = await Promise.all([getFaviconUrl(), getLocale()]);

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${inter.variable} ${notoBengali.variable}`}
    >
      <head>
        {faviconUrl && (
          <>
            <link rel="icon" href={faviconUrl} />
            <link rel="apple-touch-icon" href={faviconUrl} />
          </>
        )}
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
