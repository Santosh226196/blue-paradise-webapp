import { cn } from "@/lib/utils";
import type { EmptyStateProps } from "@/types";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-up",
        className,
      )}
    >
      {icon && (
        <div
          className="mb-5 p-4 rounded-2xl animate-float-gentle"
          style={{
            background: "var(--glow-aqua)",
            color: "var(--accent-aqua)",
          }}
        >
          {icon}
        </div>
      )}
      <h3
        className="text-lg font-bold mb-1.5 text-fg"
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-6 text-fg-dim"
      >
        {description}
      </p>
      {action}
    </div>
  );
}
