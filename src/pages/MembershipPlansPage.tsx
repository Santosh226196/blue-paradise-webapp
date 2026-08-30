import { useState } from "react";
import {
  useGetMembershipPlansQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useDeleteMembershipPlanMutation,
} from "@/store/api/membershipPlansApi";
import {
  useGetMembershipBatchesQuery,
  useCreateMembershipBatchMutation,
  useUpdateMembershipBatchMutation,
  useDeleteMembershipBatchMutation,
} from "@/store/api/membershipBatchesApi";
import { useGetStaffQuery } from "@/store/api/staffApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  EmptyState,
  SkeletonGlass,
  Input,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  IoCard,
  IoAdd,
  IoTrash,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoPencil,
  IoClose,
  IoPeople,
} from "react-icons/io5";

const DURATIONS = ["HOURLY", "DAILY", "MONTHLY", "QUARTERLY", "YEARLY"] as const;
type Duration = (typeof DURATIONS)[number];

const durationLabels: Record<Duration, string> = {
  HOURLY: "Hourly",
  DAILY: "Daily",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

const BATCH_STATUSES = ["ACTIVE", "UPCOMING", "COMPLETED", "CANCELLED"] as const;
type BatchStatus = (typeof BATCH_STATUSES)[number];

const batchStatusLabels: Record<BatchStatus, string> = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const batchStatusColors: Record<BatchStatus, string> = {
  ACTIVE: "var(--accent-aqua)",
  UPCOMING: "var(--accent-pool)",
  COMPLETED: "var(--accent-coral)",
  CANCELLED: "var(--text-muted)",
};

const BATCH_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
type BatchLevel = (typeof BATCH_LEVELS)[number];
const batchLevelLabels: Record<BatchLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const AGE_GROUPS = ["KIDS", "TEENS", "ADULTS", "ALL"] as const;
type AgeGroup = (typeof AGE_GROUPS)[number];
const ageGroupLabels: Record<AgeGroup, string> = {
  KIDS: "Kids",
  TEENS: "Teens",
  ADULTS: "Adults",
  ALL: "All",
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

function TabSwitcher({
  active,
  onChange,
}: {
  active: "plan" | "batch";
  onChange: (tab: "plan" | "batch") => void;
}) {
  return (
    <div
      className="flex rounded-xl overflow-hidden border-[1.5px] border-glass-border"
      style={{ alignSelf: "flex-start" }}
    >
      {(["plan", "batch"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="px-5 py-2 text-xs font-bold transition-all min-h-9 cursor-pointer capitalize"
          style={{
            background:
              active === tab ? "var(--glow-aqua)" : "var(--glass-bg)",
            color: active === tab ? "var(--accent-aqua)" : "var(--text-secondary)",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function PlanTab({
  activeTab,
  setActiveTab,
}: {
  activeTab: "plan" | "batch";
  setActiveTab: (tab: "plan" | "batch") => void;
}) {
  const { data: plans, isLoading } = useGetMembershipPlansQuery();
  const [createPlan] = useCreateMembershipPlanMutation();
  const [updatePlan] = useUpdateMembershipPlanMutation();
  const [deletePlan] = useDeleteMembershipPlanMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<Duration>("MONTHLY");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");

  function resetForm() {
    setName("");
    setDescription("");
    setDuration("MONTHLY");
    setPrice("");
    setFeatures("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(plan: {
    id: string;
    name: string;
    description: string;
    duration: Duration;
    price: number;
    features: string[];
  }) {
    setEditingId(plan.id);
    setName(plan.name);
    setDescription(plan.description);
    setDuration(plan.duration);
    setPrice(String(plan.price));
    setFeatures(plan.features.join(", "));
    setShowForm(true);
  }

  async function handleSave() {
    const payload = {
      name,
      description,
      duration,
      price: Number(price),
      features: features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      isActive: true,
    };
    if (editingId) {
      await updatePlan({ id: editingId, data: payload });
    } else {
      await createPlan(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deletePlan(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 animate-fade-up">
        <TabSwitcher active={activeTab} onChange={setActiveTab} />
        <div className="flex-1" />
        <PrimaryButton
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IoAdd size={16} /> New Plan
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-fg">
              {editingId ? "Edit Plan" : "New Plan"}
            </h2>
            <button onClick={resetForm} className="text-fg-muted cursor-pointer">
              <IoClose size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  label="Plan Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Monthly"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Price (₹)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1500"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Duration
              </label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-h-10 cursor-pointer"
                    style={{
                      background:
                        duration === d ? "var(--glow-aqua)" : "var(--glass-bg)",
                      border: `1.5px solid ${duration === d ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                      color:
                        duration === d
                          ? "var(--accent-aqua)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {durationLabels[d]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of the plan"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium resize-none min-h-11 border border-input-border bg-input text-fg outline-none focus:border-input-focus"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Features (comma-separated)"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. Pool access, Locker, Towel"
              />
            </div>
            <PrimaryButton
              onClick={handleSave}
              fullWidth
              disabled={!name || !price}
            >
              {editingId ? "Update Plan" : "Create Plan"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={4} />
        </div>
      ) : plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map((plan, i) => (
            <GlassCard
              key={plan.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IoCard size={18} className="text-accent" />
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--glow-aqua)",
                      color: "var(--accent-aqua)",
                    }}
                  >
                    {durationLabels[plan.duration]}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {plan.isActive ? (
                    <IoCheckmarkCircle size={14} className="text-accent" />
                  ) : (
                    <IoCloseCircle size={14} className="text-fg-muted" />
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg font-bold mb-1 text-fg">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold font-mono mb-3 text-accent">
                {formatCurrency(plan.price)}
              </p>
              <p className="text-xs mb-4 text-fg-dim">{plan.description}</p>
              {plan.features.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  {plan.features?.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <IoCheckmarkCircle
                        size={12}
                        className="text-accent"
                      />
                      <span className="text-xs text-fg-dim">{f}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                <GhostButton
                  size="sm"
                  onClick={() =>
                    handleEdit({
                      id: plan.id,
                      name: plan.name,
                      description: plan.description,
                      duration: plan.duration,
                      price: plan.price,
                      features: plan.features,
                    })
                  }
                  className="flex-1"
                >
                  <IoPencil size={14} /> Edit
                </GhostButton>
                <GhostButton
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 text-danger"
                >
                  <IoTrash size={14} /> Delete
                </GhostButton>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoCard size={36} />}
          title="No membership plans"
          description="Create your first membership plan to get started"
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Create Plan
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}

function BatchesTab({
  activeTab,
  setActiveTab,
}: {
  activeTab: "plan" | "batch";
  setActiveTab: (tab: "plan" | "batch") => void;
}) {
  const { data: batches, isLoading } = useGetMembershipBatchesQuery();
  const { data: plans } = useGetMembershipPlansQuery();
  const { data: staff } = useGetStaffQuery({ role: "COACH" });
  const [createBatch] = useCreateMembershipBatchMutation();
  const [updateBatch] = useUpdateMembershipBatchMutation();
  const [deleteBatch] = useDeleteMembershipBatchMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [planId, setPlanId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [level, setLevel] = useState<BatchLevel>("BEGINNER");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("ALL");
  const [coachId, setCoachId] = useState("");
  const [coach, setCoach] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [status, setStatus] = useState<BatchStatus>("ACTIVE");

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function resetForm() {
    setName("");
    setDescription("");
    setPlanId("");
    setStartDate("");
    setEndDate("");
    setDays([]);
    setStartTime("");
    setEndTime("");
    setLevel("BEGINNER");
    setAgeGroup("ALL");
    setCoachId("");
    setCoach("");
    setMaxMembers("");
    setStatus("ACTIVE");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(batch: {
    id: string;
    name: string;
    description: string;
    planId?: string | null;
    startDate: string;
    endDate: string;
    days?: string[];
    startTime?: string;
    endTime?: string;
    level?: BatchLevel;
    ageGroup?: AgeGroup;
    coachId?: string | null;
    coach?: string;
    maxMembers: number;
    status: BatchStatus;
  }) {
    setEditingId(batch.id);
    setName(batch.name);
    setDescription(batch.description);
    setPlanId(batch.planId ?? "");
    setStartDate(batch.startDate.slice(0, 10));
    setEndDate(batch.endDate.slice(0, 10));
    setDays(batch.days ?? []);
    setStartTime(batch.startTime ?? "");
    setEndTime(batch.endTime ?? "");
    setLevel(batch.level ?? "BEGINNER");
    setAgeGroup(batch.ageGroup ?? "ALL");
    setCoachId(batch.coachId ?? "");
    setCoach(batch.coach ?? "");
    setMaxMembers(String(batch.maxMembers));
    setStatus(batch.status);
    setShowForm(true);
  }

  async function handleSave() {
    const payload = {
      name,
      description,
      planId: planId || undefined,
      startDate,
      endDate,
      days,
      startTime,
      endTime,
      level,
      ageGroup,
      coachId: coachId || null,
      coach: coachId ? (staff?.find((s) => s.id === coachId)?.name ?? coach) : coach,
      maxMembers: Number(maxMembers),
      status,
    };
    if (editingId) {
      await updateBatch({ id: editingId, data: payload });
    } else {
      await createBatch(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deleteBatch(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 animate-fade-up">
        <TabSwitcher active={activeTab} onChange={setActiveTab} />
        <div className="flex-1" />
        <PrimaryButton
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IoAdd size={16} /> New Batch
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-fg">
              {editingId ? "Edit Batch" : "New Batch"}
            </h2>
            <button onClick={resetForm} className="text-fg-muted cursor-pointer">
              <IoClose size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  label="Batch Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning Batch A"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Max Members"
                  type="number"
                  min={1}
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  placeholder="15"
                  className="font-mono"
                />
              </div>
            </div>

            {plans && plans.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Linked Plan
                </label>
                <div className="flex gap-2 flex-wrap">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                      style={{
                        background:
                          planId === p.id ? "var(--glow-aqua)" : "var(--glass-bg)",
                        border: `1.5px solid ${planId === p.id ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          planId === p.id
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="font-mono"
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Days (tap to toggle)
              </label>
              <div className="flex gap-2 flex-wrap">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                    style={{
                      background: days.includes(day)
                        ? "var(--glow-aqua)"
                        : "var(--glass-bg)",
                      border: `1.5px solid ${days.includes(day) ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                      color: days.includes(day)
                        ? "var(--accent-aqua)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Level
                </label>
                <div className="flex gap-2 flex-wrap">
                  {BATCH_LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                      style={{
                        background:
                          level === l ? "var(--glow-aqua)" : "var(--glass-bg)",
                        border: `1.5px solid ${level === l ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          level === l
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {batchLevelLabels[l]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Age Group
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AGE_GROUPS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setAgeGroup(g)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                      style={{
                        background:
                          ageGroup === g ? "var(--glow-aqua)" : "var(--glass-bg)",
                        border: `1.5px solid ${ageGroup === g ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          ageGroup === g
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {ageGroupLabels[g]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {staff && staff.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Coach
                </label>
                <div className="flex gap-2 flex-wrap">
                  {staff.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCoachId(s.id)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                      style={{
                        background:
                          coachId === s.id ? "var(--glow-aqua)" : "var(--glass-bg)",
                        border: `1.5px solid ${coachId === s.id ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          coachId === s.id
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {BATCH_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                    style={{
                      background:
                        status === s ? "var(--glow-aqua)" : "var(--glass-bg)",
                      border: `1.5px solid ${status === s ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                      color:
                        status === s
                          ? "var(--accent-aqua)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {batchStatusLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of the batch"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium resize-none min-h-11 border border-input-border bg-input text-fg outline-none focus:border-input-focus"
              />
            </div>

            <PrimaryButton
              onClick={handleSave}
              fullWidth
              disabled={!name || !maxMembers}
            >
              {editingId ? "Update Batch" : "Create Batch"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={4} />
        </div>
      ) : batches && batches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches?.map((batch, i) => {
            const plan = plans?.find((p) => p.id === batch.planId);
            const pct =
              batch.maxMembers > 0
                ? Math.min(
                    100,
                    (batch.currentMembers / batch.maxMembers) * 100,
                  )
                : 0;
            return (
              <GlassCard
                key={batch.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IoPeople size={18} className="text-accent" />
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--glow-aqua)",
                        color: batchStatusColors[batch.status],
                      }}
                    >
                      {batchStatusLabels[batch.status]}
                    </span>
                  </div>
                  <IoCheckmarkCircle size={14} className="text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold mb-1 text-fg">
                  {batch.name}
                </h3>
                {plan && (
                  <p className="text-xs font-bold text-accent mb-1">
                    {plan.name}
                  </p>
                )}
                <div className="text-xs font-mono text-fg-muted mb-2">
                  {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
                </div>
                {(batch.days?.length > 0 || batch.startTime || batch.coach) && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {batch.days?.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-glass text-fg-dim">
                        {batch.days.map((d) => d.slice(0, 3)).join(" · ")}
                      </span>
                    )}
                    {batch.startTime && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-glass text-fg-dim">
                        {batch.startTime}–{batch.endTime}
                      </span>
                    )}
                    {batch.level && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-glass text-accent">
                        {batchLevelLabels[batch.level]}
                      </span>
                    )}
                    {batch.ageGroup && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-glass text-fg-dim">
                        {ageGroupLabels[batch.ageGroup]}
                      </span>
                    )}
                    {batch.coach && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-glass text-fg-dim">
                        {batch.coach}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-xs mb-4 text-fg-dim">{batch.description}</p>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-fg-dim">
                      {batch.currentMembers}/{batch.maxMembers} members
                    </span>
                    <span className="text-fg-muted">{Math.round(pct)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-glass">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: batchStatusColors[batch.status],
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <GhostButton
                    size="sm"
                    onClick={() =>
                      handleEdit({
                        id: batch.id,
                        name: batch.name,
                        description: batch.description,
                        planId: batch.planId,
                        startDate: batch.startDate,
                        endDate: batch.endDate,
                        days: batch.days,
                        startTime: batch.startTime,
                        endTime: batch.endTime,
                        level: batch.level,
                        ageGroup: batch.ageGroup,
                        coachId: batch.coachId,
                        coach: batch.coach,
                        maxMembers: batch.maxMembers,
                        status: batch.status,
                      })
                    }
                    className="flex-1"
                  >
                    <IoPencil size={14} /> Edit
                  </GhostButton>
                  <GhostButton
                    size="sm"
                    onClick={() => handleDelete(batch.id)}
                    className="flex-1 text-danger"
                  >
                    <IoTrash size={14} /> Delete
                  </GhostButton>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<IoPeople size={36} />}
          title="No membership batches"
          description="Create your first membership batch to get started"
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Create Batch
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}

export function MembershipPlansPage() {
  const [activeTab, setActiveTab] = useState<"plan" | "batch">("plan");

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg">
          Membership Plans
        </h1>
        <p className="text-sm mt-0.5 text-fg-muted">
          Configure plans and batches
        </p>
      </div>

      {activeTab === "plan" ? (
        <PlanTab activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <BatchesTab activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
