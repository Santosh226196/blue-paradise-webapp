import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/types";

const sizeClasses = {
  sm: "px-4 py-2 text-xs rounded-lg min-h-9",
  md: "px-6 py-3 text-sm rounded-xl min-h-11",
  lg: "px-8 py-4 text-base rounded-2xl min-h-13",
};

export function Button({
  children,
  variant = "primary",
  loading,
  fullWidth,
  size = "md",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (variant === "primary" && btnRef.current) {
      const btn = btnRef.current;
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const s = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - rect.left - s / 2}px;top:${e.clientY - rect.top - s / 2}px;position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);animation:ripple 0.6s ease-out;pointer-events:none;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    props.onClick?.(e);
  }

  const variants = {
    primary: cn(
      "relative overflow-hidden font-bold text-white shadow-lg",
      "hover:brightness-110 hover:shadow-xl",
      "active:scale-[0.97]",
      "disabled:hover:brightness-100",
    ),
    ghost: cn(
      "font-semibold liquid-glass",
      "hover:brightness-110",
      "active:scale-[0.97]",
    ),
    outline: cn("font-semibold", "hover:brightness-110", "active:scale-[0.97]"),
  };

  const variantStyles = {
    primary: {
      background: "var(--accent-coral)",
      color: "#fff",
      outlineColor: "var(--accent-aqua)",
    },
    ghost: {
      color: "var(--text-primary)",
      outlineColor: "var(--accent-aqua)",
    },
    outline: {
      background: "var(--glass-bg)",
      border: "1px solid var(--glass-border)",
      color: "var(--text-secondary)",
      outlineColor: "var(--accent-aqua)",
    },
  };

  return (
    <button
      ref={btnRef}
      className={cn(
        "inline-flex items-center justify-center gap-2 cursor-pointer",
        "transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        sizeClasses[size],
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      style={variantStyles[variant]}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
