"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users, Download, CheckCircle, XCircle, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateVolunteerStatus } from "@/actions/admin/volunteers";

type Volunteer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profession: string | null;
  skills: string[];
  interest: string[];
  availability: string | null;
  status: string;
  createdAt: Date;
};

const statusVariant: Record<string, any> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  ACTIVE: "active",
};

type Filter = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium animate-in slide-in-from-bottom-4 ${type === "success" ? "bg-green-600" : "bg-red-500"}`}>
      {type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

function formatDateShort(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function VolunteersManager({ volunteers }: { volunteers: Volunteer[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function handleStatusUpdate(vol: Volunteer, status: string) {
    startTransition(async () => {
      const result = await updateVolunteerStatus(vol.id, status);
      if (result.success) {
        showToast(`${vol.fullName} marked as ${status.toLowerCase()}`, "success");
        router.refresh();
      } else {
        showToast("Failed to update status. Please try again.", "error");
      }
    });
  }

  function exportCSV() {
    const rows = filtered.map((v) => [
      `"${v.fullName}"`,
      `"${v.email}"`,
      `"${v.phone}"`,
      `"${v.profession || ""}"`,
      `"${v.skills.join("; ")}"`,
      `"${v.interest.join("; ")}"`,
      `"${v.availability || ""}"`,
      `"${v.status}"`,
      `"${formatDateShort(v.createdAt)}"`,
    ].join(","));

    const header = "Name,Email,Phone,Profession,Skills,Interest,Availability,Status,Applied";
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `volunteers-${filter.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} volunteer${filtered.length !== 1 ? "s" : ""} to CSV`, "success");
  }

  const filtered = filter === "ALL"
    ? volunteers
    : volunteers.filter((v) => v.status === filter);

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === "PENDING").length,
    approved: volunteers.filter((v) => v.status === "APPROVED" || v.status === "ACTIVE").length,
    rejected: volunteers.filter((v) => v.status === "REJECTED").length,
  };

  const filters: { label: string; value: Filter; count: number; color: string }[] = [
    { label: "All", value: "ALL", count: stats.total, color: "bg-blue-50 text-primary border-primary" },
    { label: "Pending", value: "PENDING", count: stats.pending, color: "bg-yellow-50 text-yellow-700 border-yellow-400" },
    { label: "Approved", value: "APPROVED", count: stats.approved, color: "bg-green-50 text-green-700 border-green-400" },
    { label: "Rejected", value: "REJECTED", count: stats.rejected, color: "bg-red-50 text-red-600 border-red-400" },
  ];

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-dark">Volunteers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage volunteer applications</p>
        </div>
        <Button variant="primary" size="sm" onClick={exportCSV} disabled={filtered.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV {filter !== "ALL" ? `(${filter})` : ""}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-50 text-primary", icon: Users },
          { label: "Pending", value: stats.pending, color: "bg-yellow-50 text-yellow-700", icon: Clock },
          { label: "Approved", value: stats.approved, color: "bg-green-50 text-green-700", icon: CheckCircle },
          { label: "Rejected", value: stats.rejected, color: "bg-red-50 text-red-600", icon: XCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-2xl font-poppins font-black">{stat.value}</p>
                <Icon className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              filter === f.value
                ? f.color + " border-current"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === f.value ? "bg-current/10" : "bg-gray-100 text-gray-500"}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-dark">
            {filter === "ALL" ? "All Applications" : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Applications`}
            {" "}({filtered.length})
          </h2>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    No {filter !== "ALL" ? filter.toLowerCase() : ""} volunteer applications
                  </td>
                </tr>
              ) : (
                filtered.map((vol) => (
                  <tr key={vol.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-green/10 rounded-lg flex items-center justify-center text-green font-bold text-sm">
                          {vol.fullName[0]}
                        </div>
                        <span className="font-medium text-dark">{vol.fullName}</span>
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
                    <td className="py-3 px-4 text-gray-400 text-xs">{formatDateShort(vol.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant[vol.status]}>{vol.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5">
                        {vol.status !== "APPROVED" && vol.status !== "ACTIVE" && (
                          <button
                            onClick={() => handleStatusUpdate(vol, "APPROVED")}
                            disabled={isPending}
                            className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2.5 py-1 rounded-lg transition-colors font-medium disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {vol.status !== "REJECTED" && (
                          <button
                            onClick={() => handleStatusUpdate(vol, "REJECTED")}
                            disabled={isPending}
                            className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2.5 py-1 rounded-lg transition-colors font-medium disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                        {vol.status === "APPROVED" && (
                          <button
                            onClick={() => handleStatusUpdate(vol, "PENDING")}
                            disabled={isPending}
                            className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2.5 py-1 rounded-lg transition-colors font-medium disabled:opacity-50"
                          >
                            Reset
                          </button>
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
