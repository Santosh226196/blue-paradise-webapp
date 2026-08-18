import { NavLink, useLocation } from "react-router";
import {
  IoHomeOutline, IoHome,
  IoPeopleOutline, IoPeople,
  IoReceiptOutline, IoReceipt,
  IoStatsChartOutline, IoStatsChart,
  IoSettingsOutline, IoSettings,
} from "react-icons/io5";

const navItems = [
  { to: "/", iconOutline: IoHomeOutline, iconFilled: IoHome, label: "Home" },
  { to: "/customers", iconOutline: IoPeopleOutline, iconFilled: IoPeople, label: "Customers" },
  { to: "/billing", iconOutline: IoReceiptOutline, iconFilled: IoReceipt, label: "Billing" },
  { to: "/reports", iconOutline: IoStatsChartOutline, iconFilled: IoStatsChart, label: "Reports" },
  { to: "/settings", iconOutline: IoSettingsOutline, iconFilled: IoSettings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderTop: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(({ to, iconOutline, iconFilled, label }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          const Icon = isActive ? iconFilled : iconOutline;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-semibold transition-all duration-200 min-w-[56px] min-h-[48px] justify-center"
              style={{
                color: isActive ? "var(--accent-aqua)" : "var(--text-muted)",
                background: isActive ? "var(--glow-aqua)" : "transparent",
              }}
            >
              <Icon size={22} className="transition-transform duration-200" style={{ transform: isActive ? "scale(1.1)" : "scale(1)" }} />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
