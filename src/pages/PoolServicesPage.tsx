import { useState } from "react";
import {
  useGetPoolServicesQuery,
  useCreatePoolServiceMutation,
  useUpdatePoolServiceMutation,
  useDeletePoolServiceMutation,
} from "@/store/api/poolServicesApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  EmptyState,
  SkeletonGlass,
  Input,
} from "@/components/ui";
import {
  IoWater,
  IoAdd,
  IoTrash,
  IoPencil,
  IoClose,
  IoBuild,
  IoOptions,
  IoFlask,
  IoSparkles,
  IoCheckmarkCircle,
  IoAlertCircle,
} from "react-icons/io5";
import type {
  PoolService,
  PoolServiceStatus,
  PoolServiceCreatePayload,
} from "@/types";

const categoryIcon: Record<string, React.ReactNode> = {
  Equipment: <IoOptions size={16} />,
  Cleaning: <IoBuild size={16} />,
  Chemical: <IoFlask size={16} />,
  Water: <IoWater size={16} />,
};

function statusChip(status: PoolServiceStatus): {
  bg: string;
  color: string;
  label: string;
} {
  if (status === "overdue")
    return { bg: "var(--glow-coral)", color: "var(--accent-coral)", label: "Overdue" };
  if (status === "completed")
    return { bg: "var(--glow-pool)", color: "var(--accent-pool)", label: "Done" };
  return { bg: "var(--glow-aqua)", color: "var(--accent-aqua)", label: "Upcoming" };
}

