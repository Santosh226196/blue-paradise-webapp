import { useState } from "react";
import {
  useGetDuePaymentsQuery,
  useCreateDuePaymentMutation,
  useMarkAsPaidMutation,
  useDeleteDuePaymentMutation,
  useGetDuePaymentsSummaryQuery,
} from "@/store/api/duePaymentsApi";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import { GlassCard, PrimaryButton, GhostButton, EmptyState, SkeletonGlass, Modal } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  IoAlertCircle, IoAdd, IoCheckmarkCircle, IoTrash, IoClose, IoSearch, IoCash,
} from "react-icons/io5";

export function DuePaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { data: payments, isLoading } = useGetDuePaymentsQuery({ status: statusFilter === "ALL" ? undefined : statusFilter });
  const { data: summary } = useGetDuePaymentsSummaryQuery();
  const [createDuePayment] = useCreateDuePaymentMutation();
  const [markAsPaid] = useMarkAsPaidMutation();
  const [deletePayment] = useDeleteDuePaymentMutation();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const { data: customers } = useGetCustomersQuery({ search });
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
  const [payModal, setPayModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });

  function resetForm() {
    setSearch(""); setSelectedCustomer(null); setDescription(""); setAmount(""); setDueDate("");
    setShowForm(false);
  }

  async function handleCreate() {
    if (!selectedCustomer || !amount || !dueDate) return;
    try {
      await createDuePayment({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerMobile: "",
        description,
        amount: Number(amount),
        dueDate,
        status: "PENDING",
      }).unwrap();
      showToast("success", `Due payment of ${formatCurrency(Number(amount))} created for ${selectedCustomer.name}`);
      resetForm();
    } catch {
      showToast("error", "Failed to create due payment. Please try again.");
    }
  }

  async function handleMarkPaid(id: string) {
    try {
      await markAsPaid(id).unwrap();
      showToast("success", "Payment marked as paid successfully!");
    } catch {
      showToast("error", "Failed to update payment status.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePayment(id).unwrap();
      showToast("success", "Due payment deleted successfully.");
    } catch {
      showToast("error", "Failed to delete due payment.");
    }
  }

  const inputStyle = {
    background: "var(--input-bg)", border: "1.5px solid var(--input-border)",
    color: "var(--text-primary)", outlineColor: "var(--input-focus-ring)",
  };

  if (isLoading) return (
    <div className="space-y-6">
      <SkeletonGlass lines={1} />
      <div className="grid grid-cols-3 gap-4">
        <SkeletonGlass lines={2} /><SkeletonGlass lines={2} /><SkeletonGlass lines={2} />
      </div>
      <SkeletonGlass lines={4} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Due Payments</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Track outstanding balances</p>
        </div>
        <PrimaryButton size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <IoAdd size={16} /> Add Due
        </PrimaryButton>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <GlassCard padding={false} className="p-4 text-center">
            <p className="text-xl font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(summary.totalPending)}</p>
            <p className="text-[10px] font-bold uppercase mt-1" style={{ color: "var(--text-muted)" }}>Pending</p>
          </GlassCard>
          <GlassCard padding={false} className="p-4 text-center">
            <p className="text-xl font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(summary.totalOverdue)}</p>
            <p className="text-[10px] font-bold uppercase mt-1" style={{ color: "var(--text-muted)" }}>Overdue</p>
          </GlassCard>
          <GlassCard padding={false} className="p-4 text-center">
            <p className="text-xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>{summary.count}</p>
            <p className="text-[10px] font-bold uppercase mt-1" style={{ color: "var(--text-muted)" }}>Total Due</p>
          </GlassCard>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "OVERDUE", "PAID"].map((f) => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[36px]"
            style={{
              background: statusFilter === f ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${statusFilter === f ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color: statusFilter === f ? "var(--accent-aqua)" : "var(--text-secondary)",
            }}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Add Due Payment</h2>
            <button onClick={resetForm} style={{ color: "var(--text-muted)" }}><IoClose size={20} /></button>
          </div>
          <div className="space-y-4">
            {!selectedCustomer ? (
              <>
                <div className="relative">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customer..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px]" style={inputStyle} />
                </div>
                {customers && customers.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {customers.slice(0, 5).map((c) => (
                      <button key={c.id} onClick={() => { setSelectedCustomer({ id: c.id, name: c.name }); setSearch(""); }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                        style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="font-bold" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "var(--glow-aqua)", border: "1px solid var(--accent-aqua)" }}>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{selectedCustomer.name}</span>
                  <button onClick={() => setSelectedCustomer(null)}><IoClose size={14} style={{ color: "var(--text-muted)" }} /></button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Description</label>
                  <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Monthly fee, Equipment charge"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium min-h-[44px]" style={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Amount (₹)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="500"
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium font-mono min-h-[44px]" style={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Due Date</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium min-h-[44px]" style={inputStyle} />
                  </div>
                </div>
                <PrimaryButton onClick={handleCreate} fullWidth disabled={!amount || !dueDate}>
                  Create Due Payment
                </PrimaryButton>
              </>
            )}
          </div>
        </GlassCard>
      )}

      {/* Payments list */}
      {isLoading ? (
        <div className="space-y-3"><SkeletonGlass lines={2} /><SkeletonGlass lines={2} /></div>
      ) : payments && payments.length > 0 ? (
        <div className="space-y-2">
          {payments.map((p, i) => (
            <GlassCard key={p.id} padding={false} className="p-4 animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: p.status === "OVERDUE" ? "var(--glow-coral)" : "var(--glow-aqua)",
                      color: p.status === "OVERDUE" ? "var(--accent-coral)" : "var(--accent-aqua)",
                    }}>
                    {p.status === "OVERDUE" ? <IoAlertCircle size={18} /> : <IoCash size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.customerName}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.description || "Due payment"} · Due {p.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(p.amount)}</p>
                  <div className="flex items-center gap-1">
                    {p.status !== "PAID" && (
                      <GhostButton size="sm" onClick={() => setPayModal({ open: true, id: p.id, name: p.customerName })}>
                        <IoCheckmarkCircle size={14} /> Pay
                      </GhostButton>
                    )}
                    {p.status === "PAID" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}>Paid</span>
                    )}
                    <GhostButton size="sm" onClick={() => setDeleteModal({ open: true, id: p.id, name: p.customerName })} style={{ color: "var(--accent-coral)" }}>
                      <IoTrash size={14} />
                    </GhostButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoCash size={36} />}
          title="No due payments"
          description="All clear! No outstanding balances."
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Add Due Payment
            </PrimaryButton>
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: "", name: "" })}
        onConfirm={() => { handleDelete(deleteModal.id); setDeleteModal({ open: false, id: "", name: "" }); }}
        variant="confirm"
        title="Delete Due Payment"
        message={`Are you sure you want to delete the due payment for ${deleteModal.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep"
      />

      {/* Mark as Paid Confirmation Modal */}
      <Modal
        isOpen={payModal.open}
        onClose={() => setPayModal({ open: false, id: "", name: "" })}
        onConfirm={() => { handleMarkPaid(payModal.id); setPayModal({ open: false, id: "", name: "" }); }}
        variant="confirm"
        title="Mark as Paid"
        message={`Mark the due payment for ${payModal.name} as paid?`}
        confirmLabel="Mark Paid"
        cancelLabel="Cancel"
      />
    </div>
  );
}
