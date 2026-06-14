import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
