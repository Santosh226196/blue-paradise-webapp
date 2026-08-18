import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  amount: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ServiceCard({ title, description, amount, icon, selected, onClick, className }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "liquid-glass relative overflow-hidden p-5 text-left w-full transition-all duration-200",
        "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2",
        "min-h-[44px]",
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
          <h3 className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{description}</p>
        </div>
        <p className="text-lg font-bold font-mono whitespace-nowrap" style={{ color: "var(--accent-coral)" }}>{amount}</p>
      </div>
    </button>
  );
}
