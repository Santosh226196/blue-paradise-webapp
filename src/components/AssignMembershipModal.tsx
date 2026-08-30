import { useState } from "react";
import {
  useGetMembershipPlansQuery,
} from "@/store/api/membershipPlansApi";
import {
  useGetMembershipBatchesQuery,
} from "@/store/api/membershipBatchesApi";
import { useCreateTransactionMutation } from "@/store/api/billingApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  SkeletonGlass,
  StepperHeader,
} from "@/components/ui";
import {
  ServiceType,
  type PaymentMethod,
  type MembershipPlan,
  type MembershipBatch,
} from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  IoClose,
  IoCashOutline,
  IoQrCodeOutline,
  IoCardOutline,
} from "react-icons/io5";

const STEPS = ["Plan", "Batch", "Payment"];

type LevelLabel = Record<string, string>;

export function AssignMembershipModal({
  customerId,
  customerName,
  isOpen,
  onClose,
  onAssigned,
}: {
  customerId: string;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
  onAssigned?: () => void;
}) {
  const { data: plans, isLoading: plansLoading } = useGetMembershipPlansQuery();
  const { data: batches, isLoading: batchesLoading } =
    useGetMembershipBatchesQuery();
  const [createTransaction, { isLoading: saving }] =
    useCreateTransactionMutation();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<MembershipBatch | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const activePlans = plans?.filter((p) => p.isActive) ?? [];
  const activeBatches = batches?.filter((b) => b.status === "ACTIVE") ?? [];
  const batchLabel: LevelLabel = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };

  function isBatchFull(b: MembershipBatch) {
    return b.currentMembers >= b.maxMembers;
  }

  function reset() {
    setStep(0);
    setSelectedPlan(null);
    setSelectedBatch(null);
    setPaymentMethod("CASH");
    setErrorMessage("");
  }

  async function handleConfirm() {
    if (!selectedPlan) return;
    setErrorMessage("");
    const serviceName = selectedPlan.name;
    const amount = selectedPlan.price;
    const startDate = new Date().toISOString();
    try {
      await createTransaction({
        customerId,
        serviceType: ServiceType.Membership,
        serviceName,
        amount,
        paymentMethod,
        planId: selectedPlan.id,
        batchId: selectedBatch?.id,
        startDate,
      }).unwrap();
      showToast("success", "Membership assigned successfully");
      reset();
      onClose();
      onAssigned?.();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to assign membership. Please try again.";
      setErrorMessage(message);
      showToast("error", message);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-up overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
    >
      <GlassCard className="w-full max-w-2xl animate-scale-in relative">
        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-fg-muted cursor-pointer"
        >
          <IoClose size={20} />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-fg">
            Assign Membership — {customerName}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Create a membership with an optional class batch
          </p>
        </div>

        <StepperHeader steps={STEPS} currentStep={step} />

        <div className="mt-5 space-y-5">
          {/* Step 0: Plan */}
          {step === 0 && (
            <div className="space-y-3 animate-fade-up">
              {plansLoading ? (
                <SkeletonGlass lines={2} />
              ) : activePlans.length > 0 ? (
                activePlans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`w-full p-3.5 text-left transition-all duration-200 rounded-2xl border flex items-center justify-between cursor-pointer ${
                      selectedPlan?.id === p.id
                        ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                        : "bg-white/5 border-white/10 hover:border-cyan-400/40"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-fg">{p.name}</p>
                      <p className="text-xs font-mono text-fg-muted">
                        {p.duration}
                      </p>
                    </div>
                    <span className="text-sm font-bold font-mono text-accent">
                      {formatCurrency(p.price)}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-fg-muted">
                  No active membership plans. Add plans in Membership Plans
                  first.
                </p>
              )}
              <PrimaryButton
                fullWidth
                disabled={!selectedPlan}
                onClick={() => setStep(1)}
              >
                Continue
              </PrimaryButton>
            </div>
          )}

          {/* Step 1: Batch */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-up">
              {batchesLoading ? (
                <SkeletonGlass lines={2} />
              ) : activeBatches.length > 0 ? (
                <>
                  <p className="text-xs text-fg-muted">
                    Optional — assign a class batch to this membership
                  </p>
                  {activeBatches.map((b) => {
                    const full = isBatchFull(b);
                    return (
                      <button
                        key={b.id}
                        disabled={full}
                        onClick={() =>
                          setSelectedBatch(selectedBatch?.id === b.id ? null : b)
                        }
                        className={`w-full p-3.5 text-left transition-all duration-200 rounded-2xl border flex items-center justify-between cursor-pointer ${
                          full
                            ? "opacity-50 cursor-not-allowed"
                            : selectedBatch?.id === b.id
                              ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                              : "bg-white/5 border-white/10 hover:border-cyan-400/40"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-fg">{b.name}</p>
                          <p className="text-xs font-mono text-fg-muted">
                            {b.days?.length > 0
                              ? b.days.map((d) => d.slice(0, 3)).join(" · ")
                              : "Days TBD"}{" "}
                            {b.startTime ? ` · ${b.startTime}–${b.endTime}` : ""}
                            {" · "}
                            {batchLabel[b.level] ?? b.level}
                            {b.coach ? ` · ${b.coach}` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold font-mono ${
                              full ? "text-danger" : "text-accent"
                            }`}
                          >
                            {b.currentMembers}/{b.maxMembers}
                          </span>
                          {full && (
                            <p className="text-[10px] font-bold text-danger mt-0.5">
                              Full
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <p className="text-xs text-fg-muted">
                  No active batches available. Membership can be saved without a
                  batch.
                </p>
              )}
              <div className="flex gap-3">
                <GhostButton size="lg" className="w-1/3" onClick={() => setStep(0)}>
                  Back
                </GhostButton>
                <PrimaryButton
                  fullWidth
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  {selectedBatch ? "Continue with Batch" : "Skip Batch"}
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && selectedPlan && (
            <div className="space-y-4 animate-fade-up">
              <GlassCard padding={false} className="p-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-sm text-fg-muted">Plan</span>
                    <span className="font-bold text-fg text-sm">
                      {selectedPlan.name} ({selectedPlan.duration})
                    </span>
                  </div>
                  {selectedBatch && (
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-sm text-fg-muted">Batch</span>
                      <span className="font-bold text-accent text-sm">
                        {selectedBatch.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                      Total Due
                    </span>
                    <span className="text-3xl font-bold font-mono text-accent">
                      {formatCurrency(selectedPlan.price)}
                    </span>
                  </div>
                </div>
              </GlassCard>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-fg-muted mb-2.5">
                  Payment Method
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { method: "CASH" as const, label: "Cash", icon: <IoCashOutline size={20} /> },
                    { method: "UPI" as const, label: "UPI / QR", icon: <IoQrCodeOutline size={20} /> },
                    { method: "CARD" as const, label: "POS Card", icon: <IoCardOutline size={20} /> },
                  ].map(({ method, label, icon }) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl text-xs font-bold transition-all min-h-18 border cursor-pointer ${
                        paymentMethod === method
                          ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                          : "bg-white/5 border-white/10 text-fg-dim hover:border-white/20"
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs font-semibold text-danger">
                  {errorMessage}
                </p>
              )}

              <div className="flex gap-3">
                <GhostButton size="lg" className="w-1/3" onClick={() => setStep(1)}>
                  Back
                </GhostButton>
                <PrimaryButton
                  fullWidth
                  size="lg"
                  loading={saving}
                  onClick={handleConfirm}
                >
                  Confirm & Generate Bill
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
