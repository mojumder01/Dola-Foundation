import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/admin/StatsCard";

async function getDonations() {
  try {
    const [donations, stats] = await Promise.all([
      prisma.donation.findMany({
        include: { program: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
    ]);
    return { donations, totalAmount: Number(stats._sum.amount || 0), count: stats._count };
  } catch {
    return { donations: [], totalAmount: 0, count: 0 };
  }
}

const statusVariant: Record<string, any> = {
  PENDING: "pending",
  COMPLETED: "approved",
  FAILED: "rejected",
  REFUNDED: "upcoming",
};

export default async function AdminDonationsPage() {
  const { donations, totalAmount, count } = await getDonations();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">Donations</h1>
          <p className="text-gray-500 text-sm mt-1">Track all donation records</p>
        </div>
        <Button variant="primary" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gold/10 border border-gold/20 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">Total Raised</p>
          <p className="font-poppins font-black text-2xl text-primary mt-1">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">Total Donations</p>
          <p className="font-poppins font-black text-2xl text-primary mt-1">{count}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">Average Donation</p>
          <p className="font-poppins font-black text-2xl text-green mt-1">
            {count > 0 ? formatCurrency(Math.round(totalAmount / count)) : "৳0"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Heart className="w-5 h-5 text-gold" />
          <h2 className="font-semibold text-dark">All Donations ({donations.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Donor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Method</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Program</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Transaction ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No donations recorded yet
                  </td>
                </tr>
              ) : (
                donations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-dark">{d.donorName}</p>
                      <p className="text-xs text-gray-400">{d.donorEmail}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-primary">
                      {formatCurrency(Number(d.amount))}
                      {d.isRecurring && (
                        <span className="block text-xs text-gray-400 font-normal">Monthly</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{d.method.replace("_", " ")}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {d.program?.title || "General Fund"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs font-mono">
                      {d.transactionId || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(d.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[d.status]}>{d.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
