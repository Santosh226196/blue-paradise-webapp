import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui/Input";
import type { LucideIcon } from "lucide-react";

export interface AuthInputProps extends Omit<InputProps, "icon"> {
  label: string;
  icon: LucideIcon;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, ...props }, ref) => {
    return <Input ref={ref} label={label} icon={icon} {...props} />;
  },
);

AuthInput.displayName = "AuthInput";
