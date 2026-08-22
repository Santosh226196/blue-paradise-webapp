import { useState, useRef, useEffect } from "react";
import { IoWater, IoBarbell, IoBusinessOutline, IoCheckmark, IoChevronDown } from "react-icons/io5";
import { useTheme, type BrandTheme } from "@/hooks/useTheme";

const brandOptions: { value: BrandTheme; label: string; icon: React.ComponentType<{ size: number; className?: string }> }[] = [
  { value: "water", label: "Water Club", icon: IoWater },
  { value: "gym", label: "Gym", icon: IoBarbell },
  { value: "other", label: "Other", icon: IoBusinessOutline },
];

export function BrandThemeDropdown() {
  const { brand, setBrand } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const active = brandOptions.find((o) => o.value === brand) ?? brandOptions[0];
  const ActiveIcon = active.icon;

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="h-9 px-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 border border-white/10 hover:border-cyan-400/30 active:scale-95 text-xs font-bold"
        style={{ color: "var(--text-primary)", background: "var(--glass-bg)" }}
        title="Website theme"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ActiveIcon size={16} className="text-cyan-400" />
        <span className="hidden sm:inline">{active.label}</span>
        <IoChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-11 w-44 rounded-xl overflow-hidden border shadow-2xl z-50 animate-scale-in origin-top-right"
          style={{ background: "var(--sidebar-bg)", borderColor: "var(--glass-border)", backdropFilter: "blur(24px)" }}
        >
          <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Website Theme
          </p>
          {brandOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.value === brand;
            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setBrand(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive ? "text-cyan-300 bg-cyan-400/10" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} className={isActive ? "text-cyan-300" : "text-slate-400"} />
                <span className="flex-1 text-left">{option.label}</span>
                {isActive && <IoCheckmark size={14} />}
              </button>
            );
          })}
          <div className="h-1.5" />
        </div>
      )}
    </div>
  );
}
