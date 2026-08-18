import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export function GhostButton({ children, fullWidth, size = "md", className, ...props }: GhostButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg min-h-[36px]",
    md: "px-6 py-3 text-sm rounded-xl min-h-[44px]",
    lg: "px-8 py-4 text-base rounded-2xl min-h-[52px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold",
        "liquid-glass transition-all duration-200",
        "active:scale-[0.97] hover:brightness-110",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      style={{ color: "var(--text-primary)", outlineColor: "var(--accent-aqua)" }}
      {...props}
    >
      {children}
    </button>
  );
}
