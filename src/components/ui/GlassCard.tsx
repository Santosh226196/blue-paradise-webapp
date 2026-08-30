import { cn } from "@/lib/utils";
import type { GlassCardProps } from "@/types";

export function GlassCard({
  children,
  className,
  padding = true,
  animate = true,
  style,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "liquid-glass relative overflow-hidden",
        padding && "p-6",
        animate && "animate-fade-up",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
