"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

interface FooterSettings {
  siteName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  footerMissionText?: string | null;
}

const DEFAULT_PROGRAMS = [
  { label: "Education", href: "/programs/education" },
  { label: "Healthcare", href: "/programs/healthcare" },
  { label: "Charity & Relief", href: "/programs/charity-relief" },
];

export default function Footer({
  settings,
  programs: dbPrograms,
}: {
  settings?: FooterSettings | null;
  programs?: { label: string; href: string }[];
}) {
  const programs = dbPrograms && dbPrograms.length > 0 ? dbPrograms : DEFAULT_PROGRAMS;

  const siteName = settings?.siteName || "Dola Foundation";
  const tagline = settings?.tagline || "Empowering Lives";
  const contactAddress = settings?.address || "Dhaka, Bangladesh";
  const contactPhone = settings?.phone || "+880 1700-000000";
  const contactEmail = settings?.email || "info@dolafoundation.com";

  const configuredSocials = [
    { icon: Facebook, href: settings?.facebookUrl, label: "Facebook" },
    { icon: Instagram, href: settings?.instagramUrl, label: "Instagram" },
    { icon: Twitter, href: settings?.twitterUrl, label: "Twitter" },
    { icon: Youtube, href: settings?.youtubeUrl, label: "YouTube" },
  ];
  const socialLinks = configuredSocials.some((social) => social.href)
    ? configuredSocials
        .filter((social) => social.href)
        .map((social) => ({ ...social, href: social.href as string }))
    : configuredSocials.map((social) => ({ ...social, href: "#" }));

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo + About */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={siteName}
                  className="h-10 w-10 object-contain rounded-xl flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
              )}
              <div>
                <span className="font-poppins font-bold text-lg leading-none block text-white">
                  {siteName}
                </span>
                <span className="text-xs text-gray-400">{tagline}</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {settings?.footerMissionText ||
                "We are dedicated to empowering communities through sustainable development, education, healthcare, and social welfare programs across Bangladesh."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-5 text-base relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gold -mb-2"></span>
            </h3>
            <ul className="space-y-2.5 mt-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-gold opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-5 text-base relative">
              Our Programs
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gold -mb-2"></span>
            </h3>
            <ul className="space-y-2.5 mt-4">
              {programs.map((program) => (
                <li key={program.href}>
                  <Link
                    href={program.href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-gold opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {program.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/programs" className="text-gold/70 hover:text-gold text-xs transition-colors">
                  View all programs →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact + Newsletter */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-5 text-base relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gold -mb-2"></span>
            </h3>
            <ul className="space-y-3 mt-4 mb-6">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:${contactPhone.replace(/[^+0-9]/g, "")}`} className="hover:text-gold transition-colors">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-gold transition-colors">
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
              Built with ❤️ for a better world.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/terms-of-use" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
