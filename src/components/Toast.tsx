import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
  IoInformationCircle,
} from "react-icons/io5";
import type { ToastType, Toast, ToastContextType } from "@/types";

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(type: ToastType, message: string) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-100 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts?.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <IoCheckmarkCircle size={18} />,
    error: <IoCloseCircle size={18} />,
    warning: <IoWarning size={18} />,
    info: <IoInformationCircle size={18} />,
  };

  const colors: Record<
    ToastType,
    { bg: string; border: string; text: string; icon: string }
  > = {
    success: {
      bg: "var(--glow-aqua)",
      border: "var(--accent-aqua)",
      text: "var(--text-primary)",
      icon: "var(--accent-aqua)",
    },
    error: {
      bg: "rgba(255,122,89,0.12)",
      border: "var(--accent-coral)",
      text: "var(--text-primary)",
      icon: "var(--accent-coral)",
    },
    warning: {
      bg: "rgba(255,200,50,0.12)",
      border: "#FFC832",
      text: "var(--text-primary)",
      icon: "#FFC832",
    },
    info: {
      bg: "var(--glow-pool)",
      border: "var(--accent-pool)",
      text: "var(--text-primary)",
      icon: "var(--accent-pool)",
    },
  };

  const c = colors[toast.type];

  return (
    <div
      className="pointer-events-auto liquid-glass relative overflow-hidden p-4 flex items-center gap-3 animate-slide-right"
      style={{ border: `1.5px solid ${c.border}` }}
    >
      <span style={{ color: c.icon }}>{icons[toast.type]}</span>
      <p className="text-sm font-semibold flex-1" style={{ color: c.text }}>
        {toast.message}
      </p>
      <button
        onClick={onDismiss}
        className="text-xs font-bold shrink-0 text-fg-muted cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
