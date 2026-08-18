import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { AmbientBackground } from "./AmbientBackground";
import { SearchModal } from "@/components/SearchModal";
import { IoMenu, IoClose, IoNotificationsOutline, IoSearch } from "react-icons/io5";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen relative">
      <AmbientBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top navbar */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 h-14 lg:ml-[260px]"
        style={{
          background: "var(--sidebar-bg)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0"
          style={{ background: "var(--glass-bg)", color: "var(--text-primary)" }}
        >
          {sidebarOpen ? <IoClose size={20} /> : <IoMenu size={20} />}
        </button>

        {/* Logo — mobile only */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-aqua), var(--accent-pool))" }}
          >
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M4 20c3-5 6-5 9 0s6 5 9 0 6-5 9 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M4 12c3-5 6-5 9 0s6 5 9 0 6-5 9 0" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <span className="font-display text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Blue Paradise
          </span>
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <button
          onClick={() => setSearchOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
          style={{ color: "var(--text-secondary)", background: "var(--glass-bg)" }}
        >
          <IoSearch size={18} />
        </button>
        <button
          onClick={() => navigate("/announcements")}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
          style={{ color: "var(--text-secondary)", background: "var(--glass-bg)" }}
        >
          <IoNotificationsOutline size={18} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: "var(--accent-coral)" }}
          />
        </button>
      </div>

      <main className="lg:ml-[260px] min-h-screen pb-28 lg:pb-8 pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
