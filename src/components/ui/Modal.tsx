import { useEffect, useRef, type ReactNode } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
  IoClose,
} from "react-icons/io5";
import type { ModalProps, ModalVariant } from "@/types";

const variantConfig: Record<
  ModalVariant,
  {
    icon: ReactNode;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    accentColor: string;
  }
> = {
  success: {
    icon: <IoCheckmarkCircle size={28} />,
    iconBg: "var(--glow-aqua)",
    iconColor: "var(--accent-aqua)",
    borderColor: "var(--accent-aqua)",
    accentColor: "var(--accent-aqua)",
  },
  error: {
    icon: <IoCloseCircle size={28} />,
    iconBg: "var(--glow-coral)",
    iconColor: "var(--accent-coral)",
    borderColor: "var(--accent-coral)",
    accentColor: "var(--accent-coral)",
  },
  warning: {
    icon: <IoWarning size={28} />,
    iconBg: "rgba(255,200,50,0.15)",
    iconColor: "#FFC832",
    borderColor: "#FFC832",
    accentColor: "#FFC832",
  },
  info: {
    icon: <IoInformationCircle size={28} />,
    iconBg: "var(--glow-pool)",
    iconColor: "var(--accent-pool)",
    borderColor: "var(--accent-pool)",
    accentColor: "var(--accent-pool)",
  },
  confirm: {
    icon: <IoWarning size={28} />,
    iconBg: "var(--glow-coral)",
    iconColor: "var(--accent-coral)",
    borderColor: "var(--accent-coral)",
    accentColor: "var(--accent-coral)",
  },
};

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  variant = "info",
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showActions = true,
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const v = variantConfig[variant];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-up"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="liquid-glass relative overflow-hidden w-full max-w-md animate-scale-in"
        style={{ border: `1.5px solid ${v.borderColor}30` }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: v.accentColor }}
        />

        <div className="p-6 space-y-5">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-fg-muted cursor-pointer"
          >
            <IoClose size={18} />
          </button>

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: v.iconBg, color: v.iconColor }}
            >
              {v.icon}
            </div>
            <div className="min-w-0">
              <h3
                className="text-lg font-bold text-fg"
              >
                {title}
              </h3>
              <p
                className="text-sm mt-1.5 leading-relaxed text-fg-dim"
              >
                {message}
              </p>
            </div>
          </div>

          {/* Custom children content */}
          {children}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-3 pt-1">
              {variant === "confirm" ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97] liquid-glass text-fg cursor-pointer"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm?.();
                      onClose();
                    }}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-110 shadow-lg cursor-pointer"
                    style={{ background: v.accentColor }}
                  >
                    {confirmLabel}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-110 shadow-lg cursor-pointer"
                  style={{ background: v.accentColor }}
                >
                  {variant === "success" ? "Done" : "Got it"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
