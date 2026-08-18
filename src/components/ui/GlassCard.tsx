import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  animate?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className, padding = true, animate = true, style }: GlassCardProps) {
  return (
    <div className={cn("liquid-glass relative overflow-hidden", padding && "p-6", animate && "animate-fade-up", className)} style={style}>
      {children}
    </div>
  );
}
