import { cn } from "@/lib/utils";
import type { AuthButtonProps } from "@/types";

export function AuthButton({ children, loading, className, disabled, ...props }: AuthButtonProps) {
  return (
    <button
      className={cn(
        "w-full py-3 rounded-xl text-sm font-bold min-h-11 cursor-pointer",
        "inline-flex items-center justify-center gap-2",
        "transition-all duration-200",
        "active:scale-[0.98]",
        "shadow-lg hover:shadow-xl",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        className
      )}
      style={{
        background: "var(--accent-aqua)",
        color: "var(--bg-deep)",
      }}
      disabled={disabled || loading}
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
