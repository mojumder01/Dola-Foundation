"use client";

import { useState } from "react";
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
  Send,
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

const programs = [
  { label: "Education", href: "/programs/education" },
  { label: "Healthcare", href: "/programs/healthcare" },
  { label: "Charity & Relief", href: "/programs/charity-relief" },
  { label: "Environment", href: "/programs/environment" },
  { label: "Youth Development", href: "/programs/youth-development" },
  { label: "Orphan Care", href: "/programs/orphan-care" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#1A1A2E] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo + About */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#0F3D8C] rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-[#F4B400]" />
              </div>
              <div>
                <span className="font-poppins font-bold text-lg leading-none block text-white">
                  Dola Foundation
                </span>
                <span className="text-xs text-gray-400">Empowering Lives</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              We are dedicated to empowering communities through sustainable
              development, education, healthcare, and social welfare programs
              across Bangladesh.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#0F3D8C] hover:text-white transition-all duration-300 hover:-translate-y-0.5"
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
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4B400] -mb-2"></span>
            </h3>
            <ul className="space-y-2.5 mt-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#F4B400] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#F4B400] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
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
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4B400] -mb-2"></span>
            </h3>
            <ul className="space-y-2.5 mt-4">
              {programs.map((program) => (
                <li key={program.href}>
                  <Link
                    href={program.href}
                    className="text-gray-400 hover:text-[#F4B400] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#F4B400] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact + Newsletter */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-5 text-base relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4B400] -mb-2"></span>
            </h3>
            <ul className="space-y-3 mt-4 mb-6">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#F4B400] mt-0.5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#F4B400] flex-shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-[#F4B400] transition-colors">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#F4B400] flex-shrink-0" />
                <a href="mailto:info@dolafoundation.org" className="hover:text-[#F4B400] transition-colors">
                  info@dolafoundation.org
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <h4 className="font-poppins font-semibold text-white mb-3 text-sm">
              Newsletter
            </h4>
            {subscribed ? (
              <p className="text-green-400 text-sm">
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F4B400] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F4B400] hover:bg-[#e5a900] text-[#1A1A2E] rounded-xl p-2.5 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Dola Foundation. All rights reserved.
              Built with ❤️ for a better world.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
