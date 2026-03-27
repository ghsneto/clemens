import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  delta: string;
  positive?: boolean;
}

export function StatCard({ title, value, icon: Icon, delta, positive = true }: StatCardProps) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className={`grid h-10 w-10 place-content-center rounded-full ${positive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className={`flex items-center gap-1 text-sm ${positive ? "text-emerald-600" : "text-rose-500"}`}>
        {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {delta}
      </p>
    </Card>
  );
}
