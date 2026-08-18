import { useState } from "react";
import { Link } from "react-router";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import { PrimaryButton, EmptyState, SkeletonGlass } from "@/components/ui";
import { IoSearch, IoPersonAdd, IoChevronForward } from "react-icons/io5";

const filterChips = [
  { key: "ALL", label: "All" },
  { key: "MEMBERSHIP", label: "Membership" },
  { key: "COACHING", label: "Coaching" },
  { key: "HOURLY_SWIMMING", label: "Hourly" },
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
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Customers</h1>
        <Link to="/customers/new">
          <PrimaryButton size="sm">
            <IoPersonAdd size={16} />
            Add
          </PrimaryButton>
        </Link>
      </div>

      <div className="relative">
        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or mobile..."
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
              className="liquid-glass relative overflow-hidden flex items-center justify-between p-4 transition-all duration-200 min-h-[52px] animate-fade-up group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{customer.name}</p>
                <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{customer.mobile}</p>
                {customer.aadhaarNumber && (
                  <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>Aadhaar: {customer.aadhaarNumber}</p>
                )}
              </div>
              <IoChevronForward size={18} style={{ color: "var(--text-muted)" }}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoSearch size={36} />}
          title="No customers found"
          description={search ? "Try a different search term" : "Add your first customer to get started"}
          action={
            !search && (
              <Link to="/customers/new">
                <PrimaryButton>
                  <IoPersonAdd size={18} />
                  Add Customer
                </PrimaryButton>
              </Link>
            )
          }
        />
      )}
    </div>
  );
}
