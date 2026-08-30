import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input, type InputProps } from "./Input";

export interface SearchBarProps extends Omit<InputProps, "icon"> {
  onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onClear, value, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        icon={Search}
        className={className}
        placeholder={props.placeholder ?? "Search..."}
        suffix={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-lg transition-colors text-fg-muted hover:text-fg cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  },
);

SearchBar.displayName = "SearchBar";
