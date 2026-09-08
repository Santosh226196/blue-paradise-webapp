import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";
import { API_BASE_URL } from "@/store/api/base";

interface ScannerData {
  scannerImage: string;
  businessName: string;
}

export function ScannerDisplayPage() {
  const navigate = useNavigate();
  const [scanner, setScanner] = useState<ScannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchScanner = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/settings/scanner`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (!res.ok) throw new Error("No scanner available");
        const data = await res.json();
        setScanner(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchScanner();
  }, []);

  function goBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/login");
  }

  let content: ReactNode;
  if (loading) {
    content = (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else if (error || !scanner) {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,122,89,0.15)" }}
        >
          <span className="text-2xl">📷</span>
        </div>
        <h2 className="text-lg font-bold text-fg text-center">No Scanner Available</h2>
        <p className="text-sm text-fg-muted text-center max-w-sm">
          The admin has not uploaded a payment scanner yet. Please ask the front desk for payment details.
        </p>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div
          className="text-center space-y-2"
        >
          <h1 className="text-xl font-display font-bold text-fg">
            {scanner.businessName}
          </h1>
          <p className="text-sm text-fg-muted">
            Scan the QR code below to make a payment
          </p>
        </div>
        <div
          className="rounded-2xl overflow-hidden p-6 shadow-lg"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <img
            src={scanner.scannerImage}
            alt="Payment Scanner QR Code"
            className="block object-contain"
            style={{ maxWidth: "300px", maxHeight: "300px", width: "100%" }}
          />
        </div>
        <p className="text-xs text-fg-muted text-center max-w-xs">
          Please show the payment confirmation to the front desk after scanning.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pt-16">
      <button
        onClick={goBack}
        aria-label="Go back"
        className="absolute top-4 left-4 liquid-glass p-2.5 rounded-xl transition-all duration-200 min-w-11 min-h-11 flex items-center justify-center active:scale-95 cursor-pointer z-10"
      >
        <IoArrowBack size={20} className="text-fg" />
      </button>
      {content}
    </div>
  );
}