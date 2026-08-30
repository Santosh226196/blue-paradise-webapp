import { useState } from "react";
import { useGetMembershipBatchesQuery } from "@/store/api/membershipBatchesApi";
import { useAssignMembershipToBatchMutation, useChangeBatchMutation } from "@/store/api/membershipBatchesApi";
import { GlassCard, PrimaryButton, GhostButton, SkeletonGlass } from "@/components/ui";
import type { MembershipBatch } from "@/types";
import { useToast } from "@/components/Toast";
import { IoClose, IoPeople } from "react-icons/io5";

const batchLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function BatchPickerModal({
  membershipId,
  membershipType,
  currentBatchId,
  customerName,
  isOpen,
  onClose,
}: {
  membershipId: string;
  membershipType: string;
  currentBatchId?: string | null;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: batches, isLoading } = useGetMembershipBatchesQuery();
  const [assign, { isLoading: assigning }] = useAssignMembershipToBatchMutation();
  const [change, { isLoading: changing }] = useChangeBatchMutation();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeBatches =
    batches?.filter(
      (b) => b.status === "ACTIVE" && b.id !== currentBatchId,
    ) ?? [];
  const editing = !currentBatchId ? "Assign" : "Change";
  const busy = assigning || changing;

  function isFull(b: MembershipBatch) {
    return b.currentMembers >= b.maxMembers;
  }

  async function handleSave() {
    if (!selectedId) return;
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
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-fg-muted cursor-pointer"
        >
          <IoClose size={20} />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-fg">
            {editing} Batch — {customerName}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            {membershipType} membership · only active batches are available
          </p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <SkeletonGlass lines={3} />
          ) : activeBatches.length > 0 ? (
            activeBatches.map((b) => {
              const full = isFull(b);
              const selected = selectedId === b.id;
              return (
                <button
                  key={b.id}
                  disabled={full}
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full p-3.5 text-left transition-all duration-200 rounded-2xl border flex items-center justify-between cursor-pointer ${
                    full
                      ? "opacity-50 cursor-not-allowed"
                      : selected
                        ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                        : "bg-white/5 border-white/10 hover:border-cyan-400/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IoPeople size={16} className="text-accent shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-fg">{b.name}</p>
                      <p className="text-xs font-mono text-fg-muted">
                        {b.days?.length > 0
                          ? b.days.map((d) => d.slice(0, 3)).join(" · ")
                          : "Days TBD"}{" "}
                        {b.startTime ? ` · ${b.startTime}–${b.endTime}` : ""}
                        {b.level ? ` · ${batchLabel[b.level] ?? b.level}` : ""}
                        {b.coach ? ` · ${b.coach}` : ""}
                      </p>
                    </div>
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
            })
          ) : (
            <p className="text-xs text-fg-muted">
              No other active batches available at the moment.
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
            disabled={!selectedId}
            onClick={handleSave}
          >
            Confirm {editing}
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}
