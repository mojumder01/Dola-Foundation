import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  bgColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "text-[#0F3D8C]",
  bgColor = "bg-blue-50",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", bgColor)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="font-poppins font-black text-2xl text-[#1A1A2E] mt-0.5">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {trend && (
          <p className={cn("text-xs mt-1", trendUp ? "text-green-500" : "text-red-400")}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}
