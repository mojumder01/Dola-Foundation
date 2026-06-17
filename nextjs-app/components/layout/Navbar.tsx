"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavChild = { label: string; href: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

const BASE_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  logoUrl?: string | null;
  siteName?: string | null;
  tagline?: string | null;
  programs?: { label: string; href: string }[];
  donationsEnabled?: boolean;
}

export default function Navbar({ logoUrl, siteName, tagline, programs, donationsEnabled = true }: NavbarProps) {
  const programChildren = programs && programs.length > 0 ? programs : [
    { label: "Education", href: "/programs/education" },
    { label: "Healthcare", href: "/programs/healthcare" },
    { label: "Charity & Relief", href: "/programs/charity-relief" },
  ];
  const brandName = siteName || "Dola Foundation";
  const brandTagline = tagline || "Empowering Lives";
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    BASE_NAV[0],
    BASE_NAV[1],
    { label: "Programs", href: "/programs", children: programChildren },
    ...BASE_NAV.slice(2),
  ];

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-2"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="h-10 w-10 object-contain rounded-xl"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
              )}
              <div>
                <span className="font-poppins font-bold text-lg leading-none block text-dark">
                  {brandName}
                </span>
                <span className="text-xs leading-none text-gray-500">
                  {brandTagline}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href} className="relative group">
                  {link.children ? (
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:text-primary hover:bg-blue-50",
                        pathname.startsWith(link.href) && "text-primary bg-blue-50"
                      )}
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </Link>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:text-primary hover:bg-blue-50",
                        pathname === link.href && "text-primary bg-blue-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.children && (
                    <div
                      className="absolute top-full left-0 pt-2 hidden group-hover:block"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[200px] py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {donationsEnabled && (
                <Link href="/donate" className="hidden sm:block">
                  <Button
                    variant="default"
                    size="sm"
                    className="font-semibold text-sm"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={brandName}
                      className="h-9 w-9 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                      <Heart className="w-4 h-4 text-gold" />
                    </div>
                  )}
                  <span className="font-poppins font-bold text-dark">
                    {brandName}
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.children ? (
                      <div className="mb-1">
                        <div className="flex items-center justify-between px-4 py-3 text-gray-700 font-medium rounded-xl">
                          <span>{link.label}</span>
                        </div>
                        <div className="pl-4">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-xl font-medium transition-colors mb-1",
                          pathname === link.href
                            ? "bg-blue-50 text-primary"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {donationsEnabled && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-primary to-green rounded-2xl text-white">
                    <p className="font-poppins font-semibold text-lg mb-1">
                      Make a Difference
                    </p>
                    <p className="text-sm text-white/80 mb-4">
                      Your donation changes lives
                    </p>
                    <Link href="/donate">
                      <Button
                        variant="default"
                        className="w-full"
                        size="sm"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Donate Now
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
