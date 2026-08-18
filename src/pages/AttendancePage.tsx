import { useState } from "react";
import {
  useGetTodayAttendanceQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useGetCurrentlyInPoolQuery,
} from "@/store/api/attendanceApi";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import { GlassCard, PrimaryButton, GhostButton, EmptyState, SkeletonGlass } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import {
  IoFootsteps, IoLogIn, IoLogOut, IoSearch, IoPeople, IoClose,
} from "react-icons/io5";
import { VisitType } from "@/types";

export function AttendancePage() {
  const { data: todayAttendance, isLoading } = useGetTodayAttendanceQuery();
  const { data: inPool } = useGetCurrentlyInPoolQuery();
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [search, setSearch] = useState("");
  const { data: customers } = useGetCustomersQuery({ search });
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [visitType, setVisitType] = useState<string>(VisitType.Membership);
  const [lane, setLane] = useState("");

  function resetCheckIn() {
    setSearch(""); setSelectedCustomer(null); setVisitType(VisitType.Membership); setLane("");
    setShowCheckIn(false);
  }

  async function handleCheckIn() {
    if (!selectedCustomer) return;
    await checkIn({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      visitType,
      lane: lane ? Number(lane) : undefined,
    });
    resetCheckIn();
  }

  async function handleCheckOut(id: string) {
    await checkOut(id);
  }

  const visitTypeLabels: Record<string, string> = {
    MEMBERSHIP: "Membership", COACHING: "Coaching", HOURLY: "Hourly", WALK_IN: "Walk-in",
  };

  const inputStyle = {
    background: "var(--input-bg)", border: "1.5px solid var(--input-border)",
    color: "var(--text-primary)", outlineColor: "var(--input-focus-ring)",
  };

  const currentlyInPool = inPool?.filter((r) => !r.checkOutTime) ?? [];
  const checkedOut = todayAttendance?.filter((r) => r.checkOutTime) ?? [];

  if (isLoading) return (
    <div className="space-y-6">
      <SkeletonGlass lines={1} />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonGlass lines={2} /><SkeletonGlass lines={2} />
      </div>
      <SkeletonGlass lines={4} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Attendance</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Track daily check-ins and check-outs</p>
        </div>
        <PrimaryButton size="sm" onClick={() => setShowCheckIn(true)}>
          <IoLogIn size={16} /> Check In
        </PrimaryButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard padding={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}>
              <IoPeople size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>{currentlyInPool.length}</p>
              <p className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>In Pool Now</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--glow-coral)", color: "var(--accent-coral)" }}>
              <IoFootsteps size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>{todayAttendance?.length ?? 0}</p>
              <p className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>Total Today</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Check-in form */}
      {showCheckIn && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Check In Customer</h2>
            <button onClick={resetCheckIn} style={{ color: "var(--text-muted)" }}><IoClose size={20} /></button>
          </div>
          <div className="space-y-4">
            {!selectedCustomer ? (
              <>
                <div className="relative">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customer by name or mobile..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px]" style={inputStyle} />
                </div>
                {customers && customers.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {customers.slice(0, 5).map((c) => (
                      <button key={c.id} onClick={() => { setSelectedCustomer({ id: c.id, name: c.name }); setSearch(""); }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all min-h-[44px]"
                        style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glass-bg-hover)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--glass-bg)"; }}
                      >
                        <p className="font-bold" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                        <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{c.mobile}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: "var(--glow-aqua)", border: "1px solid var(--accent-aqua)" }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{selectedCustomer.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Selected for check-in</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} style={{ color: "var(--text-muted)" }}><IoClose size={16} /></button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Visit Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(visitTypeLabels).map(([val, label]) => (
                      <button key={val} onClick={() => setVisitType(val)}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[36px]"
                        style={{
                          background: visitType === val ? "var(--glow-aqua)" : "var(--glass-bg)",
                          border: `1.5px solid ${visitType === val ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                          color: visitType === val ? "var(--accent-aqua)" : "var(--text-secondary)",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Lane (optional)</label>
                  <input type="number" min={1} max={10} value={lane} onChange={(e) => setLane(e.target.value)} placeholder="Lane number"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium font-mono min-h-[44px]" style={inputStyle} />
                </div>
                <PrimaryButton onClick={handleCheckIn} fullWidth>
                  <IoLogIn size={18} /> Check In
                </PrimaryButton>
              </>
            )}
          </div>
        </GlassCard>
      )}

      {/* Currently In Pool */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Currently In Pool</h2>
        {currentlyInPool.length > 0 ? (
          <div className="space-y-2">
            {currentlyInPool.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{r.customerName}</p>
                  <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    {formatTime(r.checkInTime)} · {visitTypeLabels[r.visitType] ?? r.visitType}
                    {r.lane ? ` · Lane ${r.lane}` : ""}
                  </p>
                </div>
                <GhostButton size="sm" onClick={() => handleCheckOut(r.id)} style={{ color: "var(--accent-coral)" }}>
                  <IoLogOut size={14} /> Check Out
                </GhostButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>No one currently in the pool</p>
        )}
      </GlassCard>

      {/* Today's Check-outs */}
      {checkedOut.length > 0 && (
        <GlassCard>
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Checked Out Today</h2>
          <div className="space-y-2">
            {checkedOut.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{r.customerName}</p>
                  <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    {formatTime(r.checkInTime)} → {formatTime(r.checkOutTime!)}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}>
                  Done
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {!isLoading && todayAttendance && todayAttendance.length === 0 && !showCheckIn && (
        <EmptyState
          icon={<IoFootsteps size={36} />}
          title="No attendance today"
          description="Check in your first customer to start tracking"
          action={
            <PrimaryButton onClick={() => setShowCheckIn(true)}>
              <IoLogIn size={18} /> Check In Customer
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}
