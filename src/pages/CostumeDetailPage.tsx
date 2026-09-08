import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetCostumeQuery,
  useGetCostumeSummaryQuery,
  useGetCostumeTransactionsQuery,
  useCreateCostumeTransactionMutation,
  useReturnCostumeTransactionMutation,
  useDeleteCostumeMutation,
} from "@/store/api/costumesApi";
import { useGetCustomersQuery } from "@/store/api/customersApi";
import {
  GlassCard,
  GhostButton,
  SkeletonGlass,
  Input,
  StatCard,
  PrimaryButton,
  EmptyState,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  IoShirt,
  IoArrowBack,
  IoTrash,
  IoAdd,
  IoClose,
  IoCart,
  IoSwapHorizontal,
  IoCash,
  IoLayers,
  IoCard,
  IoCheckmarkCircle,
  IoReturnDownBack,
  IoSearch,
} from "react-icons/io5";
import type {
  Costume,
  CostumeTxnPayload,
  CostumeTransaction,
  CostumeType,
  CostumeTxnType,
} from "@/types";

const EMPTY_WALKIN = { id: "", name: "" };

function typeLabel(type: CostumeType): { bg: string; color: string; label: string } {
  switch (type) {
    case "MENS":
      return { bg: "var(--glow-pool)", color: "var(--accent-pool)", label: "Men's" };
    case "WOMENS":
      return { bg: "var(--glow-coral)", color: "var(--accent-coral)", label: "Women's" };
    case "KIDS":
      return { bg: "var(--glow-aqua)", color: "var(--accent-aqua)", label: "Kids" };
    default:
      return { bg: "var(--glass-bg)", color: "var(--text-secondary)", label: "Unisex" };
  }
}

function totalStock(c: Costume): number {
  return (c.variants ?? []).reduce((sum, v) => sum + (v.stock || 0), 0);
}

function variantLabel(v: { size?: string; color?: string }): string {
  if (!v?.size) return "N/A";
  return v.color ? `${v.size} · ${v.color}` : v.size;
}

function statusChip(txn: CostumeTransaction): { bg: string; color: string; label: string } {
  if (txn.type === "SALE")
    return { bg: "var(--glow-aqua)", color: "var(--accent-aqua)", label: "Sold" };
  if (txn.status === "ACTIVE")
    return { bg: "var(--glow-coral)", color: "var(--accent-coral)", label: "Rented" };
  return { bg: "var(--glass-bg)", color: "var(--text-muted)", label: "Returned" };
}

interface AddTxnFormProps {
  costume: Costume;
  type: CostumeTxnType;
  onCancel: () => void;
  onSave: (payload: CostumeTxnPayload) => Promise<void>;
}

