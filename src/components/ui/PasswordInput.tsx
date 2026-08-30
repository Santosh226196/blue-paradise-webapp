import { forwardRef, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "icon"> {
  /** Show the lock icon (default true) */
  showIcon?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showIcon = true, suffix, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        icon={showIcon ? Lock : undefined}
        className={className}
        suffix={
          suffix ?? (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              aria-label={visible ? "Hide password" : "Show password"}
              tabIndex={-1}
              className="p-1 rounded-lg transition-colors text-fg-muted hover:text-fg cursor-pointer"
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
