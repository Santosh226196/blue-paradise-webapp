import { NavLink, useLocation, useNavigate } from "react-router";
import {
  IoHomeOutline,
  IoHome,
  IoPeopleOutline,
  IoPeople,
  IoFootstepsOutline,
  IoFootsteps,
  IoSettingsOutline,
  IoSettings,
  IoReceipt,
} from "react-icons/io5";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isCustomers = location.pathname.startsWith("/customers");
  const isBilling =
    location.pathname.startsWith("/billing") ||
    location.pathname.startsWith("/bill");
  const isAttendance = location.pathname.startsWith("/attendance");
  const isSettings = location.pathname.startsWith("/settings");

  const items = [
    {
      to: "/",
      isHome,
      iconOutline: IoHomeOutline,
      iconFilled: IoHome,
      label: "Home",
    },
    {
      to: "/customers",
      isActive: isCustomers,
      iconOutline: IoPeopleOutline,
      iconFilled: IoPeople,
      label: "Members",
    },
    {
      to: "/attendance",
      isActive: isAttendance,
      iconOutline: IoFootstepsOutline,
      iconFilled: IoFootsteps,
      label: "Attend",
    },
    {
      to: "/settings",
      isActive: isSettings,
      iconOutline: IoSettingsOutline,
      iconFilled: IoSettings,
      label: "Settings",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),8px)] pointer-events-none">
      {/* Ambient glow behind dock */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-65 h-15 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,140,50,0.35), rgba(255,180,60,0.25), transparent)",
        }}
      />

      {/* Floating Dock */}
      <nav
        className="pointer-events-auto relative flex items-end justify-center gap-0 px-2 pb-2 pt-3 mx-4 mb-2 max-w-95 w-full rounded-7 border transition-all duration-300"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,12,30,0.92) 0%, rgba(10,8,20,0.96) 100%)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.45), 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Left items */}
        {items.slice(0, 2).map((item) => {
          const active = item.isHome ? isHome : item.isActive;
          const Icon = active ? item.iconFilled : item.iconOutline;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="relative flex flex-col items-center justify-center w-16 pt-1 pb-1 transition-all duration-250 cursor-pointer"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-250"
                style={{
                  background: active ? "rgba(255,160,50,0.15)" : "transparent",
                  transform: active ? "scale(1)" : "scale(1)",
                }}
              >
                <Icon
                  size={active ? 21 : 19}
                  className="transition-all duration-250"
                  style={{
                    color: active ? "#FFA832" : "rgba(255,255,255,0.35)",
                  }}
                />
              </div>
              <span
                className="text-[9px] font-semibold mt-0.5 transition-all duration-250"
                style={{
                  color: active ? "#FFA832" : "rgba(255,255,255,0.3)",
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Center: Elevated Billing Button */}
        <button
          onClick={() => navigate("/billing")}
          className="relative flex flex-col items-center justify-center -mt-5 mx-1 group active:scale-95 transition-transform duration-200 cursor-pointer"
          aria-label="New Bill"
        >
          {/* Glow behind circle */}
          {isBilling && (
            <div
              className="absolute -inset-2 rounded-full blur-xl opacity-60 pointer-events-none transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,160,50,0.5), transparent)",
              }}
            />
          )}
          <div
            className="relative w-13.5 h-13.5 rounded-full flex items-center justify-center transition-all duration-300 border"
            style={{
              background: isBilling
                ? "linear-gradient(135deg, #FF9A32 0%, #FF7A59 100%)"
                : "linear-gradient(135deg, rgba(255,160,50,0.9) 0%, rgba(255,122,89,0.9) 100%)",
              borderColor: isBilling
                ? "rgba(255,180,80,0.6)"
                : "rgba(255,180,80,0.3)",
              boxShadow: isBilling
                ? "0 4px 24px rgba(255,140,50,0.5), 0 0 0 3px rgba(255,160,50,0.15)"
                : "0 4px 16px rgba(255,140,50,0.3)",
              transform: isBilling ? "scale(1.05)" : "scale(1)",
            }}
          >
            <IoReceipt
              size={22}
              className="font-bold transition-all duration-200"
              style={{ color: "#1a0a00" }}
            />
          </div>
          <span
            className="text-[9px] font-bold mt-1.5 transition-all duration-250"
            style={{ color: isBilling ? "#FFA832" : "rgba(255,255,255,0.3)" }}
          >
            Billing
          </span>
        </button>

        {/* Right items */}
        {items.slice(2, 4).map((item) => {
          const active = item.isActive;
          const Icon = active ? item.iconFilled : item.iconOutline;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center justify-center w-16 pt-1 pb-1 transition-all duration-250 cursor-pointer"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-250"
                style={{
                  background: active ? "rgba(255,160,50,0.15)" : "transparent",
                }}
              >
                <Icon
                  size={active ? 21 : 19}
                  className="transition-all duration-250"
                  style={{
                    color: active ? "#FFA832" : "rgba(255,255,255,0.35)",
                  }}
                />
              </div>
              <span
                className="text-[9px] font-semibold mt-0.5 transition-all duration-250"
                style={{
                  color: active ? "#FFA832" : "rgba(255,255,255,0.3)",
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
