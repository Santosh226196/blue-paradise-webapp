import { useState, useMemo } from "react";
import {
  useGetScheduleQuery,
  useCreateScheduleSlotMutation,
  useUpdateScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
} from "@/store/api/scheduleApi";
import { useGetStaffQuery } from "@/store/api/staffApi";
import {
  GlassCard,
  PrimaryButton,
  EmptyState,
  SkeletonGlass,
  Input,
} from "@/components/ui";
import { DayOfWeek } from "@/types";
import {
  IoCalendar,
  IoAdd,
  IoTrash,
  IoPencil,
  IoClose,
  IoWater,
  IoTime,
  IoPeople,
  IoLayers,
} from "react-icons/io5";

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getTodayName(): DayOfWeek {
  const idx = new Date().getDay();
  return DAYS[idx === 0 ? 6 : idx - 1];
}

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayName());
  const { data: allSlots, isLoading: weekLoading } = useGetScheduleQuery({});
  const { data: coaches } = useGetStaffQuery({ role: "COACH" });
  const [createSlot] = useCreateScheduleSlotMutation();
  const [updateSlot] = useUpdateScheduleSlotMutation();
  const [deleteSlot] = useDeleteScheduleSlotMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("07:00");
  const [type, setType] = useState<"LANE" | "COACHING" | "OPEN_SWIM">("LANE");
  const [label, setLabel] = useState("");
  const [lane, setLane] = useState("");
  const [coachId, setCoachId] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("8");

  const todayName = getTodayName();
  const displaySlots =
    viewMode === "week"
      ? allSlots
      : (allSlots?.filter((s) => s.day === selectedDay) ?? []);
  const isLoading = weekLoading;

  const weekStats = useMemo(() => {
    if (!allSlots)
      return { total: 0, lanes: 0, coaching: 0, open: 0, totalCapacity: 0 };
    return {
      total: allSlots.length,
      lanes: allSlots.filter((s) => s.type === "LANE").length,
      coaching: allSlots.filter((s) => s.type === "COACHING").length,
      open: allSlots.filter((s) => s.type === "OPEN_SWIM").length,
      totalCapacity: allSlots.reduce((sum, s) => sum + s.maxCapacity, 0),
    };
  }, [allSlots]);

  function resetForm() {
    setStartTime("06:00");
    setEndTime("07:00");
    setType("LANE");
    setLabel("");
    setLane("");
    setCoachId("");
    setMaxCapacity("8");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(slot: {
    id: string;
    startTime: string;
    endTime: string;
    type: "LANE" | "COACHING" | "OPEN_SWIM";
    label: string;
    lane?: number;
    coachId?: string;
    maxCapacity: number;
  }) {
    setEditingId(slot.id);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setType(slot.type);
    setLabel(slot.label);
    setLane(String(slot.lane ?? ""));
    setCoachId(slot.coachId ?? "");
    setMaxCapacity(String(slot.maxCapacity));
    setShowForm(true);
  }

  async function handleSave() {
    const payload = {
      day: selectedDay,
      startTime,
      endTime,
      type,
      label: label || `${type} Session`,
      lane: lane ? Number(lane) : undefined,
      coachId: coachId || undefined,
      maxCapacity: Number(maxCapacity),
      currentBookings: 0,
    };
    if (editingId) {
      await updateSlot({ id: editingId, data: payload });
    } else {
      await createSlot(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deleteSlot(id);
  }

  const typeConfig = {
    LANE: {
      label: "Lane",
      bg: "var(--glow-aqua)",
      color: "var(--accent-aqua)",
      icon: <IoWater size={14} />,
    },
    COACHING: {
      label: "Coaching",
      bg: "var(--glow-coral)",
      color: "var(--accent-coral)",
      icon: <IoTime size={14} />,
    },
    OPEN_SWIM: {
      label: "Open Swim",
      bg: "var(--glow-pool)",
      color: "var(--accent-pool)",
      icon: <IoPeople size={14} />,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-fg"
          >
            Schedule
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Weekly pool timetable & sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div
            className="flex rounded-xl overflow-hidden border-[1.5px] border-glass-border"
          >
            {(["week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-4 py-2 text-xs font-bold transition-all min-h-9 cursor-pointer"
                style={{
                  background:
                    viewMode === mode ? "var(--glow-aqua)" : "var(--glass-bg)",
                  color:
                    viewMode === mode
                      ? "var(--accent-aqua)"
                      : "var(--text-secondary)",
                }}
              >
                {mode === "week" ? "Week" : "Day"}
              </button>
            ))}
          </div>
          <PrimaryButton
            size="sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <IoAdd size={16} /> Add Slot
          </PrimaryButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Slots",
            value: weekStats.total,
            icon: <IoLayers size={16} />,
            color: "var(--accent-aqua)",
          },
          {
            label: "Lane Sessions",
            value: weekStats.lanes,
            icon: <IoWater size={16} />,
            color: "var(--accent-aqua)",
          },
          {
            label: "Coaching",
            value: weekStats.coaching,
            icon: <IoTime size={16} />,
            color: "var(--accent-coral)",
          },
          {
            label: "Open Swim",
            value: weekStats.open,
            icon: <IoPeople size={16} />,
            color: "var(--accent-pool)",
          },
        ].map((stat) => (
          <GlassCard
            key={stat.label}
            padding={false}
            className="p-3.5 animate-fade-up"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${stat.color}18`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p
                  className="text-lg font-bold font-mono leading-tight text-fg"
                >
                  {stat.value}
                </p>
                <p
                  className="text-[10px] font-bold uppercase text-fg-muted"
                >
                  {stat.label}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Day tabs (for week view) or single day (for day view) */}
      {viewMode === "week" ? (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DAYS.map((day) => {
            const dayCount = allSlots?.filter((s) => s.day === day).length ?? 0;
            const isToday = day === todayName;
            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setViewMode("day");
                }}
                className="relative flex flex-col items-center px-4 py-3 rounded-xl text-xs font-bold transition-all min-h-15 min-w-18 shrink-0 cursor-pointer"
                style={{
                  background: isToday ? "var(--glow-aqua)" : "var(--glass-bg)",
                  border: `1.5px solid ${isToday ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                  color: isToday
                    ? "var(--accent-aqua)"
                    : "var(--text-secondary)",
                }}
              >
                {isToday && (
                  <div
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent"
                  />
                )}
                <span className="text-[10px] uppercase mb-0.5">
                  {day.slice(0, 3)}
                </span>
                <span
                  className="text-lg font-mono font-bold"
                  style={{
                    color: isToday
                      ? "var(--accent-aqua)"
                      : "var(--text-primary)",
                  }}
                >
                  {dayCount}
                </span>
                <span
                  className="text-[9px] text-fg-muted"
                >
                  slots
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode("week")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              color: "var(--accent-aqua)",
              background: "var(--glow-aqua)",
            }}
          >
            ← Back to Week
          </button>
          <span
            className="text-sm font-bold text-fg"
          >
            {selectedDay}
          </span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-sm font-bold text-fg"
            >
              {editingId ? "Edit Slot" : `New Slot — ${selectedDay}`}
            </h2>
            <button
              onClick={resetForm}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
              style={{
                color: "var(--text-muted)",
                background: "var(--glass-bg)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--glass-bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg)";
              }}
            >
              <IoClose size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {/* Day picker */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-bold uppercase tracking-wider text-fg-muted"
              >
                Day
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                    style={{
                      background:
                        selectedDay === day
                          ? "var(--glow-aqua)"
                          : "var(--glass-bg)",
                      border: `1.5px solid ${selectedDay === day ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                      color:
                        selectedDay === day
                          ? "var(--accent-aqua)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type selector */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-bold uppercase tracking-wider text-fg-muted"
              >
                Session Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["LANE", "COACHING", "OPEN_SWIM"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold transition-all min-h-16 cursor-pointer"
                    style={{
                      background:
                        type === t ? typeConfig[t].bg : "var(--glass-bg)",
                      border: `1.5px solid ${type === t ? typeConfig[t].color : "var(--glass-border)"}`,
                      color:
                        type === t
                          ? typeConfig[t].color
                          : "var(--text-secondary)",
                    }}
                  >
                    {typeConfig[t].icon}
                    {typeConfig[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time row */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="font-mono"
              />
              <Input
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Details row */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Morning Lap Swim"
              />
              <Input
                label="Max Capacity"
                type="number"
                min={1}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Conditional fields */}
            {type === "LANE" && (
              <div className="space-y-2">
                <label
                  className="text-[11px] font-bold uppercase tracking-wider text-fg-muted"
                >
                  Lane Number
                </label>
                <Input
                  label="Lane Number"
                  type="number"
                  min={1}
                  max={10}
                  value={lane}
                  onChange={(e) => setLane(e.target.value)}
                  placeholder="1-10"
                  className="font-mono"
                />
              </div>
            )}
            {type === "COACHING" && (
              <div className="space-y-2">
                <label
                  className="text-[11px] font-bold uppercase tracking-wider text-fg-muted"
                >
                  Coach
                </label>
                <div className="flex gap-2 flex-wrap">
                  {coaches?.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCoachId(c.id)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                      style={{
                        background:
                          coachId === c.id
                            ? "var(--glow-aqua)"
                            : "var(--glass-bg)",
                        border: `1.5px solid ${coachId === c.id ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          coachId === c.id
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                  {(!coaches || coaches.length === 0) && (
                    <p
                      className="text-xs text-fg-muted"
                    >
                      No coaches. Add staff first.
                    </p>
                  )}
                </div>
              </div>
            )}
            <PrimaryButton onClick={handleSave} fullWidth>
              {editingId ? "Update Slot" : "Create Slot"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {/* Slots list */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SkeletonGlass lines={2} />
            <SkeletonGlass lines={2} />
            <SkeletonGlass lines={2} />
            <SkeletonGlass lines={2} />
          </div>
          <div className="flex gap-1.5">
            {DAYS.map((d) => (
              <SkeletonGlass key={d} lines={2} />
            ))}
          </div>
          <SkeletonGlass lines={3} />
          <SkeletonGlass lines={3} />
          <SkeletonGlass lines={3} />
        </div>
      ) : displaySlots && displaySlots.length > 0 ? (
        <div className="space-y-2">
          {[...displaySlots]
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((slot, i) => {
              const pct =
                slot.maxCapacity > 0
                  ? (slot.currentBookings / slot.maxCapacity) * 100
                  : 0;
              return (
                <GlassCard
                  key={slot.id}
                  padding={false}
                  className="animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="flex items-stretch">
                    {/* Color accent bar */}
                    <div
                      className="w-1 shrink-0"
                      style={{ background: typeConfig[slot.type].color }}
                    />

                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: typeConfig[slot.type].bg,
                              color: typeConfig[slot.type].color,
                            }}
                          >
                            {typeConfig[slot.type].icon}
                          </div>
                          <div>
                            <p
                              className="text-sm font-bold text-fg"
                            >
                              {slot.label}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="text-xs font-mono text-fg-muted"
                              >
                                {slot.startTime} — {slot.endTime}
                              </span>
                              <span
                                className="w-1 h-1 rounded-full bg-fg-muted"
                              />
                              <span
                                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                                style={{
                                  background: typeConfig[slot.type].bg,
                                  color: typeConfig[slot.type].color,
                                }}
                              >
                                {typeConfig[slot.type].label}
                              </span>
                              {slot.lane && (
                                <>
                                  <span
                                    className="w-1 h-1 rounded-full"
                                    style={{ background: "var(--text-muted)" }}
                                  />
                                  <span
                                    className="text-xs text-fg-muted"
                                  >
                                    Lane {slot.lane}
                                  </span>
                                </>
                              )}
                              {viewMode === "week" && (
                                <>
                                  <span
                                    className="w-1 h-1 rounded-full"
                                    style={{ background: "var(--text-muted)" }}
                                  />
                                  <span
                                    className="text-[10px] font-bold text-fg-muted"
                                  >
                                    {slot.day.slice(0, 3)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Capacity */}
                          <div className="text-right min-w-18">
                            <p
                              className="text-xs font-bold font-mono text-fg-dim"
                            >
                              {slot.currentBookings}/{slot.maxCapacity}
                            </p>
                            <div
                              className="w-full h-1.5 rounded-full mt-1.5 overflow-hidden bg-glass"
                            >
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  background:
                                    pct > 80
                                      ? "var(--accent-coral)"
                                      : typeConfig[slot.type].color,
                                }}
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleEdit({
                                  id: slot.id,
                                  startTime: slot.startTime,
                                  endTime: slot.endTime,
                                  type: slot.type,
                                  label: slot.label,
                                  lane: slot.lane,
                                  coachId: slot.coachId,
                                  maxCapacity: slot.maxCapacity,
                                })
                              }
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                              style={{
                                color: "var(--text-muted)",
                                background: "var(--glass-bg)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "var(--glass-bg-hover)";
                                e.currentTarget.style.color =
                                  "var(--text-primary)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "var(--glass-bg)";
                                e.currentTarget.style.color =
                                  "var(--text-muted)";
                              }}
                            >
                              <IoPencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(slot.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                              style={{
                                color: "var(--text-muted)",
                                background: "var(--glass-bg)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(255,122,89,0.1)";
                                e.currentTarget.style.color =
                                  "var(--accent-coral)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "var(--glass-bg)";
                                e.currentTarget.style.color =
                                  "var(--text-muted)";
                              }}
                            >
                              <IoTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
        </div>
      ) : (
        <EmptyState
          icon={<IoCalendar size={36} />}
          title="No slots scheduled"
          description={
            viewMode === "week"
              ? "Add time slots to build your weekly timetable"
              : `No slots for ${selectedDay}`
          }
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Add Slot
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}
