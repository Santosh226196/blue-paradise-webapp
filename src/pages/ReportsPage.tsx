import { useState } from "react";
import { useGetRevenueReportQuery, useGetTransactionListQuery } from "@/store/api/reportsApi";
import { GlassCard, StatCard, SkeletonGlass } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ServiceType } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { IoTrendingUp, IoReceipt, IoCash, IoWallet } from "react-icons/io5";

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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div
      className="liquid-glass p-4 min-w-[180px]"
      style={{ border: "1px solid var(--glass-border-strong)" }}
    >
      <p className="text-xs font-bold mb-2" style={{ color: "var(--text-primary)" }}>{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
              <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{CATEGORY_LABELS[entry.name] || entry.name}</span>
            </div>
            <span className="text-[11px] font-bold font-mono" style={{ color: "var(--text-primary)" }}>{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--glass-border)" }}>
        <div className="flex justify-between">
          <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Total</span>
          <span className="text-sm font-bold font-mono" style={{ color: "var(--accent-aqua)" }}>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const [period, setPeriod] = useState("daily");
  const { data: report, isLoading: reportLoading } = useGetRevenueReportQuery({ period });
  const { data: txns, isLoading: txnsLoading } = useGetTransactionListQuery({ period });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Reports</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Revenue analytics and transaction history</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className="px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 min-h-[44px] whitespace-nowrap"
            style={{
              background: period === p.key ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${period === p.key ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color: period === p.key ? "var(--accent-aqua)" : "var(--text-secondary)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {reportLoading ? (
        <div className="space-y-4"><SkeletonGlass lines={4} /><SkeletonGlass lines={3} /></div>
      ) : report && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Revenue" value={formatCurrency(report.totalRevenue)} icon={<IoCash size={18} />} className="stagger-1" />
            <StatCard label="Transactions" value={report.totalTransactions} icon={<IoReceipt size={18} />} className="stagger-2" />
            <StatCard label="Avg. Sale" value={formatCurrency(report.totalTransactions ? report.totalRevenue / report.totalTransactions : 0)} icon={<IoTrendingUp size={18} />} className="stagger-3" />
            <StatCard label="Revenue/Day" value={formatCurrency(report.dailyRevenue.length > 0 ? report.totalRevenue / report.dailyRevenue.length : 0)} icon={<IoWallet size={18} />} className="stagger-4" />
          </div>

          {/* Revenue Trend Chart - Full Width */}
          {report.dailyRevenue.length > 0 && (
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Revenue Trend</h3>
                <div className="flex items-center gap-4">
                  {Object.entries(CATEGORY_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-[10px] font-bold hidden sm:inline" style={{ color: "var(--text-muted)" }}>{CATEGORY_LABELS[type]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[320px] sm:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.dailyRevenue} barGap={2} barCategoryGap="18%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--glass-border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      dx={-4}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(95,217,214,0.06)" }} />
                    <Bar
                      dataKey={`byCategory.${ServiceType.Membership}`}
                      stackId="revenue"
                      fill={CATEGORY_COLORS[ServiceType.Membership]}
                      fillOpacity={0.85}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey={`byCategory.${ServiceType.Coaching}`}
                      stackId="revenue"
                      fill={CATEGORY_COLORS[ServiceType.Coaching]}
                      fillOpacity={0.85}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey={`byCategory.${ServiceType.HourlySwimming}`}
                      stackId="revenue"
                      fill={CATEGORY_COLORS[ServiceType.HourlySwimming]}
                      fillOpacity={0.85}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          <div className="lg:grid lg:grid-cols-5 lg:gap-6 space-y-6 lg:space-y-0">
            {/* Revenue by Category */}
            <GlassCard className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Revenue by Category</h3>
              <div className="space-y-3">
                {Object.entries(report.byCategory).map(([type, data]) => {
                  const percentage = report.totalRevenue > 0 ? Math.round((data.total / report.totalRevenue) * 100) : 0;
                  return (
                    <div key={type} className="p-4 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[type] }} />
                          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{CATEGORY_LABELS[type] || type}</span>
                        </div>
                        <span className="text-xs font-bold font-mono" style={{ color: "var(--text-muted)" }}>{percentage}%</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-bold font-mono" style={{ color: "var(--text-primary)" }}>{formatCurrency(data.total)}</span>
                        <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{data.count} txns</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-hover)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, background: CATEGORY_COLORS[type] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Recent Transactions */}
            <GlassCard className="lg:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Recent Transactions</h3>
              {txnsLoading ? (
                <SkeletonGlass lines={3} />
              ) : txns && txns.length > 0 ? (
                <div className="space-y-2">
                  {txns.slice(0, 10).map((txn, i) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-[48px] animate-fade-up"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", animationDelay: `${i * 0.03}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: CATEGORY_COLORS[txn.serviceType] + "20", color: CATEGORY_COLORS[txn.serviceType] }}
                        >
                          <span className="text-xs font-bold">{txn.serviceType === ServiceType.Membership ? "M" : txn.serviceType === ServiceType.Coaching ? "C" : "H"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{txn.serviceName}</p>
                          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{txn.billNumber} · {formatDate(txn.paidAt)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(txn.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6" style={{ color: "var(--text-muted)" }}>No transactions for this period</p>
              )}
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
