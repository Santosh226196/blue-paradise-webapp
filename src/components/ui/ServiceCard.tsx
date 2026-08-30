import { cn } from "@/lib/utils";
import type { ServiceCardProps } from "@/types";

export function ServiceCard({ title, description, amount, icon, selected, onClick, className }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "liquid-glass relative overflow-hidden p-5 text-left w-full transition-all duration-200 cursor-pointer",
        "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2",
        "min-h-11",
        selected && "animate-pulse-glow",
        className
      )}
      style={{
        outlineColor: "var(--accent-aqua)",
        borderColor: selected ? "var(--accent-aqua)" : undefined,
        background: selected ? "var(--glow-aqua)" : undefined,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="rounded-xl p-3 transition-all duration-200"
          style={{
            background: selected ? "var(--accent-aqua)" : "var(--glass-bg-hover)",
            color: selected ? "white" : "var(--text-secondary)",
            transform: selected ? "scale(1.05)" : "scale(1)",
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[15px] text-fg">{title}</h3>
          <p className="text-xs mt-1 text-fg-dim">{description}</p>
        </div>
        <p className="text-lg font-bold font-mono whitespace-nowrap text-danger">{amount}</p>
      </div>
    </button>
  );
}
