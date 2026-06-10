import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Heart,
  Users,
  FileText,
  ImageIcon,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

async function getDashboardData() {
  const [
    donationStats,
    volunteerCount,
    blogCount,
    galleryCount,
    contactCount,
    recentDonations,
    recentVolunteers,
    recentContacts,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.volunteer.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.galleryImage.count(),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { program: true },
    }),
    prisma.volunteer.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { isRead: false },
    }),
  ]);

  return {
    totalDonations: Number(donationStats._sum.amount || 0),
    donationCount: donationStats._count,
    volunteerCount,
    blogCount,
    galleryCount,
    contactCount,
    recentDonations,
    recentVolunteers,
    recentContacts,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  let data;
  try {
    data = await getDashboardData();
  } catch {
    data = {
      totalDonations: 0,
      donationCount: 0,
      volunteerCount: 0,
      blogCount: 0,
      galleryCount: 0,
      contactCount: 0,
      recentDonations: [],
      recentVolunteers: [],
      recentContacts: [],
    };
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">
          Welcome back, {session?.user?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening at Dola Foundation today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Donations"
          value={formatCurrency(data.totalDonations)}
          icon={Heart}
          trend="From all time"
          color="text-[#F4B400]"
          bgColor="bg-yellow-50"
        />
        <StatsCard
          title="Volunteers"
          value={data.volunteerCount}
          icon={Users}
          trend={`${data.volunteerCount} registered`}
          trendUp
          color="text-[#1F9D55]"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="Blog Posts"
          value={data.blogCount}
          icon={FileText}
          color="text-[#0F3D8C]"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Unread Messages"
          value={data.contactCount}
          icon={MessageSquare}
          color="text-purple-500"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-poppins font-semibold text-lg text-[#1A1A2E]">
              Recent Donations
            </h2>
            <a href="/admin/donations" className="text-[#0F3D8C] text-sm hover:underline">
              View all →
            </a>
          </div>
          {data.recentDonations.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">No donations yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentDonations.map((donation: any) => (
                <div key={donation.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-[#F4B400]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-[#F4B400]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#1A1A2E] truncate">{donation.donorName}</p>
                    <p className="text-xs text-gray-400">{donation.method.replace("_", " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#0F3D8C]">
                      {formatCurrency(Number(donation.amount))}
                    </p>
                    <Badge variant={donation.status.toLowerCase() as any} className="text-xs">
                      {donation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Volunteers */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-poppins font-semibold text-lg text-[#1A1A2E]">
              New Volunteers
            </h2>
            <a href="/admin/volunteers" className="text-[#0F3D8C] text-sm hover:underline">
              View all →
            </a>
          </div>
          {data.recentVolunteers.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">No volunteers yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentVolunteers.map((vol: any) => (
                <div key={vol.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-[#1F9D55]/10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-[#1F9D55]">
                    {vol.fullName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#1A1A2E] truncate">{vol.fullName}</p>
                    <p className="text-xs text-gray-400">{vol.profession || vol.email}</p>
                  </div>
                  <Badge variant={vol.status.toLowerCase() as any}>
                    {vol.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unread Messages */}
        <div className="bg-white rounded-2xl shadow-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-poppins font-semibold text-lg text-[#1A1A2E]">
              Unread Messages
            </h2>
            <a href="/admin/contacts" className="text-[#0F3D8C] text-sm hover:underline">
              View all →
            </a>
          </div>
          {data.recentContacts.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">No unread messages</p>
          ) : (
            <div className="space-y-3">
              {data.recentContacts.map((contact: any) => (
                <div key={contact.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-[#1A1A2E]">{contact.name}</p>
                      <span className="text-xs text-gray-400">{formatDate(contact.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{contact.subject}</p>
                    <p className="text-xs text-gray-400 truncate">{contact.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
