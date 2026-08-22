import { useState } from "react";
import {
  useGetTodayAttendanceQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useGetCurrentlyInPoolQuery,
} from "@/store/api/attendanceApi";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import { GlassCard, PrimaryButton, GhostButton, EmptyState, SkeletonGlass, CameraCaptureModal } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import {
  IoFootsteps, IoLogIn, IoLogOut, IoSearch, IoPeople, IoClose,
  IoCamera, IoTrashOutline,
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
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; photoUrl?: string } | null>(null);
  const [visitType, setVisitType] = useState<string>(VisitType.Membership);
  const [lane, setLane] = useState("");
  const [checkInPhoto, setCheckInPhoto] = useState<string | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  function resetCheckIn() {
    setSearch("");
    setSelectedCustomer(null);
    setVisitType(VisitType.Membership);
    setLane("");
    setCheckInPhoto(null);
    setShowCheckIn(false);
  }

  async function handleCheckIn() {
    if (!selectedCustomer) return;
    await checkIn({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      visitType,
      lane: lane ? Number(lane) : undefined,
      photoUrl: checkInPhoto || selectedCustomer.photoUrl,
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
      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={(photo) => setCheckInPhoto(photo)}
        title={`Check-In Photo for ${selectedCustomer?.name ?? "Member"}`}
        guideMode="avatar"
        initialFacingMode="environment"
      />

      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Live Attendance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track daily pool entries, lane allocations, and verification photos
          </p>
        </div>
        <PrimaryButton size="sm" onClick={() => setShowCheckIn(true)}>
          <IoLogIn size={16} /> Check In
        </PrimaryButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard padding={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-400/15 text-cyan-300">
              <IoPeople size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>{currentlyInPool.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Swimmers In Pool</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding={false} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-400/15 text-teal-300">
              <IoFootsteps size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>{todayAttendance?.length ?? 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Visits Today</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Check-in Form Modal */}
      {showCheckIn && (
        <GlassCard className="animate-scale-in border-cyan-400/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Check In Customer at Gate
            </h2>
            <button onClick={resetCheckIn} className="text-slate-400 hover:text-white"><IoClose size={20} /></button>
          </div>
          <div className="space-y-4">
            {!selectedCustomer ? (
              <>
                <div className="relative">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search member by name or mobile..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px]"
                    style={inputStyle}
                  />
                </div>
                {customers && customers.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {customers.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomer({ id: c.id, name: c.name, photoUrl: c.photoUrl });
                          setSearch("");
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all min-h-[44px] flex items-center justify-between"
                        style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glass-bg-hover)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--glass-bg)"; }}
                      >
                        <div className="flex items-center gap-3">
                          {c.photoUrl ? (
                            <img src={c.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-cyan-400" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                              {c.name[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-xs font-mono text-slate-400">{c.mobile}</p>
                          </div>
                        </div>
                        <span className="text-xs text-cyan-400 font-bold">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  className="flex items-center justify-between p-4 rounded-xl border border-cyan-400/40 bg-cyan-400/10"
                >
                  <div className="flex items-center gap-3">
                    {selectedCustomer.photoUrl || checkInPhoto ? (
                      <img src={checkInPhoto || selectedCustomer.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-cyan-400" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-sm font-bold">
                        {selectedCustomer.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-white">{selectedCustomer.name}</p>
                      <p className="text-xs text-cyan-200">Selected for pool entry</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white">
                    <IoClose size={16} />
                  </button>
                </div>

                {/* Gate Camera Photo Capture */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-black/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {checkInPhoto ? (
                      <img src={checkInPhoto} alt="Snap" className="w-12 h-12 rounded-lg object-cover border border-emerald-400" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                        <IoCamera size={22} />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white">Entry Verification Photo</p>
                      <p className="text-[11px] text-slate-400">
                        {checkInPhoto ? "Photo verified for entry" : "Snap live photo at gate (optional)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {checkInPhoto && (
                      <button
                        type="button"
                        onClick={() => setCheckInPhoto(null)}
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                        title="Remove snap"
                      >
                        <IoTrashOutline size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCameraModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-400/30 flex items-center gap-1"
                    >
                      <IoCamera size={14} />
                      <span>{checkInPhoto ? "Retake" : "Take Snap"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Visit Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(visitTypeLabels).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setVisitType(val)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                          visitType === val
                            ? "bg-cyan-400/20 border-cyan-400 text-cyan-300 border"
                            : "bg-white/5 border-white/10 text-slate-400 border hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Lane Allocation (Optional)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={lane}
                    onChange={(e) => setLane(e.target.value)}
                    placeholder="Lane number (e.g. 1-8)"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium font-mono min-h-[44px]"
                    style={inputStyle}
                  />
                </div>

                <PrimaryButton onClick={handleCheckIn} fullWidth size="lg">
                  <IoLogIn size={18} /> Confirm Check In
                </PrimaryButton>
              </>
            )}
          </div>
        </GlassCard>
      )}

      {/* Currently In Pool */}
      <GlassCard>
        <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Currently In Pool ({currentlyInPool.length})
        </h2>
        {currentlyInPool.length > 0 ? (
          <div className="space-y-2">
            {currentlyInPool.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {r.photoUrl ? (
                    <img src={r.photoUrl} alt="" loading="lazy" className="w-10 h-10 rounded-xl object-cover border border-cyan-400" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center font-bold text-sm">
                      {r.customerName[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{r.customerName}</p>
                    <p className="text-xs font-mono text-slate-400">
                      In at {formatTime(r.checkInTime)} · {visitTypeLabels[r.visitType] ?? r.visitType}
                      {r.lane ? ` · Lane ${r.lane}` : ""}
                    </p>
                  </div>
                </div>
                <GhostButton size="sm" onClick={() => handleCheckOut(r.id)} style={{ color: "var(--accent-coral)" }}>
                  <IoLogOut size={14} /> Check Out
                </GhostButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-6 text-slate-400">No one currently in the pool</p>
        )}
      </GlassCard>

      {/* Today's Check-outs */}
      {checkedOut.length > 0 && (
        <GlassCard>
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Checked Out Today ({checkedOut.length})
          </h2>
          <div className="space-y-2">
            {checkedOut.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {r.photoUrl ? (
                    <img src={r.photoUrl} alt="" loading="lazy" className="w-9 h-9 rounded-lg object-cover border border-slate-600 opacity-80" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center font-bold text-xs">
                      {r.customerName[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{r.customerName}</p>
                    <p className="text-xs font-mono text-slate-400">
                      {formatTime(r.checkInTime)} → {formatTime(r.checkOutTime!)} · {visitTypeLabels[r.visitType] ?? r.visitType}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Completed
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
