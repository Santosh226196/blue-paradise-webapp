import { useState } from "react";
import {
  useGetRevenueReportQuery,
  useGetTransactionListQuery,
} from "@/store/api/reportsApi";
import { GlassCard, StatCard, SkeletonGlass, GhostButton } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ServiceType } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  IoTrendingUp,
  IoReceipt,
  IoCash,
  IoWallet,
  IoDownload,
  IoBarChartOutline,
} from "react-icons/io5";
import type { Transaction, ReportSummary } from "@/types";

const periods = [
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const CATEGORY_COLORS: Record<string, string> = {
  [ServiceType.Membership]: "#5FD9D6",
  [ServiceType.Coaching]: "#FF7A59",
  [ServiceType.HourlySwimming]: "#146C8E",
};

const CATEGORY_LABELS: Record<string, string> = {
  [ServiceType.Membership]: "Membership",
  [ServiceType.Coaching]: "Coaching",
  [ServiceType.HourlySwimming]: "Hourly Swim",
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="liquid-glass p-4 min-w-45 border border-glass-border-strong">
      <p className="text-xs font-bold mb-2 text-fg">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: entry.color }}
              />
              <span className="text-[11px] text-fg-dim">
                {CATEGORY_LABELS[entry.name] || entry.name}
              </span>
            </div>
            <span className="text-[11px] font-bold font-mono text-fg">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-glass-border">
        <div className="flex justify-between">
          <span className="text-xs font-bold text-fg-dim">Total</span>
          <span className="text-sm font-bold font-mono text-accent">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

const SERVICE_ORDER = [
  ServiceType.Membership,
  ServiceType.Coaching,
  ServiceType.HourlySwimming,
] as const;

