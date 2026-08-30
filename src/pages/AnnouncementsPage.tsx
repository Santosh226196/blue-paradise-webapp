import { useState } from "react";
import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "@/store/api/announcementsApi";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  EmptyState,
  SkeletonGlass,
  Input,
} from "@/components/ui";
import {
  IoMegaphone,
  IoAdd,
  IoTrash,
  IoPencil,
  IoClose,
  IoAlertCircle,
  IoInformationCircle,
} from "react-icons/io5";

export function AnnouncementsPage() {
  const { data: announcements, isLoading } = useGetAnnouncementsQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  function resetForm() {
    setTitle("");
    setMessage("");
    setPriority("MEDIUM");
    setIsActive(true);
    setExpiresAt("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(a: {
    id: string;
    title: string;
    message: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    isActive: boolean;
    expiresAt?: string;
  }) {
    setEditingId(a.id);
    setTitle(a.title);
    setMessage(a.message);
    setPriority(a.priority);
    setIsActive(a.isActive);
    setExpiresAt(a.expiresAt?.split("T")[0] ?? "");
    setShowForm(true);
  }

  async function handleSave() {
    const payload = {
      title,
      message,
      priority,
      isActive,
      expiresAt: expiresAt || undefined,
    };
    if (editingId) {
      await updateAnnouncement({ id: editingId, data: payload });
    } else {
      await createAnnouncement(payload);
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    await deleteAnnouncement(id);
  }

  const priorityConfig = {
    HIGH: {
      bg: "var(--glow-coral)",
      color: "var(--accent-coral)",
      icon: <IoAlertCircle size={16} />,
    },
    MEDIUM: {
      bg: "var(--glow-aqua)",
      color: "var(--accent-aqua)",
      icon: <IoMegaphone size={16} />,
    },
    LOW: {
      bg: "var(--glow-pool)",
      color: "var(--accent-pool)",
      icon: <IoInformationCircle size={16} />,
    },
  };

  const active = announcements?.filter((a) => a.isActive) ?? [];
  const inactive = announcements?.filter((a) => !a.isActive) ?? [];

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
          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-fg"
          >
            Announcements
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Club-wide notices and updates
          </p>
        </div>
        <PrimaryButton
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IoAdd size={16} /> New
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassCard className="animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-sm font-bold text-fg"
            >
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h2>
            <button onClick={resetForm} className="text-fg-muted cursor-pointer">
              <IoClose size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
                Title
              </label>
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pool Maintenance Notice"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write your announcement..."
                className="w-full px-4 py-3 rounded-xl text-sm font-medium resize-none min-h-20 border border-input-border bg-input text-fg outline-none focus:border-input-focus"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider text-fg-muted"
                >
                  Priority
                </label>
                <div className="flex gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-h-10 cursor-pointer"
                      style={{
                        background:
                          priority === p
                            ? priorityConfig[p].bg
                            : "var(--glass-bg)",
                        border: `1.5px solid ${priority === p ? priorityConfig[p].color : "var(--glass-border)"}`,
                        color:
                          priority === p
                            ? priorityConfig[p].color
                            : "var(--text-secondary)",
                      }}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider text-fg-muted"
                >
                  Expires (optional)
                </label>
                <Input
                  label="Expires (optional)"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
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
                  Active
                </p>
                <p
                  className="text-xs mt-0.5 text-fg-muted"
                >
                  Show on dashboard
                </p>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive
                    ? "var(--accent-aqua)"
                    : "var(--text-muted)",
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
              disabled={!title || !message}
            >
              {editingId ? "Update Announcement" : "Post Announcement"}
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonGlass lines={3} />
          <SkeletonGlass lines={3} />
        </div>
      ) : announcements && announcements.length > 0 ? (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
                Active
              </h2>
              {active?.map((a, i) => (
                <GlassCard
                  key={a.id}
                  padding={false}
                  className="p-5 animate-fade-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: priorityConfig[a.priority].bg,
                          color: priorityConfig[a.priority].color,
                        }}
                      >
                        {priorityConfig[a.priority].icon}
                      </div>
                      <div>
                        <h3
                          className="text-sm font-bold text-fg"
                        >
                          {a.title}
                        </h3>
                        <p
                          className="text-[10px] font-bold uppercase"
                          style={{ color: priorityConfig[a.priority].color }}
                        >
                          {a.priority.toLowerCase()} priority
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <GhostButton
                        size="sm"
                        onClick={() =>
                          handleEdit({
                            id: a.id,
                            title: a.title,
                            message: a.message,
                            priority: a.priority,
                            isActive: a.isActive,
                            expiresAt: a.expiresAt,
                          })
                        }
                      >
                        <IoPencil size={14} />
                      </GhostButton>
                      <GhostButton
                        size="sm"
                        onClick={() => handleDelete(a.id)}
                        className="text-danger"
                      >
                        <IoTrash size={14} />
                      </GhostButton>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-3 text-fg-dim"
                  >
                    {a.message}
                  </p>
                  <p
                    className="text-[10px] font-mono text-fg-muted"
                  >
                    Posted {new Date(a.createdAt).toLocaleDateString()}
                    {a.expiresAt
                      ? ` · Expires ${new Date(a.expiresAt).toLocaleDateString()}`
                      : ""}
                  </p>
                </GlassCard>
              ))}
            </div>
          )}
          {inactive.length > 0 && (
            <div className="space-y-3">
              <h2
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
                Inactive
              </h2>
              {inactive?.map((a) => (
                <GlassCard
                  key={a.id}
                  padding={false}
                  className="p-4 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-bold text-fg"
                      >
                        {a.title}
                      </p>
                      <p
                        className="text-xs text-fg-muted"
                      >
                        {a.message.slice(0, 80)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <GhostButton
                        size="sm"
                        onClick={() =>
                          handleEdit({
                            id: a.id,
                            title: a.title,
                            message: a.message,
                            priority: a.priority,
                            isActive: a.isActive,
                            expiresAt: a.expiresAt,
                          })
                        }
                      >
                        <IoPencil size={14} />
                      </GhostButton>
                      <GhostButton
                        size="sm"
                        onClick={() => handleDelete(a.id)}
                        className="text-danger"
                      >
                        <IoTrash size={14} />
                      </GhostButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<IoMegaphone size={36} />}
          title="No announcements"
          description="Post your first announcement to notify club members"
          action={
            <PrimaryButton onClick={() => setShowForm(true)}>
              <IoAdd size={18} /> Post Announcement
            </PrimaryButton>
          }
        />
      )}
    </div>
  );
}
