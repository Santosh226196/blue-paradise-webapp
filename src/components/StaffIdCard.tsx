import logoUrl from "@/assets/images/logo.webp";
import type { Staff } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  COACH: "Coach",
  LIFEGUARD: "Lifeguard",
  RECEPTIONIST: "Receptionist",
  MANAGER: "Manager",
};

interface StaffIdCardProps {
  staff: Staff;
  businessName?: string;
  footerMessage?: string;
}

function barcodeStyle(width: number, height: number) {
  return {
    width,
    height,
    background:
      "repeating-linear-gradient(90deg, #0d2b45 0 2px, transparent 2px 4px, #0d2b45 4px 5px, transparent 5px 8px, #0d2b45 8px 11px, transparent 11px 12px)",
  };
}

export function StaffIdCard({
  staff,
  businessName = "Blue Paradise Water Club",
  footerMessage = "This ID card is the property of Blue Paradise Water Club and must be returned on leaving duty.",
}: StaffIdCardProps) {
  const empId = staff.employeeId || `BP-STAFF-${staff.id.toUpperCase().slice(0, 6)}`;
  const initials = staff.name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const roleLabel = ROLE_LABELS[staff.role] ?? staff.role;
  const joined = new Date(staff.joinedAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const detailRow = (label: string, value: string) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "8px 0",
        borderBottom: "1px solid #e8eef4",
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: "#7a8a9b" }}>
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#0d2b45" }}>{value}</span>
    </div>
  );

  return (
    <div
      style={{
        width: 340,
        borderRadius: 22,
        overflow: "hidden",
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        border: "1px solid #d9e6f0",
        boxShadow: "0 24px 48px rgba(6, 21, 40, 0.4)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          position: "relative",
          background: "linear-gradient(120deg, #0b2338 0%, #0e4f67 55%, #12808f 100%)",
          padding: "16px 18px 20px",
        }}
      >
        {/* wave decorations */}
        <div
          style={{
            position: "absolute",
            left: -20,
            right: -20,
            bottom: -2,
            height: 18,
            background:
              "repeating-linear-gradient(115deg, rgba(95,217,214,0.5) 0 4px, transparent 4px 9px)",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -34,
            right: -26,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(95,217,214,0.35), transparent 70%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={logoUrl}
            alt="logo"
            width={46}
            height={46}
            style={{
              borderRadius: 12,
              background: "#ffffff",
              padding: 5,
              objectFit: "contain",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 0.6,
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              BLUE PARADISE
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                color: "#5fd9d6",
                marginTop: 3,
              }}
            >
              WATER CLUB · SWIM & FITNESS
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(95,217,214,0.4)",
            borderRadius: 999,
            padding: "4px 10px",
          }}
        >
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: "#5fd9d6" }}>
            STAFF ID
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#ffffff", fontFamily: "monospace" }}>
            {empId}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 20px 18px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {staff.photoUrl ? (
            <img
              src={staff.photoUrl}
              alt={staff.name}
              width={76}
              height={76}
              style={{ borderRadius: "50%", objectFit: "cover", border: "3px solid #5fd9d6" }}
            />
          ) : (
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 900,
                color: "#0d2b45",
                background: "linear-gradient(135deg, #5fd9d6, #9be8d8)",
                border: "3px solid #ffffff",
                boxShadow: "0 0 0 3px #5fd9d6",
              }}
            >
              {initials}
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0d2b45", lineHeight: 1.15 }}>
              {staff.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 5 }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: "#ffffff",
                  background: "linear-gradient(90deg, #ff7a59, #ff9a6b)",
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {roleLabel.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: staff.isAvailable ? "#0b726e" : "#7a8a9b",
                  background: staff.isAvailable ? "#d6f7f5" : "#e8eef4",
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {staff.isAvailable ? "AVAILABLE" : "OFF DUTY"}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          {detailRow("EMPLOYEE ID", empId)}
          {detailRow("MOBILE", staff.mobile)}
          {detailRow("SPECIALIZATION", staff.specialization || "General Duty")}
          {detailRow("JOINED ON", joined)}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          background: "linear-gradient(120deg, #0b2338 0%, #0e4f67 100%)",
          padding: "14px 20px 16px",
        }}
      >
        <div style={barcodeStyle(88, 18)} />
        <div style={{ fontSize: 8.5, fontWeight: 700, color: "#9dd8e2", marginTop: 6 }}>{businessName}</div>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 8.5,
            lineHeight: 1.5,
            color: "#c8e8ee",
            fontWeight: 500,
          }}
        >
          {footerMessage}
        </p>
      </div>
    </div>
  );
}