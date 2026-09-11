import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useGetCostumesQuery,
  useGetCostumesStatsQuery,
  useCreateCostumeMutation,
  useUpdateCostumeMutation,
  useDeleteCostumeMutation,
} from "@/store/api/costumesApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  EmptyState,
  SkeletonGlass,
  Input,
  StatCard,
} from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  IoShirt,
  IoAdd,
  IoTrash,
  IoPencil,
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoFemale,
  IoMale,
  IoPeople,
  IoLayers,
  IoSwapHorizontal,
  IoCard,
  IoCash,
} from "react-icons/io5";
import type {
  Costume,
  CostumeType,
  CostumeCreatePayload,
  CostumeVariant,
} from "@/types";

const TYPE_OPTIONS: { value: CostumeType; label: string; icon: React.ReactNode }[] = [
  { value: "MENS", label: "Men's", icon: <IoMale size={14} /> },
  { value: "WOMENS", label: "Women's", icon: <IoFemale size={14} /> },
  { value: "KIDS", label: "Kids", icon: <IoPeople size={14} /> },
  { value: "UNISEX", label: "Unisex", icon: <IoShirt size={14} /> },
];

function typeChip(type: CostumeType): { bg: string; color: string; label: string } {
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

const PAGE_SIZE = 8;
const EMPTY_VARIANT = (): CostumeVariant => ({ size: "", color: "", stock: 0, price: undefined });

export function CostumesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetCostumesQuery({ page, limit: PAGE_SIZE });
  const { data: stats } = useGetCostumesStatsQuery();
  const [createCostume] = useCreateCostumeMutation();
  const [updateCostume] = useUpdateCostumeMutation();
  const [deleteCostume] = useDeleteCostumeMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<CostumeType>("UNISEX");
  const [price, setPrice] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [variants, setVariants] = useState<CostumeVariant[]>([EMPTY_VARIANT()]);
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState("");

  const costumes = data?.items ?? [];
  const pages = data?.pages ?? 1;

  function resetForm() {
    setName("");
    setType("UNISEX");
    setPrice("");
    setRentPrice("");
    setVariants([EMPTY_VARIANT()]);
    setIsActive(true);
    setNotes("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(c: Costume) {
    setEditingId(c.id);
    setName(c.name);
    setType(c.type);
    setPrice(String(c.price));
    setRentPrice(c.rentPrice != null && c.rentPrice > 0 ? String(c.rentPrice) : "");
    setVariants(
      (c.variants ?? []).map((v) => ({
        size: v.size,
        color: v.color ?? "",
        stock: v.stock || 0,
        price: v.price != null && v.price > 0 ? v.price : undefined,
      })),
    );
    setIsActive(c.isActive);
    setNotes(c.notes ?? "");
    setShowForm(true);
  }

  function updateVariant(index: number, field: keyof CostumeVariant, value: string | number) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]:
                field === "stock"
                  ? Math.max(0, parseInt(String(value), 10) || 0)
                  : field === "price"
                    ? value === "" ? undefined : Math.max(0, parseFloat(String(value)) || 0)
                    : value,
            }
          : v,
      ),
    );
  }

  function addVariant() {
    setVariants((prev) => [...prev, EMPTY_VARIANT()]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    const cleanVariants = variants
      .map((v) => ({
        size: v.size.trim(),
        color: v.color?.trim(),
        stock: Math.max(0, parseInt(String(v.stock), 10) || 0),
        price: v.price,
      }))
      .filter((v) => v.size);
    if (cleanVariants.length === 0) return;

    const payload: CostumeCreatePayload = {
      name,
      type,
      price: parseFloat(price) || 0,
      rentPrice: parseFloat(rentPrice) || 0,
      variants: cleanVariants,
      isActive,
      notes: notes || undefined,
    };
    if (editingId) {
      await updateCostume({ id: editingId, data: payload });
    } else {
      await createCostume(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deleteCostume(id);
  }

  function goPage(next: number) {
    if (next < 1 || next > pages) return;
    setPage(next);
  }

  if (isLoading)
    return (
      <div className="space-y-6">
        <SkeletonGlass lines={1} />
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
            Costumes
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Inventory, sizes & sales tracking
          </p>
        </div>
        <PrimaryButton
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IoAdd size={16} /> New Costume
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Costumes"
          value={String(stats?.totalCostumes ?? 0)}
          icon={<IoShirt size={18} />}
          className="stagger-1"
        />
        <StatCard
          label="Total Stock"
          value={String(stats?.totalStock ?? 0)}
          icon={<IoLayers size={18} />}
          className="stagger-2"
        />
        <StatCard
          label="Sold"
          value={String(stats?.totalSoldQty ?? 0)}
          icon={<IoCash size={18} />}
          className="stagger-3"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={<IoCard size={18} />}
          className="stagger-4"
        />
        <StatCard
          label="Rent Out"
          value={String(stats?.totalRentQty ?? 0)}
          icon={<IoSwapHorizontal size={18} />}
          className="stagger-5"
        />
        <StatCard
          label="Rent Revenue"
          value={formatCurrency(stats?.totalRentRevenue ?? 0)}
          icon={<IoCash size={18} />}
          className="stagger-6"
        />
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-fg">
              {editingId ? "Edit Costume" : "Add Costume"}
            </h2>
            <button onClick={resetForm} className="text-fg-muted cursor-pointer">
              <IoClose size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  label="Costume Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Swim Trunks"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Type
                </label>
                <div className="flex gap-2 flex-wrap">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className="flex-1 min-w-20 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-h-10 cursor-pointer flex items-center justify-center gap-1"
                      style={{
                        background:
                          type === opt.value
                            ? "var(--glow-aqua)"
                            : "var(--glass-bg)",
                        border: `1.5px solid ${type === opt.value ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          type === opt.value
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  label="Sale Price (₹)"
                  type="number"
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 699"
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Rent Price (₹ / rental)"
                  type="number"
                  min={0}
                  step="0.01"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  placeholder="e.g. 150"
                />
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-fg">Sizes & Colors</p>
                  <p className="text-xs mt-0.5 text-fg-muted">
                    Add every size/color combination with its stock count
                  </p>
                </div>
                <GhostButton size="sm" onClick={addVariant}>
                  <IoAdd size={14} /> Add
                </GhostButton>
              </div>

              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-fg-muted mb-1.5 px-1">
                <span className="col-span-3 sm:col-span-3">Size</span>
                <span className="col-span-3 sm:col-span-3">Color</span>
                <span className="col-span-2 sm:col-span-2">Stock</span>
                <span className="col-span-3 sm:col-span-3">Price (opt.)</span>
                <span className="col-span-1" />
              </div>

              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <input
                      value={v.size}
                      onChange={(e) => updateVariant(i, "size", e.target.value)}
                      placeholder="M"
                      className="col-span-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium min-h-10 border border-input-border bg-input text-fg outline-none focus:border-input-focus placeholder:text-fg-muted"
                    />
                    <input
                      value={v.color ?? ""}
                      onChange={(e) => updateVariant(i, "color", e.target.value)}
                      placeholder="Navy"
                      className="col-span-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium min-h-10 border border-input-border bg-input text-fg outline-none focus:border-input-focus placeholder:text-fg-muted"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => updateVariant(i, "stock", e.target.value)}
                      placeholder="0"
                      className="col-span-2 w-full px-2.5 py-2 rounded-lg text-sm font-medium min-h-10 border border-input-border bg-input text-fg outline-none focus:border-input-focus placeholder:text-fg-muted"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.price ?? ""}
                      onChange={(e) => updateVariant(i, "price", e.target.value)}
                      placeholder="Auto"
                      className="col-span-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium min-h-10 border border-input-border bg-input text-fg outline-none focus:border-input-focus placeholder:text-fg-muted"
                    />
                    <button
                      onClick={() => removeVariant(i)}
                      disabled={variants.length <= 1}
                      className="col-span-1 flex items-center justify-center min-h-10 rounded-lg text-danger opacity-70 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <IoTrash size={15} />
                    </button>
                  </div>
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

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div>
                <p className="text-sm font-bold text-fg">Active</p>
                <p className="text-xs mt-0.5 text-fg-muted">
                  Show in inventory
                </p>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive ? "var(--accent-aqua)" : "var(--text-muted)",
                }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: isActive ? "22px" : "2px" }}
                />
              </button>
            </div>

            <PrimaryButton
              onClick={handleSave}
              fullWidth
              disabled={
                !name ||
                !price ||
                variants.filter((v) => v.size.trim()).length === 0
              }
            >
              {editingId ? "Update Costume" : "Add Costume"}
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
              <IoShirt size={36} />
            </div>
            <h3 className="text-lg font-bold mb-1.5 text-fg">Couldn't load costumes</h3>
            <p className="text-sm max-w-sm mb-6 text-fg-dim">
              The costume data couldn't be fetched. Check your connection.
            </p>
            <GhostButton onClick={() => refetch()}>Retry</GhostButton>
          </div>
        </GlassCard>
      ) : costumes.length > 0 ? (
        <div className="space-y-3">
          {costumes.map((c, i) => {
            const chip = typeChip(c.type);
            const stock = totalStock(c);
            const variantCount = (c.variants ?? []).length;
            const lowStock = stock <= 5;
            return (
              <GlassCard
                key={c.id}
                padding={false}
                className="p-5 animate-fade-up hover:brightness-110 active:scale-[0.99] transition-all duration-200"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/costumes/${c.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: chip.bg, color: chip.color }}
                    >
                      <IoShirt size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-fg truncate">
                        {c.name}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                        {chip.label} · ₹{c.price}
                        {c.rentPrice ? ` · Rent ₹${c.rentPrice}` : ""} ·{" "}
                        {variantCount} size{variantCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <GhostButton
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(c);
                      }}
                    >
                      <IoPencil size={14} />
                    </GhostButton>
                    <GhostButton
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(c.id);
                      }}
                      className="text-danger"
                    >
                      <IoTrash size={14} />
                    </GhostButton>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p
                    className="text-xs font-mono text-fg-muted"
                    style={lowStock && stock > 0 ? { color: "var(--accent-coral)" } : undefined}
                  >
                    In stock: {stock}
                    {lowStock && stock > 0 ? " · Low stock" : ""}
                    {stock === 0 ? " · Out of stock" : ""}
                  </p>
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{ background: chip.bg, color: chip.color }}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(c.variants ?? []).map((v, vi) => (
                    <span
                      key={vi}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color:
                          v.stock > 0
                            ? v.stock <= 5
                              ? "var(--accent-coral)"
                              : "var(--text-secondary)"
                            : "var(--text-muted)",
                      }}
                    >
                      {v.size}
                      {v.color ? ` · ${v.color}` : ""} · {v.stock}
                    </span>
                  ))}
                </div>
                {c.notes && <p className="mt-2 text-xs text-fg-dim">{c.notes}</p>}
              </GlassCard>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <GhostButton
              size="sm"
              onClick={() => goPage(page - 1)}
              disabled={page <= 1}
            >
              <IoChevronBack size={14} /> Prev
            </GhostButton>
            <p className="text-xs font-mono text-fg-muted">
              Page {page} of {pages} · {data?.total ?? 0} items
            </p>
            <GhostButton
              size="sm"
              onClick={() => goPage(page + 1)}
              disabled={page >= pages}
            >
              Next <IoChevronForward size={14} />
            </GhostButton>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<IoShirt size={36} />}
          title="No costumes yet"
          description="Add costumes like swim trunks, bikinis, and kids' suits"
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Add Costume
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}