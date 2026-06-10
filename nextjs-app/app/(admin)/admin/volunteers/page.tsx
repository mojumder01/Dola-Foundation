import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getVolunteers() {
  try {
    return await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

const statusVariant: Record<string, any> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
};

export default async function AdminVolunteersPage() {
  const volunteers = await getVolunteers();

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === "PENDING").length,
    approved: volunteers.filter((v) => v.status === "APPROVED" || v.status === "ACTIVE").length,
    rejected: volunteers.filter((v) => v.status === "REJECTED").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-[#1A1A2E]">Volunteers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage volunteer applications</p>
        </div>
        <Button variant="primary" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-50 text-[#0F3D8C]" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
          { label: "Approved", value: stats.approved, color: "bg-green-50 text-[#1F9D55]" },
          { label: "Rejected", value: stats.rejected, color: "bg-red-50 text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
            <p className="text-2xl font-poppins font-black">{stat.value}</p>
            <p className="text-sm mt-0.5 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Users className="w-5 h-5 text-[#0F3D8C]" />
          <h2 className="font-semibold text-[#1A1A2E]">All Applications ({volunteers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Profession</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Skills</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Availability</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Applied</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    No volunteer applications yet
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#1F9D55]/10 rounded-lg flex items-center justify-center text-[#1F9D55] font-bold text-sm">
                          {vol.fullName[0]}
                        </div>
                        <span className="font-medium text-[#1A1A2E]">{vol.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        <p className="text-gray-600">{vol.email}</p>
                        <p className="text-gray-400">{vol.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{vol.profession || "—"}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {vol.skills.slice(0, 2).map((skill) => (
                          <span key={skill} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {vol.skills.length > 2 && (
                          <span className="text-gray-400 text-xs">+{vol.skills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{vol.availability || "—"}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(vol.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[vol.status]}>{vol.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {vol.status === "PENDING" && (
                          <>
                            <form>
                              <input type="hidden" name="id" value={vol.id} />
                              <input type="hidden" name="status" value="APPROVED" />
                              <button
                                type="submit"
                                className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded-lg transition-colors font-medium"
                              >
                                Approve
                              </button>
                            </form>
                            <form>
                              <input type="hidden" name="id" value={vol.id} />
                              <input type="hidden" name="status" value="REJECTED" />
                              <button
                                type="submit"
                                className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg transition-colors font-medium"
                              >
                                Reject
                              </button>
                            </form>
                          </>
                        )}
                      </div>
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
