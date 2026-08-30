import { cn } from "@/lib/utils";
import type { SkeletonGlassProps } from "@/types";

export function SkeletonGlass({ className, lines = 1 }: SkeletonGlassProps) {
  return (
    <div className={cn("liquid-glass relative overflow-hidden p-6 space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg animate-shimmer-bg"
          style={{
            background: "var(--glass-bg-hover)",
            width: `${70 + Math.random() * 30}%`,
          }}
        />
      ))}
    </div>
  );
}