function exportReport(report: ReportSummary, txns: Transaction[] | undefined, period: string) {
  const periodLabel = periods.find((p) => p.key === period)?.label ?? period;
  const now = new Date().toLocaleString("en-IN");
  const csv: string[] = [];
  csv.push("Blue Paradise Water Club — Revenue Report");
  csv.push(`Period: ${periodLabel}`);
  csv.push(`Generated: ${now}`);
  csv.push("");
  csv.push("Summary");
  csv.push("Total Revenue," + report.totalRevenue);
  csv.push("Transactions," + report.totalTransactions);
  csv.push(
    "Average Sale," +
      (report.totalTransactions
        ? Math.round((report.totalRevenue / report.totalTransactions) * 100) / 100
        : 0),
  );
  csv.push("");
  csv.push("Revenue by Category");
  csv.push("Category,Amount,Count");
  for (const type of SERVICE_ORDER) {
    const data = report.byCategory[type];
    if (data) csv.push(`${CATEGORY_LABELS[type] || type},${data.total},${data.count}`);
  }
  csv.push("");
  csv.push("Daily / Period Revenue");
  csv.push("Period,Amount,Transactions");
  for (const d of report.dailyRevenue) {
    csv.push(`"${String(d.period).replace(/"/g, '""')}",${d.total},${d.count}`);
  }
  csv.push("");
  csv.push("Transactions");
  csv.push("Bill Number,Date,Service,Amount,Payment Method");
  for (const t of txns ?? []) {
    csv.push(
      `${t.billNumber},"${t.paidAt.slice(0, 10)}","${String(t.serviceName).replace(/"/g, '""')}",${t.amount},${t.paymentMethod}`,
    );
  }

  const blob = new Blob(["\ufeff" + csv.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `blue-paradise-report-${period}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportsPage() {
  const [period, setPeriod] = useState("daily");
  const { data: report, isLoading: reportLoading } = useGetRevenueReportQuery({
    period,
  });
  const { data: txns, isLoading: txnsLoading } = useGetTransactionListQuery({
    period,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg">
            Reports
          </h1>
          <p className="text-xs mt-0.5 text-fg-muted">
            Revenue analytics and transaction history
          </p>
        </div>
        <GhostButton
          size="sm"
          onClick={() => report && exportReport(report, txns, period)}
          disabled={!report}
        >
          <IoDownload size={15} /> Export
        </GhostButton>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className="px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 min-h-11 whitespace-nowrap cursor-pointer"
            style={{
              background:
                period === p.key ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${period === p.key ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color:
                period === p.key
                  ? "var(--accent-aqua)"
                  : "var(--text-secondary)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {reportLoading ? (
        <div className="space-y-4">
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={3} />
        </div>
      ) : (
        report && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Total Revenue"
                value={formatCurrency(report.totalRevenue)}
                icon={<IoCash size={18} />}
                className="stagger-1"
              />
              <StatCard
                label="Transactions"
                value={report.totalTransactions}
                icon={<IoReceipt size={18} />}
                className="stagger-2"
              />
              <StatCard
                label="Avg. Sale"
                value={formatCurrency(
                  report.totalTransactions
                    ? report.totalRevenue / report.totalTransactions
                    : 0,
                )}
                icon={<IoTrendingUp size={18} />}
                className="stagger-3"
              />
              <StatCard
                label="Revenue/Period"
                value={formatCurrency(
                  report.dailyRevenue.length > 0
                    ? report.totalRevenue / report.dailyRevenue.length
                    : 0,
                )}
                icon={<IoWallet size={18} />}
                className="stagger-4"
              />
            </div>

            {/* Revenue Trend Chart — Always Visible */}
            <GlassCard className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Revenue Trend
                </h3>
                <div className="flex items-center gap-4">
                  {SERVICE_ORDER.map((type) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: CATEGORY_COLORS[type] }}
                      />
                      <span className="text-[10px] font-bold hidden sm:inline text-fg-muted">
                        {CATEGORY_LABELS[type]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {report.dailyRevenue.length > 0 ? (
                <div className="h-80 sm:h-95">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={report.dailyRevenue}
                      margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                    >
                      <defs>
                        {SERVICE_ORDER.map((type) => (
                          <linearGradient
                            key={type}
                            id={`grad-${type}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={CATEGORY_COLORS[type]}
                              stopOpacity={0.75}
                            />
                            <stop
                              offset="95%"
                              stopColor={CATEGORY_COLORS[type]}
                              stopOpacity={0.08}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--glass-border)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="period"
                        tick={{
                          fill: "var(--text-muted)",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                        interval="preserveStartEnd"
                        minTickGap={24}
                      />
                      <YAxis
                        tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        dx={-4}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: "var(--text-muted)", strokeDasharray: "4 4" }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                        }}
                      />
                      {SERVICE_ORDER.map((type) => (
                        <Area
                          key={type}
                          type="monotone"
                          dataKey={`byCategory.${type}`}
                          stackId="revenue"
                          stroke={CATEGORY_COLORS[type]}
                          strokeWidth={2}
                          fill={`url(#grad-${type})`}
                          name={CATEGORY_LABELS[type]}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 sm:h-95 flex flex-col items-center justify-center text-center px-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: "var(--glow-aqua)",
                      color: "var(--accent-aqua)",
                    }}
                  >
                    <IoBarChartOutline size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-fg mb-1">
                    No revenue data for {periods.find((p) => p.key === period)?.label}
                  </h3>
                  <p className="text-xs max-w-xs text-fg-dim">
                    Record transactions from the Billing screen and your revenue
                    trend chart will show up here automatically.
                  </p>
                </div>
              )}
            </GlassCard>

            <div className="lg:grid lg:grid-cols-5 lg:gap-6 space-y-6 lg:space-y-0">
              {/* Revenue by Category */}
              <GlassCard className="lg:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-fg-muted">
                  Revenue by Category
                </h3>
                <div className="space-y-3">
                  {SERVICE_ORDER.map((type) => {
                    const data = report.byCategory[type];
                    const amount = data?.total ?? 0;
                    const count = data?.count ?? 0;
                    const percentage =
                      report.totalRevenue > 0
                        ? Math.round((amount / report.totalRevenue) * 100)
                        : 0;
                    return (
                      <div
                        key={type}
                        className="p-4 rounded-xl"
                        style={{
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ background: CATEGORY_COLORS[type] }}
                            />
                            <span className="text-sm font-bold text-fg">
                              {CATEGORY_LABELS[type] || type}
                            </span>
                          </div>
                          <span className="text-xs font-bold font-mono text-fg-muted">
                            {percentage}%
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-lg font-bold font-mono text-fg">
                            {formatCurrency(amount)}
                          </span>
                          <span className="text-[10px] font-bold text-fg-muted">
                            {count} txns
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-glass-hover">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              background: CATEGORY_COLORS[type],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Recent Transactions */}
              <GlassCard className="lg:col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-fg-muted">
                  Recent Transactions
                </h3>
                {txnsLoading ? (
                  <SkeletonGlass lines={3} />
                ) : txns && txns.length > 0 ? (
                  <div className="space-y-2">
                    {txns?.slice(0, 10).map((txn, i) => (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-12 animate-fade-up"
                        style={{
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                          animationDelay: `${i * 0.03}s`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background:
                                CATEGORY_COLORS[txn.serviceType] + "20",
                              color: CATEGORY_COLORS[txn.serviceType],
                            }}
                          >
                            <span className="text-xs font-bold">
                              {txn.serviceType === ServiceType.Membership
                                ? "M"
                                : txn.serviceType === ServiceType.Coaching
                                  ? "C"
                                  : "H"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-fg">
                              {txn.serviceName}
                            </p>
                            <p className="text-xs font-mono text-fg-muted">
                              {txn.billNumber} · {formatDate(txn.paidAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold font-mono text-danger">
                          {formatCurrency(txn.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-fg-muted">
                    No transactions for this period
                  </p>
                )}
              </GlassCard>
            </div>
          </>
        )
      )}
    </div>
  );
}