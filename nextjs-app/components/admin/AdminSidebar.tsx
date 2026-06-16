"use client";

import { useState } from "react";
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
  HelpCircle,
  CreditCard,
  BookMarked,
  Gift,
  ChevronDown,
  FolderKanban,
  LayoutGrid,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const topItem = { label: "Dashboard", href: "/admin", icon: LayoutDashboard };

const navGroups = [
  {
    label: "Content",
    icon: FolderKanban,
    items: [
      { label: "Programs", href: "/admin/programs", icon: Layers },
      { label: "Projects", href: "/admin/projects", icon: Globe },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Videos", href: "/admin/videos", icon: Youtube },
    ],
  },
  {
    label: "Fundraising",
    icon: Heart,
    items: [
      { label: "Donations", href: "/admin/donations", icon: Heart },
      { label: "Donation Impact", href: "/admin/donation-impact", icon: Gift },
      { label: "Payment Methods", href: "/admin/payment-methods", icon: CreditCard },
    ],
  },
  {
    label: "Community",
    icon: Users,
    items: [
      { label: "Volunteers", href: "/admin/volunteers", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
      { label: "Team", href: "/admin/team", icon: UserCircle },
      { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Site",
    icon: BookOpen,
    items: [
      { label: "Pages", href: "/admin/pages", icon: BookMarked },
      { label: "Volunteer Page", href: "/admin/volunteer-page", icon: HeartHandshake },
      { label: "Content Sections", href: "/admin/content", icon: LayoutGrid },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Admin Access",
    icon: ShieldCheck,
    items: [{ label: "Users", href: "/admin/users", icon: ShieldCheck }],
  },
];

function isItemActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  indent,
}: {
  href: string;
  label: string;
  icon: any;
  isActive: boolean;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        indent && "pl-9",
        isActive
          ? "bg-primary text-white shadow-blue"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      initial[group.label] = group.items.some((item) => isItemActive(pathname, item.href));
    });
    return initial;
  });

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

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
          <li>
            <NavLink
              href={topItem.href}
              label={topItem.label}
              icon={topItem.icon}
              isActive={isItemActive(pathname, topItem.href)}
            />
          </li>
        </ul>

        <div className="mt-4 space-y-1">
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.label];
            const groupHasActive = group.items.some((item) => isItemActive(pathname, item.href));

            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all",
                    groupHasActive ? "text-white" : "text-gray-500 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <GroupIcon className="w-4 h-4 flex-shrink-0" />
                    {group.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      isOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
                {isOpen && (
                  <ul className="space-y-1 mt-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          isActive={isItemActive(pathname, item.href)}
                          indent
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
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
