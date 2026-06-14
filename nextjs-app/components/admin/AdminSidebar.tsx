"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import {
  LayoutDashboard,
  BookOpen,
  ImageIcon,
  FileText,
  Users,
  Heart,
  Settings,
  LogOut,
  Layers,
  Star,
  UserCircle,
  Globe,
  ShieldCheck,
  MessageSquare,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Programs", href: "/admin/programs", icon: Layers },
  { label: "Projects", href: "/admin/projects", icon: Globe },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Videos", href: "/admin/videos", icon: Youtube },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Donations", href: "/admin/donations", icon: Heart },
  { label: "Team", href: "/admin/team", icon: UserCircle },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: ShieldCheck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="font-poppins font-bold text-sm">Dola Foundation</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-white shadow-blue"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all mb-1"
        >
          <Globe className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={() => signOutAction()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
