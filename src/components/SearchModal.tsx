import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import { IoSearch, IoClose, IoPerson, IoChevronForward } from "react-icons/io5";

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: customers } = useGetCustomersQuery({ search: query.length >= 2 ? query : undefined }, { skip: query.length < 2 });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSelect(id: string) {
    onClose();
    navigate(`/customers/${id}`);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: "var(--sidebar-bg)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <IoSearch size={18} style={{ color: "var(--accent-aqua)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers by name or mobile..."
            className="flex-1 bg-transparent text-sm font-medium outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <IoClose size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Type at least 2 characters to search
              </p>
            </div>
          ) : customers && customers.length > 0 ? (
            <div className="py-2">
              {customers.map((c) => {
                const initials = c.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c.id)}
                    className="w-full flex items-center gap-3 px-5 py-3 transition-all duration-150 text-left"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glass-bg-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold"
                      style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{c.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.mobile}</p>
                    </div>
                    <IoChevronForward size={14} style={{ color: "var(--text-muted)" }} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <IoPerson size={28} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No customers found</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 text-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
          <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
            Press <kbd className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
