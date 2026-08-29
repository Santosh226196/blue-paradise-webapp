import { cn } from "@/lib/utils";
import type { StatCardProps } from "@/types";

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("liquid-glass relative overflow-hidden p-5 animate-fade-up", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{label}</p>
          <p className="text-2xl font-bold font-display text-fg">{value}</p>
          {trend && (
            <p className="text-xs font-bold" style={{ color: trend.positive ? "var(--accent-aqua)" : "var(--accent-coral)" }}>
              {trend.positive ? "+" : ""}{trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div
            className="rounded-xl p-2.5 animate-float-gentle"
            style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
          >
            {icon}
          </div>
        )}
      </div>
      {/* Decorative gradient stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
        style={{ background: "linear-gradient(90deg, var(--accent-aqua), var(--accent-pool), transparent)" }}
      />
    </div>
  );
}
