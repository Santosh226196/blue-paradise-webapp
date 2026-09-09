import { Link } from "react-router";
import {
  useGetDashboardStatsQuery,
  useGetTodayTransactionsQuery,
  useGetExpiringMembershipsQuery,
} from "@/store/api/billingApi";
import { useGetPoolServicesQuery } from "@/store/api/poolServicesApi";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import {
  GlassCard,
  StatCard,
  PrimaryButton,
  GhostButton,
  SkeletonGlass,
  EmptyState,
} from "@/components/ui";
import { formatCurrency, formatTime, formatDate } from "@/lib/utils";
import { useAppSelector } from "@/hooks/store";
import {
  IoPeople,
  IoFootsteps,
  IoCash,
  IoPersonAdd,
  IoReceipt,
  IoArrowForward,
  IoTime,
  IoCalendar,
  IoAlertCircle,
  IoWater,
  IoBuild,
  IoOptions,
  IoFlask,
  IoSparkles,
  IoAdd,
} from "react-icons/io5";
import type { ExpiringMembership } from "@/types";

const poolCategoryIcon: Record<string, React.ReactNode> = {
  Equipment: <IoOptions size={16} />,
  Cleaning: <IoBuild size={16} />,
  Chemical: <IoFlask size={16} />,
  Water: <IoWater size={16} />,
};

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: todayTxns, isLoading: txnsLoading } =
    useGetTodayTransactionsQuery();
  const { data: expiring, isLoading: expiringLoading } =
    useGetExpiringMembershipsQuery();
  const { data: poolServices, isLoading: poolLoading } =
    useGetPoolServicesQuery();
  const { data: settings } = useGetSettingsQuery();

  const timing = settings?.clubTiming;
  const openTime = timing?.openTime ?? "05:00";
  const closeTime = timing?.closeTime ?? "22:00";
  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const isOpenToday = (timing?.daysOpen ?? ALL_DAYS).includes(todayName);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isOpenNow =
    isOpenToday &&
    nowMinutes >= toMinutes(openTime) &&
    nowMinutes <= toMinutes(closeTime);

  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1
          className="font-display text-2xl sm:text-3xl font-bold text-fg"
        >
          {greeting}, {user?.username ?? "Admin"}
        </h1>
        <p
          className="text-sm mt-1.5 text-fg-dim"
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Club Timing */}
      <GlassCard padding={false} className="p-4 animate-fade-up stagger-1">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--glow-aqua)",
              color: "var(--accent-aqua)",
            }}
          >
            <IoTime size={18} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs font-bold uppercase tracking-wider text-fg-muted"
            >
              Club Timing
            </p>
            <p
              className="text-sm font-bold font-mono text-fg"
            >
              {openTime} — {closeTime}
            </p>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
            style={{
              background: isOpenNow ? "var(--glow-aqua)" : "var(--glow-coral)",
              color: isOpenNow ? "var(--accent-aqua)" : "var(--accent-coral)",
            }}
          >
            {isOpenNow ? "Open Now" : "Closed"}
          </span>
        </div>
      </GlassCard>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Customers"
              value={stats.totalCustomers}
              icon={<IoPeople size={22} />}
              className="stagger-1"
            />
            <StatCard
              label="Today's Visits"
              value={stats.todayVisits}
              icon={<IoFootsteps size={22} />}
              className="stagger-2"
            />
            <StatCard
              label="Today's Revenue"
              value={formatCurrency(stats.todayRevenue)}
              icon={<IoCash size={22} />}
              className="stagger-3"
            />
          </div>
        )
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard className="lg:order-2">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-display text-lg font-bold text-fg"
          >
            Today's Transactions
          </h2>
          <Link
            to="/reports"
            className="flex items-center gap-1 text-xs font-bold text-accent"
          >
            View All <IoArrowForward size={14} />
          </Link>
        </div>

        {txnsLoading ? (
          <SkeletonGlass lines={3} />
        ) : todayTxns && todayTxns.length > 0 ? (
          <div className="space-y-2">
            {todayTxns?.map((txn) => (
              <Link
                key={txn.id}
                to={`/transactions/${txn.id}`}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-12 group animate-fade-up cursor-pointer"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--glass-bg-hover)";
                  e.currentTarget.style.borderColor =
                    "var(--glass-border-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--glass-bg)";
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                }}
              >
                <div>
                  <p
                    className="text-sm font-bold text-fg"
                  >
                    {txn.serviceName}
                  </p>
                  <p
                    className="text-xs font-mono text-fg-muted"
                  >
                    {formatTime(txn.paidAt)} · {txn.billNumber}
                  </p>
                </div>
                <p
                  className="text-sm font-bold font-mono text-danger"
                >
                  {formatCurrency(txn.amount)}
                </p>
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

      <GlassCard className="lg:order-1">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-display text-lg font-bold text-fg"
          >
            Expiring Memberships
          </h2>
          <span
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
            style={{
              background: "var(--glow-coral)",
              color: "var(--accent-coral)",
            }}
          >
            <IoAlertCircle size={12} />
            {expiringLoading ? "…" : `${expiring?.length ?? 0} members`}
          </span>
        </div>

        {expiringLoading ? (
          <SkeletonGlass lines={3} />
        ) : expiring && expiring.length > 0 ? (
          <div className="space-y-2">
            {expiring?.map((m: ExpiringMembership) => {
              const expired = m.status === "EXPIRED";
              return (
                <Link
                  key={m.customerId}
                  to={`/customers/${m.customerId}`}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-12 group animate-fade-up cursor-pointer"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--glass-bg-hover)";
                    e.currentTarget.style.borderColor =
                      "var(--glass-border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--glass-bg)";
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: expired
                          ? "var(--glow-coral)"
                          : "var(--glow-aqua)",
                        color: expired
                          ? "var(--accent-coral)"
                          : "var(--accent-aqua)",
                      }}
                    >
                      <IoWater size={16} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold text-fg"
                      >
                        {m.customerName}
                      </p>
                      <p
                        className="text-xs font-mono text-fg-muted"
                      >
                        {m.membershipType} · {formatDate(m.endDate)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{
                      background: expired
                        ? "var(--glow-coral)"
                        : "var(--glow-aqua)",
                      color: expired
                        ? "var(--accent-coral)"
                        : "var(--accent-aqua)",
                    }}
                  >
                    {expired
                      ? "Expired"
                      : `${m.daysLeft} day${m.daysLeft === 1 ? "" : "s"} left`}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<IoCalendar size={36} />}
            title="No memberships expiring"
            description="Active memberships are all up to date"
          />
        )}
      </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-fg">
            Swimming Pool Maintenance Log
          </h2>
          <Link
            to="/services"
            className="flex items-center gap-1 text-xs font-bold text-accent"
          >
            Manage <IoArrowForward size={14} />
          </Link>
        </div>

        {poolLoading ? (
          <SkeletonGlass lines={3} />
        ) : poolServices && poolServices.length > 0 ? (
          <div className="space-y-2">
            {poolServices.map((task, idx) => {
              const isOverdue = task.status === "overdue";
              const isCompleted = task.status === "completed";
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-12 animate-fade-up"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--glass-bg-hover)";
                    e.currentTarget.style.borderColor = "var(--glass-border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--glass-bg)";
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isOverdue
                          ? "var(--glow-coral)"
                          : isCompleted
                            ? "var(--glow-pool)"
                            : "var(--glow-aqua)",
                        color: isOverdue
                          ? "var(--accent-coral)"
                          : isCompleted
                            ? "var(--accent-pool)"
                            : "var(--accent-aqua)",
                      }}
                    >
                      {poolCategoryIcon[task.category] ?? <IoSparkles size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-fg">{task.name}</p>
                      <p className="text-xs font-mono text-fg-muted">
                        {task.lastDone
                          ? `Last: ${formatDate(task.lastDone)}`
                          : "Not done yet"}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{
                      background: isOverdue
                        ? "var(--glow-coral)"
                        : isCompleted
                          ? "var(--glow-pool)"
                          : "var(--glow-aqua)",
                      color: isOverdue
                        ? "var(--accent-coral)"
                        : isCompleted
                          ? "var(--accent-pool)"
                          : "var(--accent-aqua)",
                    }}
                  >
                    {isOverdue
                      ? "Overdue"
                      : isCompleted
                        ? "Done"
                        : task.nextDue
                          ? formatDate(task.nextDue)
                          : "Upcoming"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<IoWater size={36} />}
            title="No pool services logged"
            description="Add maintenance services to track the pool"
            action={
              <Link to="/services">
                <PrimaryButton>
                  <IoAdd size={18} /> Add Service
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
