import { useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router";
import {
  IoHomeOutline, IoHome,
  IoPeopleOutline, IoPeople,
  IoReceiptOutline, IoReceipt,
  IoStatsChartOutline, IoStatsChart,
  IoSettingsOutline, IoSettings,
  IoLogOutOutline,
  IoFootstepsOutline, IoFootsteps,
  IoChevronDown, IoChevronForward,
} from "react-icons/io5";
import { useAppDispatch } from "@/hooks/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";

interface NavItemData {
  to: string;
  iconOutline: React.ComponentType<{ size: number; className?: string }>;
  iconFilled: React.ComponentType<{ size: number; className?: string }>;
  label: string;
}

interface SubItemData {
  to: string;
  label: string;
}

const navItems: NavItemData[] = [
  { to: "/", iconOutline: IoHomeOutline, iconFilled: IoHome, label: "Dashboard" },
  { to: "/customers", iconOutline: IoPeopleOutline, iconFilled: IoPeople, label: "Customers" },
  { to: "/billing", iconOutline: IoReceiptOutline, iconFilled: IoReceipt, label: "Billing" },
  { to: "/reports", iconOutline: IoStatsChartOutline, iconFilled: IoStatsChart, label: "Reports" },
];

const managementParent: NavItemData & { children: SubItemData[] } = {
  to: "/management",
  iconOutline: IoFootstepsOutline,
  iconFilled: IoFootsteps,
  label: "Management",
  children: [
    { to: "/attendance", label: "Attendance" },
    { to: "/membership-plans", label: "Plans" },
    { to: "/staff", label: "Staff" },
    { to: "/schedule", label: "Schedule" },
    { to: "/due-payments", label: "Due Payments" },
    { to: "/announcements", label: "Announcements" },
  ],
};

const bottomItems: NavItemData[] = [
  { to: "/settings", iconOutline: IoSettingsOutline, iconFilled: IoSettings, label: "Settings" },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  const location = useLocation();
  const [mgmtExpanded, setMgmtExpanded] = useState(true);

  const isMgmtActive = managementParent.children.some((c) => location.pathname.startsWith(c.to));

  const toggleMgmt = useCallback(() => {
    setMgmtExpanded((prev) => !prev);
  }, []);

  async function handleLogout() {
    try { await logoutMutation(); } catch {}
    dispatch(logoutAction());
    navigate("/login");
    onClose?.();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar — desktop: always visible; mobile: slide-in overlay */}
      <aside
        className={`
          fixed top-0 z-50 h-screen w-[260px] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "var(--sidebar-bg)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderRight: "1px solid var(--glass-border)",
        }}
      >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-aqua), var(--accent-pool))" }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M4 20c3-5 6-5 9 0s6 5 9 0 6-5 9 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M4 12c3-5 6-5 9 0s6 5 9 0 6-5 9 0" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[15px] font-bold truncate" style={{ color: "var(--text-primary)" }}>
              Blue Paradise
            </h1>
            <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>Water Club</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-2" style={{ borderTop: "1px solid var(--glass-border)" }} />

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <SidebarLink key={item.to} item={item} location={location} />
        ))}

        {/* Divider before Management */}
        <div className="pt-3 pb-1 px-4">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Management
          </p>
        </div>

        {/* Management — expandable section */}
        <div>
          <button
            onClick={toggleMgmt}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMgmt();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 min-h-[40px] group"
            style={{
              background: isMgmtActive ? "var(--glow-aqua)" : "transparent",
              color: isMgmtActive ? "var(--accent-aqua)" : "var(--text-secondary)",
              borderLeft: isMgmtActive ? "3px solid var(--accent-aqua)" : "3px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!isMgmtActive) {
                e.currentTarget.style.background = "var(--glass-bg-hover)";
                e.currentTarget.style.color = "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMgmtActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
            aria-expanded={mgmtExpanded}
            aria-controls="mgmt-submenu"
          >
            {isMgmtActive ? (
              <managementParent.iconFilled size={18} className="transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <managementParent.iconOutline size={18} className="transition-transform duration-200 group-hover:scale-110" />
            )}
            <span className="flex-1 text-left">{managementParent.label}</span>
            <span
              className="transition-transform duration-300"
              style={{
                color: "var(--text-muted)",
                transform: mgmtExpanded ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            >
              <IoChevronDown size={14} />
            </span>
          </button>

          {/* Sub-items with connector lines */}
          <div
            id="mgmt-submenu"
            role="group"
            aria-label="Management submenu"
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: mgmtExpanded ? "300px" : "0px",
              opacity: mgmtExpanded ? 1 : 0,
            }}
          >
            <div className="relative ml-[19px] py-1">
              {/* Vertical connector line */}
              <div
                className="absolute left-0 top-1 bottom-1 w-px"
                style={{ background: "var(--glass-border)" }}
              />
              {managementParent.children.map((child) => {
                const isChildActive = location.pathname.startsWith(child.to);
                return (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className="relative flex items-center gap-3 pl-[26px] pr-4 py-[7px] rounded-lg text-[12px] font-medium transition-all duration-200 min-h-[34px] group"
                    style={{
                      color: isChildActive ? "var(--text-primary)" : "var(--text-secondary)",
                      background: isChildActive ? "var(--glow-aqua)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isChildActive) {
                        e.currentTarget.style.background = "var(--glass-bg-hover)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isChildActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    {/* Horizontal connector branch */}
                    <div
                      className="absolute left-0 top-1/2 w-[18px] h-px -translate-y-1/2"
                      style={{ background: isChildActive ? "var(--accent-aqua)" : "var(--glass-border)" }}
                    />
                    {/* Dot indicator */}
                    <div
                      className="absolute left-0 top-1/2 w-[6px] h-[6px] rounded-full -translate-x-[3px] -translate-y-1/2 transition-all duration-200"
                      style={{
                        background: isChildActive ? "var(--accent-aqua)" : "var(--glass-border-strong)",
                        boxShadow: isChildActive ? "0 0 8px var(--accent-aqua)" : "none",
                      }}
                    />
                    <span className="flex-1">{child.label}</span>
                    {isChildActive && (
                      <IoChevronForward size={12} style={{ color: "var(--accent-aqua)" }} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom items */}
        <div className="pt-2 space-y-0.5">
          {bottomItems.map((item) => (
            <SidebarLink key={item.to} item={item} location={location} />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 min-h-[40px] w-full group"
            style={{ color: "var(--accent-coral)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,122,89,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <IoLogOutOutline size={18} className="transition-transform duration-200 group-hover:scale-110 group-hover:-translate-x-0.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

function SidebarLink({
  item,
  location,
}: {
  item: NavItemData;
  location: ReturnType<typeof useLocation>;
}) {
  const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
  const Icon = isActive ? item.iconFilled : item.iconOutline;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 min-h-[40px] group"
      style={{
        background: isActive ? "var(--glow-aqua)" : "transparent",
        color: isActive ? "var(--accent-aqua)" : "var(--text-secondary)",
        borderLeft: isActive ? "3px solid var(--accent-aqua)" : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--glass-bg-hover)";
          e.currentTarget.style.color = "var(--text-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-secondary)";
        }
      }}
    >
      <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
      <span className="flex-1">{item.label}</span>
    </NavLink>
  );
}
