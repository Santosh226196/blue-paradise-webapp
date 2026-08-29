import { useState } from "react";
import {
  useGetMembershipPlansQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useDeleteMembershipPlanMutation,
} from "@/store/api/membershipPlansApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  EmptyState,
  SkeletonGlass,
  Input,
} from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  IoCard,
  IoAdd,
  IoTrash,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoPencil,
  IoClose,
} from "react-icons/io5";

export function MembershipPlansPage() {
  const { data: plans, isLoading } = useGetMembershipPlansQuery();
  const [createPlan] = useCreateMembershipPlanMutation();
  const [updatePlan] = useUpdateMembershipPlanMutation();
  const [deletePlan] = useDeleteMembershipPlanMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<"HOURLY" | "DAILY" | "MONTHLY" | "QUARTERLY" | "YEARLY">(
    "MONTHLY",
  );
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
    duration: "HOURLY" | "DAILY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
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

  const durationLabels = {
    HOURLY: "Hourly",
    DAILY: "Daily",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    YEARLY: "Yearly",
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        <SkeletonGlass lines={1} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={4} />
          <SkeletonGlass lines={4} />
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-fg"
          >
            Membership Plans
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Configure plans and pricing
          </p>
        </div>
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
            <h2
              className="text-sm font-bold text-fg"
            >
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
              <label
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
                Duration
              </label>
              <div className="flex gap-2">
                {(["HOURLY", "DAILY", "MONTHLY", "QUARTERLY", "YEARLY"] as const).map((d) => (
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
              <label
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
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
                    <IoCheckmarkCircle
                      size={14}
                      className="text-accent"
                    />
                  ) : (
                    <IoCloseCircle
                      size={14}
                      className="text-fg-muted"
                    />
                  )}
                </div>
              </div>
              <h3
                className="font-display text-lg font-bold mb-1 text-fg"
              >
                {plan.name}
              </h3>
              <p
                className="text-2xl font-bold font-mono mb-3 text-accent"
              >
                {formatCurrency(plan.price)}
              </p>
              <p
                className="text-xs mb-4 text-fg-dim"
              >
                {plan.description}
              </p>
              {plan.features.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  {plan.features?.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <IoCheckmarkCircle
                        size={12}
                        className="text-accent"
                      />
                      <span
                        className="text-xs text-fg-dim"
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div
                className="flex gap-2 pt-3" border-t border-glass-border
              >
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
