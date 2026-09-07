import { useEffect, useState } from "react";

interface ScannerData {
  scannerImage: string;
  businessName: string;
}

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string) || "").replace(/\/+$/, "");

export function ScannerDisplayPage() {
  const [scanner, setScanner] = useState<ScannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchScanner = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/settings/scanner`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !scanner) {
    return (
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
  }

  return (
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
