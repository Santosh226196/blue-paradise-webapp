import { useState } from "react";
import { useGetMembershipBatchesQuery } from "@/store/api/membershipBatchesApi";
import { useAssignMembershipToBatchMutation, useChangeBatchMutation } from "@/store/api/membershipBatchesApi";
import { GlassCard, PrimaryButton, GhostButton, SkeletonGlass } from "@/components/ui";
import type { MembershipBatch } from "@/types";
import { useToast } from "@/components/Toast";
import { formatTime12 } from "@/lib/utils";
import { IoClose } from "react-icons/io5";

const batchLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const batchStatusTag: Record<string, { label: string; background: string; color: string }> = {
  UPCOMING: { label: "Upcoming", background: "var(--glow-pool)", color: "var(--accent-pool)" },
  COMPLETED: { label: "Completed", background: "var(--glow-coral)", color: "var(--accent-coral)" },
  CANCELLED: { label: "Cancelled", background: "var(--glass-bg)", color: "var(--text-muted)" },
};

export function BatchPickerModal({
  membershipId,
  membershipType,
  currentBatchId,
  customerName,
  isOpen,
  onClose,
  onAssigned,
}: {
  membershipId: string;
  membershipType: string;
  currentBatchId?: string | null;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
  onAssigned?: () => void;
}) {
  const { data: batches, isLoading } = useGetMembershipBatchesQuery();
  const [assign, { isLoading: assigning }] = useAssignMembershipToBatchMutation();
  const [change, { isLoading: changing }] = useChangeBatchMutation();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(
    currentBatchId ?? null,
  );

  if (!isOpen) return null;

  const editing = !currentBatchId ? "Assign" : "Change";
  const busy = assigning || changing;

  function isAssignable(b: MembershipBatch) {
    return b.status === "ACTIVE" || b.status === "UPCOMING";
  }

  function isFull(b: MembershipBatch) {
    return b.currentMembers >= b.maxMembers;
  }

  // In "Change" mode show only active batches plus the current one (pre-selected);
  // in "Assign" mode only batches that can be picked.
  const visibleBatches =
    batches?.filter((b) =>
      currentBatchId
        ? b.status === "ACTIVE" || b.id === currentBatchId
        : isAssignable(b),
    ) ?? [];

  async function handleSave() {
    if (!selectedId || selectedId === currentBatchId) return;
    try {
      if (currentBatchId) {
        await change({
          batchId: selectedId,
          membershipId,
          reason: `Changed from previous batch via ${membershipType} membership`,
        }).unwrap();
        showToast("success", "Batch updated successfully");
      } else {
        await assign({ batchId: selectedId, membershipId }).unwrap();
        showToast("success", "Assigned to batch successfully");
      }
      setSelectedId(null);
      onClose();
      onAssigned?.();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update batch. Please try again.";
      showToast("error", message);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-up overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
    >
      <GlassCard className="w-full max-w-xl animate-scale-in relative">
        <button
          type="button"
          onClick={onClose}
          className="!absolute !top-4 !right-4 !z-20 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-fg-muted cursor-pointer"
        >
          <IoClose size={20} />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-fg">
            {editing} Batch — {customerName}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            {membershipType} membership ·{" "}
            {currentBatchId
              ? "only active batches are shown, current one is selected"
              : "active and upcoming batches are available"}
          </p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <SkeletonGlass lines={3} />
          ) : visibleBatches.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
              {visibleBatches.map((b) => {
                const full = isFull(b);
                const isCurrent = b.id === currentBatchId;
                const disabled =
                  full || (!isAssignable(b) && !isCurrent);
                const selected = selectedId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedId(b.id)}
                    className={`relative shrink-0 w-48 p-4 text-left transition-all duration-200 rounded-2xl border cursor-pointer snap-start ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : selected
                          ? "bg-cyan-400/20 border-cyan-400 ring-2 ring-cyan-400/30"
                          : "bg-white/5 border-white/10 hover:border-cyan-400/50"
                    }`}
                  >
                    <span
                      className={`absolute top-3 right-3 flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all ${
                        disabled
                          ? "border-white/20"
                          : selected
                            ? "border-cyan-400"
                            : "border-white/30"
                      }`}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </span>
                    <p className="text-sm font-bold text-fg pr-5">{b.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1 text-xs font-mono text-fg-muted leading-relaxed">
                      {isCurrent && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: "var(--glow-aqua)",
                            color: "var(--accent-aqua)",
                          }}
                        >
                          Current
                        </span>
                      )}
                      {batchStatusTag[b.status] && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={batchStatusTag[b.status]}
                        >
                          {batchStatusTag[b.status].label}
                        </span>
                      )}
                      <span>
                        {b.days?.length > 0
                          ? b.days.map((d) => d.slice(0, 3)).join(" · ")
                          : "Days TBD"}
                        {b.startTime ? ` · ${formatTime12(b.startTime)}–${formatTime12(b.endTime)}` : ""}
                        {b.level ? ` · ${batchLabel[b.level] ?? b.level}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs font-bold font-mono ${
                          full ? "text-danger" : "text-accent"
                        }`}
                      >
                        {b.currentMembers}/{b.maxMembers}
                      </span>
                      {full && (
                        <span className="text-[10px] font-bold text-danger">
                          Full
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-fg-muted">
              No {currentBatchId ? "active" : "active or upcoming "}batches
              available at the moment.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <GhostButton onClick={onClose} size="lg" className="w-1/3">
            Cancel
          </GhostButton>
          <PrimaryButton
            fullWidth
            size="lg"
            loading={busy}
            disabled={!selectedId || selectedId === currentBatchId}
            onClick={handleSave}
          >
            {selectedId === currentBatchId ? "Already in This Batch" : `Confirm ${editing}`}
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}
