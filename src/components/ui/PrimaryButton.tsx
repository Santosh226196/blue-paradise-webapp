import { type ButtonHTMLAttributes, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PrimaryButton({
  children,
  loading,
  fullWidth,
  size = "md",
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (btn) {
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);animation:ripple 0.6s ease-out;pointer-events:none;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    props.onClick?.(e);
  }

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg min-h-[36px]",
    md: "px-6 py-3 text-sm rounded-xl min-h-[44px]",
    lg: "px-8 py-4 text-base rounded-2xl min-h-[52px]",
  };

  return (
    <button
      ref={btnRef}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold",
        "text-white shadow-lg transition-all duration-200",
        "active:scale-[0.97] hover:brightness-110 hover:shadow-xl",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:brightness-100",
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #FF7A59 0%, #E85D3A 50%, #FF6B4A 100%)",
        outlineColor: "var(--accent-aqua)",
      }}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
