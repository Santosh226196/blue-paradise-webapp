import { Link } from "react-router";
import { useGetDashboardStatsQuery, useGetTodayTransactionsQuery } from "@/store/api/billingApi";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import { GlassCard, StatCard, PrimaryButton, GhostButton, SkeletonGlass, EmptyState } from "@/components/ui";
import { formatCurrency, formatTime } from "@/lib/utils";
import { useAppSelector } from "@/hooks/store";
import {
  IoPeople, IoFootsteps, IoCash, IoPersonAdd, IoReceipt, IoArrowForward, IoTime,
} from "react-icons/io5";

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: todayTxns, isLoading: txnsLoading } = useGetTodayTransactionsQuery();
  const { data: settings } = useGetSettingsQuery();

  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
          {greeting}, {user?.username ?? "Admin"}
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Club Timing */}
      {settings?.clubTiming && (
        <GlassCard padding={false} className="p-4 animate-fade-up stagger-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
            >
              <IoTime size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Club Timing</p>
              <p className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                {settings.clubTiming.openTime} — {settings.clubTiming.closeTime}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
              style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
            >
              Open Now
            </span>
          </div>
        </GlassCard>
      )}

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Customers" value={stats.totalCustomers} icon={<IoPeople size={22} />} className="stagger-1" />
          <StatCard label="Today's Visits" value={stats.todayVisits} icon={<IoFootsteps size={22} />} className="stagger-2" />
          <StatCard label="Today's Revenue" value={formatCurrency(stats.todayRevenue)} icon={<IoCash size={22} />} className="stagger-3" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/customers/new" className="flex-1">
          <PrimaryButton fullWidth size="lg" className="w-full">
            <IoPersonAdd size={20} />
            New Customer
          </PrimaryButton>
        </Link>
        <Link to="/billing" className="flex-1">
          <GhostButton fullWidth size="lg" className="w-full">
            <IoReceipt size={20} />
            New Billing
          </GhostButton>
        </Link>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>Today's Transactions</h2>
          <Link to="/reports" className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--accent-aqua)" }}>
            View All <IoArrowForward size={14} />
          </Link>
        </div>

        {txnsLoading ? (
          <SkeletonGlass lines={3} />
        ) : todayTxns && todayTxns.length > 0 ? (
          <div className="space-y-2">
            {todayTxns.map((txn) => (
              <Link
                key={txn.id}
                to={`/transactions/${txn.id}`}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-[48px] group animate-fade-up"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glass-bg-hover)"; e.currentTarget.style.borderColor = "var(--glass-border-strong)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--glass-bg)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{txn.serviceName}</p>
                  <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{formatTime(txn.paidAt)} · {txn.billNumber}</p>
                </div>
                <p className="text-sm font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(txn.amount)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<IoReceipt size={36} />}
            title="No transactions today"
            description="Start by creating a new billing entry"
            action={
              <Link to="/billing">
                <PrimaryButton>
                  <IoReceipt size={18} />
                  Start Billing
                </PrimaryButton>
              </Link>
            }
          />
        )}
      </GlassCard>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
