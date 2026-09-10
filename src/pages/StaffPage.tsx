import { useState, useRef } from "react";
import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/store/api/staffApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  SearchBar,
  Input,
  EmptyState,
  SkeletonGlass,
  CameraCaptureModal,
} from "@/components/ui";
import {
  IoPeople,
  IoAdd,
  IoTrash,
  IoPencil,
  IoClose,
  IoCall,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoCard,
  IoCamera,
  IoPerson,
  IoImageOutline,
} from "react-icons/io5";
import { StaffRole } from "@/types";
import type { Staff } from "@/types";
import { IdCardDownloader } from "@/components/IdCardDownloader";
import { useToast } from "@/components/Toast";
import { compressImageFile } from "@/lib/utils";

export function StaffPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const { data: staff, isLoading } = useGetStaffQuery({
    search,
    role: roleFilter === "ALL" ? undefined : roleFilter,
  });
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [downloadFor, setDownloadFor] = useState<Staff | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<StaffRole>(StaffRole.Coach);
  const [specialization, setSpecialization] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [updatingPhotoFor, setUpdatingPhotoFor] = useState<string | null>(null);
  const formFileInputRef = useRef<HTMLInputElement>(null);
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [cardFileStaffId, setCardFileStaffId] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setMobile("");
    setRole(StaffRole.Coach);
    setSpecialization("");
    setIsAvailable(true);
    setPhotoUrl(null);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(s: {
    id: string;
    name: string;
    mobile: string;
    role: StaffRole;
    specialization?: string;
    isAvailable: boolean;
    photoUrl?: string;
  }) {
    setEditingId(s.id);
    setName(s.name);
    setMobile(s.mobile);
    setRole(s.role);
    setSpecialization(s.specialization ?? "");
    setIsAvailable(s.isAvailable);
    setPhotoUrl(s.photoUrl ?? null);
    setShowForm(true);
  }

  async function handleSave() {
    try {
      const trimmedName = name.trim();
      const trimmedMobile = mobile.trim();
      if (!trimmedName || !trimmedMobile) return;

      const payload: Partial<Staff> = {
        name: trimmedName,
        mobile: trimmedMobile,
        role,
        specialization: specialization.trim() || undefined,
        isAvailable,
      };

      if (editingId) {
        await updateStaff({
          id: editingId,
          data: { ...payload, photoUrl: photoUrl ?? "" },
        }).unwrap();
        showToast("success", "Staff member updated successfully");
      } else {
        await createStaff({
          ...payload,
          photoUrl: photoUrl || undefined,
        }).unwrap();
        showToast("success", "Staff member added successfully");
      }
      resetForm();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Failed to save staff member";
      showToast("error", msg);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStaff(id).unwrap();
      showToast("success", "Staff member deleted successfully");
    } catch {
      showToast("error", "Failed to delete staff member");
    }
  }

  async function handleCapturedPhoto(capturedImage: string) {
    if (updatingPhotoFor) {
      try {
        await updateStaff({
          id: updatingPhotoFor,
          data: { photoUrl: capturedImage },
        }).unwrap();
        showToast("success", "Staff profile photo updated successfully");
      } catch {
        showToast("error", "Failed to update profile photo");
      } finally {
        setUpdatingPhotoFor(null);
      }
    } else {
      setPhotoUrl(capturedImage);
    }
  }

  async function handleFormFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setPhotoUrl(dataUrl);
    } catch {
      showToast("error", "Could not process selected image");
    } finally {
      e.target.value = "";
    }
  }

  async function handleCardFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const staffId = cardFileStaffId;
    if (!file || !staffId) return;
    try {
      const dataUrl = await compressImageFile(file);
      await updateStaff({
        id: staffId,
        data: { photoUrl: dataUrl },
      }).unwrap();
      showToast("success", "Staff profile photo updated successfully");
    } catch {
      showToast("error", "Failed to update profile photo");
    } finally {
      e.target.value = "";
      setCardFileStaffId(null);
    }
  }

  const roleLabels: Record<string, string> = {
    COACH: "Coach",
    LIFEGUARD: "Lifeguard",
    RECEPTIONIST: "Receptionist",
    MANAGER: "Manager",
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        <SkeletonGlass lines={1} />
        <SkeletonGlass lines={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonGlass lines={3} />
          <SkeletonGlass lines={3} />
          <SkeletonGlass lines={3} />
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {downloadFor && (
        <IdCardDownloader staff={downloadFor} onDone={() => setDownloadFor(null)} />
      )}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-fg"
          >
            Staff
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Manage coaches and team members
          </p>
        </div>
        <PrimaryButton
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IoAdd size={16} /> Add Staff
        </PrimaryButton>
      </div>

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        placeholder="Search by name..."
      />

      <div className="flex gap-2 flex-wrap">
        {["ALL", ...Object.values(StaffRole)].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
            style={{
              background:
                roleFilter === r ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${roleFilter === r ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color:
                roleFilter === r
                  ? "var(--accent-aqua)"
                  : "var(--text-secondary)",
            }}
          >
            {r === "ALL" ? "All" : (roleLabels[r] ?? r)}
          </button>
        ))}
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-sm font-bold text-fg"
            >
              {editingId ? "Edit Staff" : "Add Staff"}
            </h2>
            <button onClick={resetForm} className="text-fg-muted cursor-pointer">
              <IoClose size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {/* Staff Profile Photo Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="relative group shrink-0">
                {photoUrl ? (
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt="Staff Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shadow-cyan-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(null)}
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 text-white shadow hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                    <IoPerson size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-fg">Staff Profile Photo</p>
                <p className="text-[11px] text-fg-muted">
                  Used in staff directory and generated ID cards
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUpdatingPhotoFor(null);
                      setCameraModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-linear-to-r from-cyan-400 to-teal-400 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <IoCamera size={15} />
                    <span>{photoUrl ? "Retake Photo" : "Take Live Photo"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => formFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-fg bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <IoImageOutline size={15} />
                    <span>Upload Image</span>
                  </button>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(null)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <IoTrash size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider text-fg-muted"
                >
                  Role
                </label>
                <div className="flex gap-2 flex-wrap">
                  {Object.values(StaffRole).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer"
                      style={{
                        background:
                          role === r ? "var(--glow-aqua)" : "var(--glass-bg)",
                        border: `1.5px solid ${role === r ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                        color:
                          role === r
                            ? "var(--accent-aqua)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Freestyle, Backstroke"
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
                <p
                  className="text-sm font-bold text-fg"
                >
                  Available for duty
                </p>
                <p
                  className="text-xs mt-0.5 text-fg-muted"
                >
                  Toggle availability status
                </p>
              </div>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  background: isAvailable
                    ? "var(--accent-aqua)"
                    : "var(--text-muted)",
                }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: isAvailable ? "22px" : "2px" }}
                />
              </button>
            </div>
            <PrimaryButton
              onClick={handleSave}
              fullWidth
              disabled={!name || !mobile}
            >
              {editingId ? "Update Staff" : "Add Staff"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
          <SkeletonGlass lines={2} />
        </div>
      ) : staff && staff.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staff?.map((s, i) => (
            <GlassCard
              key={s.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="relative group">
                  {s.photoUrl ? (
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm"
                      style={{
                        background: "var(--glow-aqua)",
                        color: "var(--accent-aqua)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setUpdatingPhotoFor(s.id);
                      setCameraModalOpen(true);
                    }}
                    title="Update profile photo"
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <IoCamera size={11} />
                  </button>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    background: "var(--glow-aqua)",
                    color: "var(--accent-aqua)",
                  }}
                >
                  {roleLabels[s.role] ?? s.role}
                </span>
              </div>
              <h3
                className="font-bold text-sm mb-1 text-fg"
              >
                {s.name}
              </h3>
              {s.employeeId && (
                <p
                  className="text-[10px] font-mono font-bold mb-1"
                  style={{ color: "var(--accent-pool)" }}
                >
                  {s.employeeId}
                </p>
              )}
              <p
                className="text-xs font-mono mb-1 text-fg-muted"
              >
                {s.mobile}
              </p>
              {s.specialization && (
                <p
                  className="text-xs mb-3 text-fg-dim"
                >
                  {s.specialization}
                </p>
              )}
              <div className="flex items-center gap-1.5 mb-4">
                {s.isAvailable ? (
                  <IoCheckmarkCircle
                    size={12}
                    className="text-accent"
                  />
                ) : (
                  <IoCloseCircle
                    size={12}
                    className="text-fg-muted"
                  />
                )}
                <span
                  className="text-xs font-bold"
                  style={{
                    color: s.isAvailable
                      ? "var(--accent-aqua)"
                      : "var(--text-muted)",
                  }}
                >
                  {s.isAvailable ? "Available" : "Off Duty"}
                </span>
              </div>
              <div
                className="flex flex-col gap-2 pt-3 border-t border-glass-border"
              >
                <GhostButton
                  size="sm"
                  fullWidth
                  onClick={() => setDownloadFor(s)}
                >
                  <IoCard size={14} /> Download ID Card
                </GhostButton>
                <div className="flex gap-2">
                  <a href={`tel:${s.mobile}`} className="flex-1">
                    <GhostButton size="sm" fullWidth>
                      <IoCall size={14} /> Call
                    </GhostButton>
                  </a>
                  <GhostButton
                    size="sm"
                    onClick={() => handleEdit(s)}
                    className="flex-1"
                  >
                    <IoPencil size={14} /> Edit
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

      <input
        ref={formFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFormFileChange}
      />
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCardFileChange}
      />

      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => {
          setCameraModalOpen(false);
          setUpdatingPhotoFor(null);
        }}
        onCapture={handleCapturedPhoto}
        title={updatingPhotoFor ? "Update Staff Photo" : "Staff Profile Photo"}
        guideMode="avatar"
        initialFacingMode="user"
      />
    </div>
  );
}
