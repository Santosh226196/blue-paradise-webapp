import { useState } from "react";
import { Link } from "react-router";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import { PrimaryButton, EmptyState, SkeletonGlass } from "@/components/ui";
import { IoSearch, IoPersonAdd, IoChevronForward, IoCard } from "react-icons/io5";

const filterChips = [
  { key: "ALL", label: "All Members" },
  { key: "MEMBERSHIP", label: "Membership" },
  { key: "COACHING", label: "Coaching" },
  { key: "HOURLY_SWIMMING", label: "Hourly Pass" },
];

export function CustomerListPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { data: customers, isLoading } = useGetCustomersQuery({
    search,
    type: activeFilter === "ALL" ? undefined : activeFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Member Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage club members, access profiles, and view verification history
          </p>
        </div>
        <Link to="/customers/new">
          <PrimaryButton size="sm">
            <IoPersonAdd size={16} />
            Register Member
          </PrimaryButton>
        </Link>
      </div>

      <div className="relative">
        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by member name, phone, or Aadhaar..."
          className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
          style={{
            background: "var(--input-bg)",
            border: "1.5px solid var(--input-border)",
            color: "var(--text-primary)",
            outlineColor: "var(--input-focus-ring)",
          }}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterChips.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 min-h-[36px]"
            style={{
              background: activeFilter === key ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${activeFilter === key ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color: activeFilter === key ? "var(--accent-aqua)" : "var(--text-secondary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
        </div>
      ) : customers && customers.length > 0 ? (
        <div className="space-y-2">
          {customers.map((customer, i) => (
            <Link
              key={customer.id}
              to={`/customers/${customer.id}`}
              className="liquid-glass relative overflow-hidden flex items-center justify-between p-3.5 sm:p-4 transition-all duration-200 min-h-[58px] animate-fade-up group border border-white/10 hover:border-cyan-400/40"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Photo / Avatar */}
                {customer.photoUrl ? (
                  <img
                    src={customer.photoUrl}
                    alt={customer.name}
                    className="w-11 h-11 rounded-xl object-cover border border-cyan-400/60 shrink-0"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm text-slate-950 shadow-sm"
                    style={{ background: "linear-gradient(135deg, var(--accent-aqua), var(--accent-pool))" }}
                  >
                    {customer.name[0]?.toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate text-white group-hover:text-cyan-300 transition-colors">
                      {customer.name}
                    </p>
                    {customer.idCardPhoto && (
                      <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                        <IoCard size={10} /> ID Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="font-mono">{customer.mobile}</span>
                    {customer.aadhaarNumber && (
                      <span className="hidden md:inline font-mono text-[11px] text-slate-500">
                        UID: {customer.aadhaarNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                  View Profile
                </span>
                <IoChevronForward
                  size={18}
                  style={{ color: "var(--text-muted)" }}
                  className="transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-300"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoSearch size={36} />}
          title="No members found"
          description={search ? "Try a different search keyword" : "Register your first member to get started"}
          action={
            !search && (
              <Link to="/customers/new">
                <PrimaryButton>
                  <IoPersonAdd size={18} />
                  Register Member
                </PrimaryButton>
              </Link>
            )
          }
        />
      )}
    </div>
  );
}
