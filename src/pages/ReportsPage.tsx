import { useState } from "react";
import { useGetRevenueReportQuery, useGetTransactionListQuery } from "@/store/api/reportsApi";
import { GlassCard, StatCard, SkeletonGlass } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ServiceType } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { IoTrendingUp, IoReceipt, IoCash } from "react-icons/io5";

const periods = [
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const CHART_COLORS: Record<string, string> = {
  [ServiceType.Membership]: "#5FD9D6",
  [ServiceType.Coaching]: "#FF7A59",
  [ServiceType.HourlySwimming]: "#146C8E",
};

export function ReportsPage() {
  const [period, setPeriod] = useState("daily");
  const { data: report, isLoading: reportLoading } = useGetRevenueReportQuery({ period });
  const { data: txns, isLoading: txnsLoading } = useGetTransactionListQuery({ period });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl sm:text-3xl font-bold animate-fade-up" style={{ color: "var(--text-primary)" }}>Reports</h1>

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="Total Revenue" value={formatCurrency(report.totalRevenue)} icon={<IoCash size={18} />} className="stagger-1" />
            <StatCard label="Transactions" value={report.totalTransactions} icon={<IoReceipt size={18} />} className="stagger-2" />
            <StatCard label="Avg. Sale" value={formatCurrency(report.totalTransactions ? report.totalRevenue / report.totalTransactions : 0)} icon={<IoTrendingUp size={18} />} className="stagger-3" />
          </div>

          <GlassCard>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Revenue by Category</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(report.byCategory).map(([type, data]) => (
                <div key={type} className="text-center p-4 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: CHART_COLORS[type] }} />
                  <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{type.replace("_", " ").toLowerCase()}</p>
                  <p className="font-bold font-mono mt-1" style={{ color: "var(--text-primary)" }}>{formatCurrency(data.total)}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{data.count} txns</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {report.dailyRevenue.length > 0 && (
            <GlassCard>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Revenue Trend</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.dailyRevenue}>
                    <XAxis dataKey="period" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--sidebar-bg)",
                        border: "1px solid var(--glass-border-strong)",
                        borderRadius: "12px",
                        color: "var(--text-primary)",
                        backdropFilter: "blur(20px)",
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                    />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {report.dailyRevenue.map((_, i) => (
                        <Cell key={i} fill="var(--accent-aqua)" fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}
        </>
      )}

      <GlassCard>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Recent Transactions</h3>
        {txnsLoading ? (
          <SkeletonGlass lines={3} />
        ) : txns && txns.length > 0 ? (
          <div className="space-y-2">
            {txns.slice(0, 10).map((txn, i) => (
              <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 min-h-[48px] animate-fade-up"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", animationDelay: `${i * 0.03}s` }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{txn.serviceName}</p>
                  <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{txn.billNumber} · {formatDate(txn.paidAt)}</p>
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
  );
}
