import { NavLink, useLocation, useNavigate } from "react-router";
import {
  IoHomeOutline,
  IoHome,
  IoPeopleOutline,
  IoPeople,
  IoReceiptOutline,
  IoReceipt,
  IoStatsChartOutline,
  IoStatsChart,
  IoSettingsOutline,
  IoSettings,
  IoLogOutOutline,
  IoFootstepsOutline,
  IoFootsteps,
  IoCalendarOutline,
  IoCalendar,
  IoCardOutline,
  IoCard,
  IoMegaphoneOutline,
  IoMegaphone,
  IoFitnessOutline,
  IoFitness,
  IoQrCodeOutline,
  IoQrCode,
} from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { Logo } from "@/components/Logo";
import type { NavItemData } from "@/types";

const mainNavItems: NavItemData[] = [
  {
    to: "/",
    iconOutline: IoHomeOutline,
    iconFilled: IoHome,
    label: "Dashboard",
  },
  {
    to: "/customers",
    iconOutline: IoPeopleOutline,
    iconFilled: IoPeople,
    label: "Customers",
  },
  {
    to: "/billing",
    iconOutline: IoReceiptOutline,
    iconFilled: IoReceipt,
    label: "Billing & POS",
  },
  {
    to: "/reports",
    iconOutline: IoStatsChartOutline,
    iconFilled: IoStatsChart,
    label: "Reports",
  },
];

const operationsNavItems: NavItemData[] = [
  {
    to: "/attendance",
    iconOutline: IoFootstepsOutline,
    iconFilled: IoFootsteps,
    label: "Attendance",
  },
  {
    to: "/membership-plans",
    iconOutline: IoCardOutline,
    iconFilled: IoCard,
    label: "Membership Plans",
  },
  {
    to: "/staff",
    iconOutline: IoFitnessOutline,
    iconFilled: IoFitness,
    label: "Staff & Coaches",
  },
  {
    to: "/schedule",
    iconOutline: IoCalendarOutline,
    iconFilled: IoCalendar,
    label: "Pool Schedule",
  },
  {
    to: "/due-payments",
    iconOutline: IoReceiptOutline,
    iconFilled: IoReceipt,
    label: "Due Payments",
  },
  {
    to: "/announcements",
    iconOutline: IoMegaphoneOutline,
    iconFilled: IoMegaphone,
    label: "Announcements",
  },
];

const systemNavItems: NavItemData[] = [
  {
    to: "/scanner",
    iconOutline: IoQrCodeOutline,
    iconFilled: IoQrCode,
    label: "Scanner",
  },
  {
    to: "/settings",
    iconOutline: IoSettingsOutline,
    iconFilled: IoSettings,
    label: "Settings",
  },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMutation] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutMutation();
    } catch {}
    dispatch(logoutAction());
    navigate("/login");
    onClose?.();
  }

  const userInitial = user?.username?.charAt(0).toUpperCase() ?? "A";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-65 flex flex-col
          transition-transform duration-300 ease-in-out border-r
          lg:translate-x-0 lg:z-40
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
        style={{
          background: "var(--sidebar-bg)",
          backdropFilter: "var(--glass-blur, 32px)",
          WebkitBackdropFilter: "var(--glass-blur, 32px)",
          borderColor: "var(--glass-border)",
        }}
      >
        {/* Brand Header */}
        <div className="px-5 pt-3.5 pb-2">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div className="min-w-0">
              <h1
                className="font-display text-[12px] font-bold tracking-tight truncate text-fg"
              >
                Blue Paradise
              </h1>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-cyan-400 truncate">
                Water Club
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div
          className="mx-4 mb-2 border-t border-glass-border"
        />

        {/* Scrollable Nav Items */}
        <nav
          className="flex-1 px-3 space-y-4 overflow-y-auto"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Group 1: Main */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>
            {mainNavItems.map((item) => (
              <SidebarLink
                key={item.to}
                item={item}
                location={location}
                onClick={onClose}
              />
            ))}
          </div>

          {/* Group 2: Operations */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations & Facility
            </p>
            {operationsNavItems.map((item) => (
              <SidebarLink
                key={item.to}
                item={item}
                location={location}
                onClick={onClose}
              />
            ))}
          </div>

          {/* Group 3: System */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System
            </p>
            {systemNavItems.map((item) => (
              <SidebarLink
                key={item.to}
                item={item}
                location={location}
                onClick={onClose}
              />
            ))}
          </div>
        </nav>

        {/* User Profile & Logout Footer */}
        <div
          className="mt-auto p-3 border-t bg-black/10 border-glass-border"
        >
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950 shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-aqua), var(--accent-pool))",
                }}
              >
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-white">
                  {user?.username ?? "Admin"}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Logged in</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
            >
              <IoLogOutOutline size={18} />
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
  onClick,
}: {
  item: NavItemData;
  location: ReturnType<typeof useLocation>;
  onClick?: () => void;
}) {
  const isActive =
    item.to === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(item.to);
  const Icon = isActive ? item.iconFilled : item.iconOutline;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer
        transition-all duration-200 group
        ${isActive ? "text-cyan-300 font-bold bg-cyan-400/10 shadow-sm" : "text-slate-300 hover:text-white hover:bg-white/5"}
      `}
    >
      {/* Active Glowing Bar Indicator */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
          style={{
            background: "var(--accent-aqua)",
            boxShadow: "0 0 10px var(--accent-aqua)",
          }}
        />
      )}

      <div className="flex items-center justify-center w-5">
        <Icon
          size={18}
          className={`transition-transform duration-200 ${isActive ? "scale-110 text-cyan-300" : "text-slate-400 group-hover:text-white group-hover:scale-105"}`}
        />
      </div>

      <span className="flex-1 truncate">{item.label}</span>

      {item.badge != null && item.badge > 0 && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center"
          style={{
            background: "var(--accent-coral)",
            color: "white",
          }}
        >
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </NavLink>
  );
}