function AddTransactionForm({ costume, type, onCancel, onSave }: AddTxnFormProps) {
  const { data: customers } = useGetCustomersQuery({ search: "" });
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<{ id: string; name: string; mobile?: string }>(EMPTY_WALKIN);
  const [walkinName, setWalkinName] = useState("");
  const [walkinMobile, setWalkinMobile] = useState("");
  const [variantIndex, setVariantIndex] = useState(costume.variants.length > 0 ? 0 : -1);
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState(
    costume.variants.length > 0 ? String(type === "RENT" && costume.rentPrice ? costume.rentPrice : (costume.variants[0].price ?? costume.price ?? 0)) : "",
  );
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedVariant = variantIndex >= 0 ? costume.variants[variantIndex] : undefined;

  function suggestedPrice(idx: number): number {
    const v = idx >= 0 ? costume.variants[idx] : undefined;
    if (type === "RENT" && costume.rentPrice) return costume.rentPrice;
    return v?.price ?? costume.price ?? 0;
  }

  function chooseVariant(idx: number) {
    setVariantIndex(idx);
    setUnitPrice(String(suggestedPrice(idx) || ""));
  }

  const filteredCustomers = (customers ?? []).filter(
    (c) =>
      !search.trim() ||
      c.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      c.mobile.includes(search.trim()),
  );

  const isWalkIn = customer.id === "";
  const finalName = isWalkIn ? walkinName.trim() : customer.name;
  const finalMobile = isWalkIn ? walkinMobile.trim() : customer.mobile ?? "";
  const qty = parseInt(quantity, 10);
  const price = parseFloat(unitPrice) || 0;
  const total = qty > 0 && price > 0 ? qty * price : 0;

  async function handleSubmit() {
    setError("");
    if (variantIndex < 0) return setError("Select a size / color");
    if (!finalName) return setError("Enter the customer name");
    if (!Number.isInteger(qty) || qty < 1) return setError("Quantity must be at least 1");
    if (price < 0) return setError("Enter a valid price");

    setSaving(true);
    try {
      await onSave({
        type,
        size: selectedVariant?.size,
        color: selectedVariant?.color || "",
        customerId: isWalkIn ? null : customer.id,
        customerName: finalName,
        customerMobile: finalMobile || undefined,
        quantity: qty,
        unitPrice: price,
        notes: notes.trim() || undefined,
      });
    } catch {
      setError("Could not save. Check stock / connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <GlassCard className="animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-fg">
          {type === "SALE" ? "Record a Sale" : "Record a Rent"}
        </h2>
        <button onClick={onCancel} className="text-fg-muted cursor-pointer">
          <IoClose size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            Size / Color
          </label>
          <select
            value={variantIndex}
            onChange={(e) => chooseVariant(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium min-h-11 border border-input-border bg-input text-fg outline-none focus:border-input-focus"
          >
            {costume.variants.map((v, i) => (
              <option key={i} value={i} className="text-fg">
                {v.size}
                {v.color ? ` · ${v.color}` : ""} — {v.stock} in stock
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            Customer
          </label>
          {isWalkIn ? (
            <div className="relative">
              <IoSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"
                size={18}
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search existing customer..."
                className="min-h-11 pl-10"
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "var(--glow-aqua)",
                border: "1px solid var(--accent-aqua)",
              }}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-fg truncate">{customer.name}</p>
                {customer.mobile && (
                  <p className="text-xs text-fg-muted">{customer.mobile}</p>
                )}
              </div>
              <button
                onClick={() => setCustomer(EMPTY_WALKIN)}
                className="cursor-pointer"
              >
                <IoClose size={16} className="text-fg-muted" />
              </button>
            </div>
          )}

          {isWalkIn && (
            <>
              {search.trim() && (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredCustomers.length === 0 && (
                    <p className="text-xs text-fg-dim px-1 py-2">No customers found.</p>
                  )}
                  {filteredCustomers.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      onClick={() =>
                        setCustomer({ id: c.id, name: c.name, mobile: c.mobile })
                      }
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <p className="font-bold text-fg">{c.name}</p>
                      <p className="text-xs text-fg-muted">{c.mobile}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomer(EMPTY_WALKIN)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold cursor-pointer"
                    style={{ color: "var(--accent-aqua)" }}
                  >
                    + New walk-in customer
                  </button>
                </div>
              )}
              {!search.trim() && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Customer Name *"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                  <Input
                    label="Mobile (optional)"
                    value={walkinMobile}
                    onChange={(e) => setWalkinMobile(e.target.value)}
                    placeholder="10-digit mobile"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Input
            label={`Unit Price (₹)${type === "RENT" && costume.rentPrice ? " · per rent" : ""}`}
            type="number"
            min={0}
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="Auto"
          />
        </div>

        {total > 0 && (
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <p className="text-sm font-bold text-fg">Total</p>
            <p className="text-lg font-bold font-display" style={{ color: "var(--accent-coral)" }}>
              {formatCurrency(total)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Optional notes..."
            className="w-full px-4 py-3 rounded-xl text-sm font-medium resize-none min-h-14 border border-input-border bg-input text-fg outline-none focus:border-input-focus"
          />
        </div>

        {error && (
          <p className="text-xs font-bold" style={{ color: "var(--accent-coral)" }}>
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <GhostButton onClick={onCancel} fullWidth>
            Cancel
          </GhostButton>
          <PrimaryButton onClick={handleSubmit} fullWidth loading={saving}>
            {type === "SALE" ? "Add Sale" : "Add Rent"}
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );
}

type Tab = "overview" | "buyers" | "rents";

export function CostumeDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: costume, isLoading, isError } = useGetCostumeQuery(id);
  const { data: summary } = useGetCostumeSummaryQuery(id, { skip: !id });
  const buyers = useGetCostumeTransactionsQuery({ id, type: "SALE" });
  const rents = useGetCostumeTransactionsQuery({ id, type: "RENT" });
  const [createTxn] = useCreateCostumeTransactionMutation();
  const [returnTxn] = useReturnCostumeTransactionMutation();
  const [deleteCostume] = useDeleteCostumeMutation();

  const [tab, setTab] = useState<Tab>("overview");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<CostumeTxnType>("SALE");

  async function handleSave(payload: CostumeTxnPayload) {
    await createTxn({ id, data: payload }).unwrap();
    setShowForm(false);
  }

  async function handleReturn(txnId: string) {
    await returnTxn({ id, txnId });
  }

  async function handleDelete() {
    await deleteCostume(id);
    navigate("/costumes");
  }

  if (isLoading)
    return (
      <div className="space-y-6">
        <SkeletonGlass lines={1} />
        <SkeletonGlass lines={1} />
        <SkeletonGlass lines={4} />
      </div>
    );

  if (isError || !costume)
    return (
      <GlassCard>
        <div className="flex flex-col items-center py-10 text-center">
          <div
            className="mb-5 p-4 rounded-2xl"
            style={{ background: "var(--glow-coral)", color: "var(--accent-coral)" }}
          >
            <IoShirt size={36} />
          </div>
          <h3 className="text-lg font-bold mb-1.5 text-fg">Costume not found</h3>
          <p className="text-sm max-w-sm mb-6 text-fg-dim">
            This costume may have been removed.
          </p>
          <GhostButton onClick={() => navigate("/costumes")}>
            <IoArrowBack size={14} /> Back to Costumes
          </GhostButton>
        </div>
      </GlassCard>
    );

  const chip = typeLabel(costume.type);
  const stock = totalStock(costume);

  const buyerCount = buyers.data?.total ?? 0;
  const rentCount = rents.data?.total ?? 0;
  const activeRentCount = (rents.data?.items ?? []).filter((t) => t.status === "ACTIVE").length;

  const tabs: { key: Tab; label: string; badge?: number; accent?: boolean }[] = [
    { key: "overview", label: "Overview" },
    { key: "buyers", label: "Buyers", badge: buyerCount },
    { key: "rents", label: "Rentals", badge: rentCount, accent: activeRentCount > 0 },
  ];

  const transactions = tab === "buyers" ? buyers.data?.items : rents.data?.items;
  const txnLoading = tab === "buyers" ? buyers.isLoading : rents.isLoading;
  const openForm = (type: CostumeTxnType) => {
    setFormType(type);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-3">
          <GhostButton size="sm" onClick={() => navigate("/costumes")}>
            <IoArrowBack size={14} />
          </GhostButton>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg">
              {costume.name}
            </h1>
            <p className="text-sm mt-0.5 text-fg-muted">
              {chip.label} · ₹{costume.price}
              {costume.rentPrice ? ` · Rent ₹${costume.rentPrice}` : ""}
            </p>
          </div>
        </div>
        <GhostButton size="sm" onClick={handleDelete} className="text-danger">
          <IoTrash size={14} /> Delete
        </GhostButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          label="Stock"
          value={String(summary?.currentStock ?? stock)}
          icon={<IoLayers size={18} />}
          className="stagger-1"
        />
        <StatCard
          label="Sell Out"
          value={String(summary?.soldQty ?? 0)}
          icon={<IoCart size={18} />}
          className="stagger-2"
        />
        <StatCard
          label="Sold Amount"
          value={formatCurrency(summary?.soldRevenue ?? 0)}
          icon={<IoCash size={18} />}
          className="stagger-3"
        />
        <StatCard
          label="Rent Out"
          value={String(summary?.rentQty ?? 0)}
          icon={<IoSwapHorizontal size={18} />}
          className="stagger-4"
        />
        <StatCard
          label="Rent Amount"
          value={formatCurrency(summary?.rentRevenue ?? 0)}
          icon={<IoCard size={18} />}
          className="stagger-5"
        />
        <StatCard
          label="Out for Rent"
          value={String(summary?.activeRentQty ?? 0)}
          icon={<IoReturnDownBack size={18} />}
          className="stagger-6"
        />
      </div>

      <div className="flex gap-2 animate-fade-up">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            style={
              tab === t.key
                ? {
                    background: "var(--glow-aqua)",
                    border: "1.5px solid var(--accent-aqua)",
                    color: "var(--accent-aqua)",
                  }
                : {
                    background: "var(--glass-bg)",
                    border: "1.5px solid var(--glass-border)",
                    color: "var(--text-secondary)",
                  }
            }
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                style={
                  t.accent
                    ? { background: "var(--accent-coral)", color: "#fff" }
                    : { background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }
                }
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {showForm && (
        <AddTransactionForm
          costume={costume}
          type={formType}
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {tab === "overview" && (
        <GlassCard className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: chip.bg, color: chip.color }}
            >
              <IoShirt size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fg">{costume.name}</h2>
              <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: chip.color }}>
                {chip.label} · ₹{costume.price}
                {costume.rentPrice ? ` · Rent ₹${costume.rentPrice}` : ""}
              </p>
            </div>
            {costume.isActive && (
              <span
                className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
              >
                <IoCheckmarkCircle size={12} /> Active
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Inventory — Sizes / Colors
              </p>
            </div>
            {costume.variants.length === 0 ? (
              <p className="text-sm text-fg-dim">
                No variants added. Edit this costume to add sizes and stock.
              </p>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-px overflow-hidden rounded-xl"
                style={{ background: "var(--glass-border)", border: "1px solid var(--glass-border)" }}
              >
                {costume.variants.map((v, i) => (
                  <div
                    key={i}
                    className="px-4 py-3"
                    style={{ background: "var(--glass-bg)" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                      {v.size}
                      {v.color ? ` · ${v.color}` : ""} ·{" "}
                      {v.price != null ? `₹${v.price}` : `₹${costume.price}`}
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5 text-fg"
                      style={
                        v.stock === 0
                          ? { color: "var(--text-muted)" }
                          : v.stock <= 5
                            ? { color: "var(--accent-coral)" }
                            : undefined
                      }
                    >
                      {v.stock} in stock
                    </p>
                  </div>
                ))}
              </div>
            )}
            {costume.notes && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                  Notes
                </p>
                <p className="text-sm text-fg-dim mt-1">{costume.notes}</p>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {(tab === "buyers" || tab === "rents") && (
        <>
          <div>
            <PrimaryButton
              size="sm"
              onClick={() => openForm(tab === "buyers" ? "SALE" : "RENT")}
              disabled={costume.variants.length === 0}
            >
              <IoAdd size={16} /> {tab === "buyers" ? "Record Sale" : "Record Rent"}
            </PrimaryButton>
            {costume.variants.length === 0 && (
              <p className="text-xs text-fg-dim mt-2">
                Add sizes & stock first to record a {tab === "buyers" ? "sale" : "rent"}.
              </p>
            )}
          </div>

          {txnLoading ? (
            <SkeletonGlass lines={3} />
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((txn) => {
                const chip = statusChip(txn);
                return (
                  <GlassCard key={txn.id} padding={false} className="p-4 animate-fade-up">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-fg">{txn.customerName}</p>
                        <p className="text-[11px] text-fg-muted mt-0.5">
                          {variantLabel(txn.variant)} · {formatDate(txn.createdAt)}
                          {txn.customerMobile ? ` · ${txn.customerMobile}` : ""}
                        </p>
                        {txn.notes && (
                          <p className="text-xs text-fg-dim mt-1">{txn.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: chip.bg, color: chip.color }}
                        >
                          {chip.label}
                        </span>
                        <p className="text-sm font-bold text-fg">
                          {txn.quantity} × {formatCurrency(txn.unitPrice)} ={" "}
                          <span style={{ color: "var(--accent-coral)" }}>
                            {formatCurrency(txn.totalAmount)}
                          </span>
                        </p>
                        {txn.type === "RENT" && txn.status === "ACTIVE" && (
                          <GhostButton size="sm" onClick={() => handleReturn(txn.id)}>
                            <IoReturnDownBack size={14} /> Mark Returned
                          </GhostButton>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={tab === "buyers" ? <IoCart size={36} /> : <IoSwapHorizontal size={36} />}
              title={tab === "buyers" ? "No buyers yet" : "No rentals yet"}
              description={
                tab === "buyers"
                  ? "Record a sale to start tracking who bought this costume"
                  : "Record a rent to start tracking who has it out"
              }
              action={
                <PrimaryButton
                  onClick={() => openForm(tab === "buyers" ? "SALE" : "RENT")}
                  disabled={costume.variants.length === 0}
                >
                  <IoAdd size={16} /> {tab === "buyers" ? "Record Sale" : "Record Rent"}
                </PrimaryButton>
              }
            />
          )}
        </>
      )}
    </div>
  );
}