import { Logo } from "@/components/Logo";
import { Users, Footprints, IndianRupee } from "lucide-react";

const stats = [
  { label: "Members", value: "2,450+", icon: Users },
  { label: "Today's Visits", value: "184", icon: Footprints },
  { label: "Revenue", value: "₹3.2L", icon: IndianRupee },
];

export function BrandPanel() {
  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden p-10 lg:p-14 bg-deep"
    >
      {/* Background water visuals */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial teal glow */}
        <div
          className="absolute rounded-full"
          style={{
            top: "10%",
            right: "-10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, var(--glow-aqua), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "5%",
            left: "-5%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, var(--glow-pool), transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Flowing curved lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M-50 300 Q150 250 300 320 T650 280"
            stroke="var(--glass-border)"
            strokeWidth="1.5"
            fill="none"
            className="wave wave-1"
          />
          <path
            d="M-50 400 Q200 340 350 410 T700 370"
            stroke="var(--glass-border)"
            strokeWidth="1"
            fill="none"
            className="wave wave-2"
          />
          <path
            d="M-50 500 Q180 460 320 520 T680 490"
            stroke="var(--glass-border)"
            strokeWidth="1"
            fill="none"
            className="wave wave-3"
          />
          {/* Geometric shapes */}
          <circle cx="450" cy="200" r="60" stroke="var(--glass-border)" strokeWidth="1" fill="none" />
          <circle cx="480" cy="230" r="40" stroke="var(--glass-border)" strokeWidth="0.5" fill="none" />
          <rect x="80" y="600" width="80" height="80" rx="16" stroke="var(--glass-border)" strokeWidth="0.5" fill="none" transform="rotate(15 120 640)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-10">
          <Logo size={52} />
        </div>
        <h1
          className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          Welcome back.
        </h1>
        <p
          className="text-sm leading-relaxed max-w-sm text-fg-dim"
        >
          Manage your club, members, billing and daily operations from one place.
        </p>
      </div>

      {/* Floating glass stat cards */}
      <div className="relative z-10 space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="liquid-glass flex items-center gap-3 px-4 py-3 rounded-2xl"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-glow-a"
            >
              <stat.icon size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-base font-bold text-fg">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-fg-dim">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
