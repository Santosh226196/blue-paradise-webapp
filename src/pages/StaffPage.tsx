import { useState } from "react";
import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/store/api/staffApi";
import { GlassCard, PrimaryButton, GhostButton, EmptyState, SkeletonGlass } from "@/components/ui";
import {
  IoPeople, IoAdd, IoTrash, IoPencil, IoClose, IoCall, IoCheckmarkCircle, IoCloseCircle,
} from "react-icons/io5";
import { StaffRole } from "@/types";

export function StaffPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const { data: staff, isLoading } = useGetStaffQuery({ search, role: roleFilter === "ALL" ? undefined : roleFilter });
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<StaffRole>(StaffRole.Coach);
  const [specialization, setSpecialization] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  function resetForm() {
    setName(""); setMobile(""); setRole(StaffRole.Coach); setSpecialization(""); setIsAvailable(true);
    setEditingId(null); setShowForm(false);
  }

  function handleEdit(s: { id: string; name: string; mobile: string; role: StaffRole; specialization?: string; isAvailable: boolean }) {
    setEditingId(s.id); setName(s.name); setMobile(s.mobile); setRole(s.role);
    setSpecialization(s.specialization ?? ""); setIsAvailable(s.isAvailable); setShowForm(true);
  }

  async function handleSave() {
    const payload = { name, mobile, role, specialization: specialization || undefined, isAvailable };
    if (editingId) {
      await updateStaff({ id: editingId, data: payload });
    } else {
      await createStaff(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deleteStaff(id);
  }

  const roleLabels: Record<string, string> = {
    COACH: "Coach", LIFEGUARD: "Lifeguard", RECEPTIONIST: "Receptionist", MANAGER: "Manager",
  };

  const inputStyle = {
    background: "var(--input-bg)", border: "1.5px solid var(--input-border)",
    color: "var(--text-primary)", outlineColor: "var(--input-focus-ring)",
  };

  if (isLoading) return (
    <div className="space-y-6">
      <SkeletonGlass lines={1} />
      <SkeletonGlass lines={2} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonGlass lines={3} /><SkeletonGlass lines={3} /><SkeletonGlass lines={3} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Staff</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage coaches and team members</p>
        </div>
        <PrimaryButton size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <IoAdd size={16} /> Add Staff
        </PrimaryButton>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..."
        className="w-full px-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px]"
        style={inputStyle} />

      <div className="flex gap-2 flex-wrap">
        {["ALL", ...Object.values(StaffRole)].map((r) => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[36px]"
            style={{
              background: roleFilter === r ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${roleFilter === r ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color: roleFilter === r ? "var(--accent-aqua)" : "var(--text-secondary)",
            }}
          >
            {r === "ALL" ? "All" : roleLabels[r] ?? r}
          </button>
        ))}
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {editingId ? "Edit Staff" : "Add Staff"}
            </h2>
            <button onClick={resetForm} style={{ color: "var(--text-muted)" }}><IoClose size={20} /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium min-h-[44px]" style={inputStyle} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Mobile</label>
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium font-mono min-h-[44px]" style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Role</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.values(StaffRole).map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[36px]"
                      style={{
                        background: role === r ? "var(--glow-aqua)" : "var(--glass-bg)",
                        border: `1.5px solid ${role === r ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color: role === r ? "var(--accent-aqua)" : "var(--text-secondary)",
                      }}
                    >
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Specialization</label>
                <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Freestyle, Backstroke"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium min-h-[44px]" style={inputStyle} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Available for duty</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Toggle availability status</p>
              </div>
              <button onClick={() => setIsAvailable(!isAvailable)}
                className="relative w-11 h-6 rounded-full transition-all duration-300"
                style={{ background: isAvailable ? "var(--accent-aqua)" : "var(--text-muted)" }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: isAvailable ? "22px" : "2px" }} />
              </button>
            </div>
            <PrimaryButton onClick={handleSave} fullWidth disabled={!name || !mobile}>
              {editingId ? "Update Staff" : "Add Staff"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="space-y-3"><SkeletonGlass lines={2} /><SkeletonGlass lines={2} /><SkeletonGlass lines={2} /></div>
      ) : staff && staff.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staff.map((s, i) => (
            <GlassCard key={s.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}>
                  {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}>
                  {roleLabels[s.role] ?? s.role}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{s.name}</h3>
              <p className="text-xs font-mono mb-1" style={{ color: "var(--text-muted)" }}>{s.mobile}</p>
              {s.specialization && (
                <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{s.specialization}</p>
              )}
              <div className="flex items-center gap-1.5 mb-4">
                {s.isAvailable ? <IoCheckmarkCircle size={12} style={{ color: "var(--accent-aqua)" }} /> : <IoCloseCircle size={12} style={{ color: "var(--text-muted)" }} />}
                <span className="text-xs font-bold" style={{ color: s.isAvailable ? "var(--accent-aqua)" : "var(--text-muted)" }}>
                  {s.isAvailable ? "Available" : "Off Duty"}
                </span>
              </div>
              <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                <a href={`tel:${s.mobile}`} className="flex-1">
                  <GhostButton size="sm" fullWidth><IoCall size={14} /> Call</GhostButton>
                </a>
                <GhostButton size="sm" onClick={() => handleEdit({ id: s.id, name: s.name, mobile: s.mobile, role: s.role, specialization: s.specialization, isAvailable: s.isAvailable })} className="flex-1">
                  <IoPencil size={14} /> Edit
                </GhostButton>
                <GhostButton size="sm" onClick={() => handleDelete(s.id)} style={{ color: "var(--accent-coral)" }}>
                  <IoTrash size={14} />
                </GhostButton>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoPeople size={36} />}
          title="No staff members"
          description="Add your first staff member to get started"
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Add Staff
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}
