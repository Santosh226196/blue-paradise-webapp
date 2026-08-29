import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
  /** Extra classes for the outer wrapper div */
  wrapperClassName?: string;
  /** Render a suffix element inside the input (e.g. toggle button) */
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      className,
      wrapperClassName,
      suffix,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      props.name ||
      (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-fg-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-fg-muted"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl text-sm font-medium min-h-11",
              "transition-all duration-200 outline-none",
              "placeholder:text-fg-muted",
              Icon ? "pl-11" : "px-4",
              suffix ? "pr-11" : "",
              error
                ? "border-2 border-red-400/60 bg-red-500/5"
                : "border border-input-border bg-input focus:border-input-focus focus:bg-glass-hover",
              className,
            )}
            style={
              error
                ? undefined
                : { color: "var(--text-primary)" }
            }
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
