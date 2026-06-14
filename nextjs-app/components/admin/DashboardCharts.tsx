"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

interface DashboardChartsProps {
  donationsByDay: { date: string; amount: number; count: number }[];
  volunteersByStatus: { status: string; count: number }[];
  donationsByMonth: { month: string; amount: number }[];
  topPrograms: { name: string; amount: number }[];
}

const COLORS = ["#0F3D8C", "#F4B400", "#1F9D55", "#EF4444", "#8B5CF6"];

const formatBDT = (v: number) =>
  v >= 1000 ? `৳${(v / 1000).toFixed(0)}K` : `৳${v}`;

export default function DashboardCharts({
  donationsByDay,
  volunteersByStatus,
  donationsByMonth,
  topPrograms,
}: DashboardChartsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      {/* Donations last 7 days */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1">Donations — Last 7 Days</h2>
        <p className="text-xs text-gray-400 mb-4">Daily donation amounts</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={donationsByDay} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatBDT} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Amount"]} />
            <Bar dataKey="amount" fill="#0F3D8C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volunteers by status */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1">Volunteers by Status</h2>
        <p className="text-xs text-gray-400 mb-4">Approval breakdown</p>
        {volunteersByStatus.every((v) => v.count === 0) ? (
          <p className="text-gray-400 text-center py-16 text-sm">No volunteers yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={volunteersByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {volunteersByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [v, "Volunteers"]} />
              <Legend formatter={(v) => v.charAt(0) + v.slice(1).toLowerCase()} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly donations trend */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1">Monthly Donations</h2>
        <p className="text-xs text-gray-400 mb-4">Last 6 months trend</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={donationsByMonth} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatBDT} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Total"]} />
            <Line type="monotone" dataKey="amount" stroke="#1F9D55" strokeWidth={2} dot={{ fill: "#1F9D55", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top programs by donation */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-poppins font-semibold text-lg text-dark mb-1">Top Programs</h2>
        <p className="text-xs text-gray-400 mb-4">By donation amount received</p>
        {topPrograms.length === 0 ? (
          <p className="text-gray-400 text-center py-16 text-sm">No donations yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topPrograms} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={formatBDT} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Amount"]} />
              <Bar dataKey="amount" fill="#F4B400" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
