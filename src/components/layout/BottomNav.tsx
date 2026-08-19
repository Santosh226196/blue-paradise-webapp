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
      {/* Safe area padding for iOS */}
      <div className="flex items-stretch justify-around px-1 pt-1.5 pb-[env(safe-area-inset-bottom,8px)]">
        {navItems.map(({ to, iconOutline, iconFilled, label }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          const Icon = isActive ? iconFilled : iconOutline;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl text-[10px] font-semibold transition-all duration-200 min-w-[58px] min-h-[52px]"
              style={{
                color: isActive ? "var(--accent-aqua)" : "var(--text-muted)",
              }}
            >
              {/* Active background glow */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl transition-all duration-300"
                  style={{ background: "var(--glow-aqua)" }}
                />
              )}
              {/* Active top indicator */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full"
                  style={{
                    background: "var(--accent-aqua)",
                    boxShadow: "0 0 8px var(--accent-aqua)",
                  }}
                />
              )}
              <Icon
                size={22}
                className="relative z-10 transition-transform duration-200"
                style={{ transform: isActive ? "scale(1.1)" : "scale(1)" }}
              />
              <span className="relative z-10 leading-none">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