export function PoolServicesPage() {
  const { data: services, isLoading, isError, refetch } =
    useGetPoolServicesQuery();
  const [createService] = useCreatePoolServiceMutation();
  const [updateService] = useUpdatePoolServiceMutation();
  const [deleteService] = useDeletePoolServiceMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cleaning");
  const [frequencyDays, setFrequencyDays] = useState("7");
  const [status, setStatus] = useState<PoolServiceStatus>("upcoming");
  const [lastDone, setLastDone] = useState("");
  const [notes, setNotes] = useState("");

  function resetForm() {
    setName("");
    setCategory("Cleaning");
    setFrequencyDays("7");
    setStatus("upcoming");
    setLastDone("");
    setNotes("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(s: PoolService) {
    setEditingId(s.id);
    setName(s.name);
    setCategory(s.category);
    setFrequencyDays(String(s.frequencyDays));
    setStatus(s.status);
    setLastDone(s.lastDone?.split("T")[0] ?? "");
    setNotes(s.notes ?? "");
    setShowForm(true);
  }

  function computeNextDue(freqDays: number, last: string): string {
    if (!last) return "";
    const d = new Date(last);
    d.setDate(d.getDate() + freqDays);
    return d.toISOString().split("T")[0];
  }

  async function handleSave() {
    const freq = parseInt(frequencyDays, 10) || 7;
    const payload: PoolServiceCreatePayload = {
      name,
      category,
      frequencyDays: freq,
      status,
      lastDone: lastDone || undefined,
      notes: notes || undefined,
    };
    if (lastDone) payload.nextDue = computeNextDue(freq, lastDone);

    if (editingId) {
      await updateService({ id: editingId, data: payload });
    } else {
      await createService(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deleteService(id);
  }

  if (isLoading)
    return (
      <div className="space-y-6">
        <SkeletonGlass lines={1} />
        <SkeletonGlass lines={3} />
        <SkeletonGlass lines={2} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg">
            Swimming Pool Services
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Maintenance & cleaning services for the pool
          </p>
        </div>
        <PrimaryButton
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IoAdd size={16} /> New Service
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-fg">
              {editingId ? "Edit Service" : "Add Pool Service"}
            </h2>
            <button
              onClick={resetForm}
              className="text-fg-muted cursor-pointer"
            >
              <IoClose size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Service Name
                </label>
                <Input
                  label="Service Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Filter Service, Tank Cleaning"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Category
                </label>
                <div className="flex gap-2 flex-wrap">
                  {["Cleaning", "Equipment", "Chemical", "Water"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className="flex-1 min-w-20 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-h-10 cursor-pointer"
                      style={{
                        background:
                          category === c
                            ? "var(--glow-aqua)"
                            : "var(--glass-bg)",
                        border: `1.5px solid ${category === c ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          category === c
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Frequency (days)
                </label>
                <Input
                  label="Frequency (days)"
                  type="number"
                  min={1}
                  value={frequencyDays}
                  onChange={(e) => setFrequencyDays(e.target.value)}
                  placeholder="e.g. 7"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Last Done Date
                </label>
                <Input
                  label="Last Done"
                  type="date"
                  value={lastDone}
                  onChange={(e) => setLastDone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Status
              </label>
              <div className="flex gap-2">
                {(
                  [
                    ["upcoming", "Upcoming", "var(--accent-aqua)", "var(--glow-aqua)"],
                    ["overdue", "Overdue", "var(--accent-coral)", "var(--glow-coral)"],
                    ["completed", "Done", "var(--accent-pool)", "var(--glow-pool)"],
                  ] as const
                ).map(([val, label, color, bg]) => (
                  <button
                    key={val}
                    onClick={() => setStatus(val)}
                    className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-h-10 cursor-pointer"
                    style={{
                      background: status === val ? bg : "var(--glass-bg)",
                      border: `1.5px solid ${status === val ? color : "var(--glass-border)"}`,
                      color: status === val ? color : "var(--text-secondary)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes or instructions..."
                className="w-full px-4 py-3 rounded-xl text-sm font-medium resize-none min-h-14 border border-input-border bg-input text-fg outline-none focus:border-input-focus"
              />
            </div>

            <PrimaryButton
              onClick={handleSave}
              fullWidth
              disabled={!name}
            >
              {editingId ? "Update Service" : "Add Service"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonGlass lines={3} />
          <SkeletonGlass lines={3} />
        </div>
      ) : isError ? (
        <GlassCard>
          <div className="flex flex-col items-center py-10 text-center">
            <div
              className="mb-5 p-4 rounded-2xl"
              style={{ background: "var(--glow-coral)", color: "var(--accent-coral)" }}
            >
              <IoAlertCircle size={36} />
            </div>
            <h3 className="text-lg font-bold mb-1.5 text-fg">Couldn't load services</h3>
            <p className="text-sm max-w-sm mb-6 text-fg-dim">
              The service data couldn't be fetched. Check your connection.
            </p>
            <GhostButton onClick={() => refetch()}>Retry</GhostButton>
          </div>
        </GlassCard>
      ) : services && services.length > 0 ? (
        <div className="space-y-3">
          {services.map((s, i) => {
            const chip = statusChip(s.status);
            const icon = categoryIcon[s.category] ?? <IoSparkles size={16} />;
            return (
              <GlassCard
                key={s.id}
                padding={false}
                className="p-5 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: chip.bg,
                        color: chip.color,
                      }}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-fg truncate">
                        {s.name}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                        {s.category} · every {s.frequencyDays} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <GhostButton size="sm" onClick={() => handleEdit(s)}>
                      <IoPencil size={14} />
                    </GhostButton>
                    <GhostButton
                      size="sm"
                      onClick={() => handleDelete(s.id)}
                      className="text-danger"
                    >
                      <IoTrash size={14} />
                    </GhostButton>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-fg-muted">
                    {s.lastDone ? `Last done: ${new Date(s.lastDone).toLocaleDateString()}` : "Not done yet"}
                    {s.nextDue
                      ? ` · Next: ${new Date(s.nextDue).toLocaleDateString()}`
                      : ""}
                  </p>
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{ background: chip.bg, color: chip.color }}
                  >
                    {s.status === "completed" ? (
                      <IoCheckmarkCircle size={12} />
                    ) : s.status === "overdue" ? (
                      <IoAlertCircle size={12} />
                    ) : (
                      <IoWater size={12} />
                    )}
                    {chip.label}
                  </span>
                </div>
                {s.notes && (
                  <p className="mt-2 text-xs text-fg-dim">{s.notes}</p>
                )}
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<IoWater size={36} />}
          title="No pool services yet"
          description="Add services like Filter Service, Tank Cleaning, Water Cleaning and more"
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Add Pool Service
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}
