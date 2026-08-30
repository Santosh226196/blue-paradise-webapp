import { forwardRef } from "react";
import { PasswordInput, type PasswordInputProps } from "@/components/ui/PasswordInput";

export interface AuthPasswordInputProps extends Omit<PasswordInputProps, "showIcon"> {
  label: string;
}

export const AuthPasswordInput = forwardRef<HTMLInputElement, AuthPasswordInputProps>(
  ({ label, ...props }, ref) => {
    return <PasswordInput ref={ref} label={label} {...props} />;
  },
);

AuthPasswordInput.displayName = "AuthPasswordInput";
