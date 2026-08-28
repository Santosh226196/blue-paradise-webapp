import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { AmbientBackground } from "./AmbientBackground";
import { SearchModal } from "@/components/SearchModal";
import { Logo } from "@/components/Logo";
import { useAppSelector } from "@/hooks/store";
import { useTheme } from "@/hooks/useTheme";
import {
  IoMenu,
  IoClose,
  IoNotificationsOutline,
  IoSearch,
  IoSunnyOutline,
  IoMoonOutline,
  IoAdd,
} from "react-icons/io5";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSearchKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleSearchKey);
    return () => window.removeEventListener("keydown", handleSearchKey);
  }, [handleSearchKey]);

  const userInitial = user?.username?.charAt(0).toUpperCase() ?? "A";

  return (
    <div className="min-h-screen relative font-sans">
      <AmbientBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 lg:ml-[260px] border-b transition-all"
        style={{
          background: "var(--sidebar-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "var(--glass-border)",
        }}
      >
        {/* Left: Mobile controls or Desktop Search */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 border border-white/10"
            style={{ background: "var(--glass-bg)", color: "var(--text-primary)" }}
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <IoClose size={20} /> : <IoMenu size={20} />}
          </button>

          {/* Logo — mobile only */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <Logo size={36} />
            <span className="font-display text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
              Blue Paradise
            </span>
          </div>

          {/* Global Search Button — left side */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 lg:px-3 py-1.5 rounded-xl transition-all duration-200 border border-white/10 hover:border-cyan-400/30 text-xs font-medium min-w-0"
            style={{ color: "var(--text-secondary)", background: "var(--glass-bg)" }}
            title="Search (⌘K)"
          >
            <IoSearch size={16} className="text-cyan-400 shrink-0" />
            <span className="hidden lg:inline">Search club...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400 border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: New Bill (Desktop) */}
          <button
            onClick={() => navigate("/billing")}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <IoAdd size={16} />
            <span>New Bill</span>
          </button>

          {/* Theme Switcher - Color */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
            style={{ color: "var(--text-primary)", background: "var(--glass-bg)" }}
            title={`${theme === "dark" ? "Light" : "Dark"} theme`}
          >
            {theme === "dark" ? (
              <IoSunnyOutline size={18} className="text-amber-300" />
            ) : (
              <IoMoonOutline size={18} className="text-cyan-600" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate("/announcements")}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
            style={{ color: "var(--text-secondary)", background: "var(--glass-bg)" }}
            title="Announcements & Alerts"
          >
            <IoNotificationsOutline size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
          </button>

          {/* User Profile Pill (Desktop) */}
          <div
            onClick={() => navigate("/settings")}
            className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl cursor-pointer transition-all duration-200 border border-white/10 hover:border-white/20 hover:bg-white/5"
            style={{ background: "var(--glass-bg)" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950 shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--accent-aqua), var(--accent-pool))" }}
            >
              {userInitial}
            </div>
            <div className="text-left leading-tight hidden md:block">
              <p className="text-xs font-bold truncate max-w-[80px]" style={{ color: "var(--text-primary)" }}>
                {user?.username ?? "Admin"}
              </p>
              <p className="text-[10px] text-cyan-400 font-semibold">Manager</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="lg:ml-[260px] min-h-screen pb-28 lg:pb-12 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
