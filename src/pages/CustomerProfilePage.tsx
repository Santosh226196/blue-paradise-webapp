import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useGetCustomerVisitsQuery,
  useGetCustomerTransactionsQuery,
  useGetCustomerMembershipsQuery,
} from "@/store/api/customersApi";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import { GlassCard, PrimaryButton, SkeletonGlass, StatCard, CameraCaptureModal } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { VisitType } from "@/types";
import {
  IoArrowBack, IoCalendar, IoCard, IoFootsteps, IoReceipt,
  IoPerson, IoPhonePortrait, IoLocationSharp, IoWater,
  IoFitness, IoTime, IoChevronForward,
  IoWallet, IoStar, IoClipboard, IoCall, IoCamera,
} from "react-icons/io5";

type Tab = "overview" | "visits" | "membership" | "payments";

export function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useGetCustomerQuery(id!);
  const [updateCustomer] = useUpdateCustomerMutation();
  const { data: visits } = useGetCustomerVisitsQuery(id!);
  const { data: transactions } = useGetCustomerTransactionsQuery(id!);
  const { data: memberships } = useGetCustomerMembershipsQuery(id!);
  const { data: settings } = useGetSettingsQuery();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<"avatar" | "idCard">("avatar");

  if (isLoading) return (
    <div className="space-y-6">
      <SkeletonGlass lines={1} />
      <div className="grid grid-cols-3 gap-3"><SkeletonGlass lines={2} /><SkeletonGlass lines={2} /><SkeletonGlass lines={2} /></div>
      <SkeletonGlass lines={4} />
    </div>
  );
  if (!customer) return <div className="text-center py-20" style={{ color: "var(--text-secondary)" }}>Customer not found</div>;

  const totalSpent = transactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
  const activeMembership = memberships?.find((m) => m.status === "ACTIVE");
  const initials = customer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  function openCamera(target: "avatar" | "idCard") {
    setCameraTarget(target);
    setCameraModalOpen(true);
  }

  async function handleCapturedPhoto(photoDataUrl: string) {
    if (cameraTarget === "avatar") {
      await updateCustomer({ id: customer!.id, data: { photoUrl: photoDataUrl } });
    } else {
      await updateCustomer({ id: customer!.id, data: { idCardPhoto: photoDataUrl } });
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "overview", label: "Overview", icon: <IoPerson size={16} /> },
    { key: "visits", label: "Visits", icon: <IoFootsteps size={16} />, count: visits?.length },
    { key: "membership", label: "Membership", icon: <IoWater size={16} /> },
    { key: "payments", label: "Payments", icon: <IoCard size={16} />, count: transactions?.length },
  ];

  return (
    <div className="space-y-6">
      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCapturedPhoto}
        title={cameraTarget === "avatar" ? `Capture Photo for ${customer.name}` : `Capture ID Card for ${customer.name}`}
        guideMode={cameraTarget === "avatar" ? "avatar" : "document"}
        initialFacingMode={cameraTarget === "avatar" ? "user" : "environment"}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Customers", href: "/customers" },
        { label: customer.name }
      ]} />

      {/* Back */}
      <Link to="/customers"
        className="inline-flex liquid-glass p-2.5 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] items-center justify-center active:scale-95 animate-fade-up border border-white/10"
      >
        <IoArrowBack size={20} style={{ color: "var(--text-primary)" }} />
      </Link>

      {/* Hero Card */}
      <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 animate-fade-up">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: "linear-gradient(135deg, var(--accent-aqua) 0%, var(--accent-pool) 50%, transparent 100%)" }}
        />
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10"
          style={{ background: "var(--accent-aqua)", filter: "blur(40px)" }}
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Camera Trigger Overlay */}
            <div className="relative group">
              {customer.photoUrl ? (
                <img
                  src={customer.photoUrl}
                  alt={customer.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/30"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shrink-0 text-white font-display text-2xl font-bold border-2 border-cyan-400/40"
                  style={{ background: "linear-gradient(135deg, #5FD9D6, #146C8E)", boxShadow: "0 8px 24px rgba(95,217,214,0.3)" }}
                >
                  {initials}
                </div>
              )}

              {/* Camera Snap Button Overlay */}
              <button
                type="button"
                onClick={() => openCamera("avatar")}
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-slate-900 border border-cyan-400/60 text-cyan-300 shadow-md hover:bg-cyan-400 hover:text-slate-950 transition-all active:scale-90"
                title="Snap new photo with Camera"
              >
                <IoCamera size={16} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold truncate" style={{ color: "var(--text-primary)" }}>
                  {customer.name}
                </h1>
                {activeMembership && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-400/15 border border-cyan-400 text-cyan-300">
                    Active Member
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-slate-300">
                <IoPhonePortrait size={14} className="text-cyan-400" />
                <span className="font-mono text-sm font-semibold">{customer.mobile}</span>
              </div>
              {customer.address && (
                <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                  <IoLocationSharp size={13} className="text-cyan-400" />
                  <span className="text-xs truncate">{customer.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-5">
            <Link to={`/billing/${customer.id}`} className="flex-1">
              <PrimaryButton fullWidth size="sm">
                <IoReceipt size={16} />
                New Billing
              </PrimaryButton>
            </Link>
            <button
              type="button"
              onClick={() => openCamera("avatar")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 transition-all"
            >
              <IoCamera size={16} />
              <span>Update Face Photo</span>
            </button>
            <a href={`tel:${customer.mobile}`} className="flex-1">
              <PrimaryButton fullWidth size="sm" className="w-full"
                style={{ background: "linear-gradient(135deg, #146C8E, #0E8E8A)" }}
              >
                <IoCall size={16} />
                Call
              </PrimaryButton>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Visits" value={visits?.length ?? 0} icon={<IoFootsteps size={18} />} className="stagger-1" />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<IoWallet size={18} />} className="stagger-2" />
        <StatCard label="Transactions" value={transactions?.length ?? 0} icon={<IoReceipt size={18} />} className="stagger-3" />
        <StatCard label="Member Since" value={formatDate(customer.createdAt)} icon={<IoStar size={18} />} className="stagger-4" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 min-h-[44px] whitespace-nowrap"
            style={{
              background: activeTab === tab.key ? "var(--glow-aqua)" : "var(--glass-bg)",
              border: `1.5px solid ${activeTab === tab.key ? "var(--accent-aqua)" : "var(--glass-border)"}`,
              color: activeTab === tab.key ? "var(--accent-aqua)" : "var(--text-secondary)",
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px]"
                style={{ background: activeTab === tab.key ? "rgba(95,217,214,0.2)" : "var(--glass-bg-hover)" }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {activeTab === "overview" && (
        <div className="space-y-4 animate-fade-up">
          {/* Photos & Documents Verification Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IoCamera size={18} style={{ color: "var(--accent-aqua)" }} />
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Photo & ID Verification
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Profile Photo */}
              <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex items-center gap-4">
                {customer.photoUrl ? (
                  <img src={customer.photoUrl} alt="Member" className="w-16 h-16 rounded-xl object-cover border border-cyan-400" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <IoPerson size={28} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">Profile Photo</p>
                  <p className="text-[11px] text-slate-400">{customer.photoUrl ? "Captured & verified" : "No photo recorded"}</p>
                  <button
                    type="button"
                    onClick={() => openCamera("avatar")}
                    className="mt-2 text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <IoCamera size={14} />
                    {customer.photoUrl ? "Retake Photo" : "Click Live Photo"}
                  </button>
                </div>
              </div>

              {/* ID Document Photo */}
              <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex items-center gap-4">
                {customer.idCardPhoto ? (
                  <img src={customer.idCardPhoto} alt="ID Document" loading="lazy" className="w-20 h-14 rounded-lg object-cover border border-cyan-400" />
                ) : (
                  <div className="w-20 h-14 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <IoCard size={24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">ID Card / Aadhaar Snap</p>
                  <p className="text-[11px] text-slate-400">{customer.idCardPhoto ? "Document attached" : "No document photo"}</p>
                  <button
                    type="button"
                    onClick={() => openCamera("idCard")}
                    className="mt-2 text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <IoCamera size={14} />
                    {customer.idCardPhoto ? "Retake ID Snap" : "Snap ID Card"}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Personal Info */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <IoPerson size={18} style={{ color: "var(--accent-aqua)" }} />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<IoPerson size={14} />} label="Full Name" value={customer.name} />
              <InfoRow icon={<IoPhonePortrait size={14} />} label="Mobile" value={customer.mobile} mono />
              <InfoRow icon={<IoCard size={14} />} label="Aadhaar Number" value={customer.aadhaarNumber || "Not provided"} mono />
              <InfoRow icon={<IoCalendar size={14} />} label="Age" value={customer.age ? `${customer.age} years` : "Not provided"} />
              <InfoRow icon={<IoClipboard size={14} />} label="Gender" value={customer.gender || "Not provided"} />
              <div className="sm:col-span-2">
                <InfoRow icon={<IoLocationSharp size={14} />} label="Address" value={customer.address || "Not provided"} />
              </div>
            </div>
          </GlassCard>

          {/* Membership Status */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <IoWater size={18} style={{ color: "var(--accent-aqua)" }} />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Current Membership</h3>
            </div>
            {activeMembership ? (
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--glow-aqua)", border: "1px solid var(--accent-aqua)" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{activeMembership.membershipType} Membership</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {formatDate(activeMembership.startDate)} — {formatDate(activeMembership.endDate)}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                  style={{ background: "var(--accent-aqua)", color: "white" }}
                >
                  Active
                </span>
              </div>
            ) : (
              <div className="text-center py-6 rounded-xl" style={{ background: "var(--glass-bg)" }}>
                <IoWater size={28} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No active membership</p>
                <Link to={`/billing/${customer.id}`} className="inline-block mt-2">
                  <PrimaryButton size="sm">Activate Now</PrimaryButton>
                </Link>
              </div>
            )}
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IoTime size={18} style={{ color: "var(--accent-aqua)" }} />
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Recent Activity</h3>
              </div>
              <button onClick={() => setActiveTab("visits")} className="text-xs font-bold flex items-center gap-0.5" style={{ color: "var(--accent-aqua)" }}>
                View All <IoChevronForward size={12} />
              </button>
            </div>
            {visits && visits.length > 0 ? (
              <div className="space-y-2">
                {visits.slice(0, 3).map((visit) => (
                  <div key={visit.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
                    >
                      <IoFootsteps size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{visit.visitType.replace("_", " ")}</p>
                      <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{formatDateTime(visit.visitedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-sm" style={{ color: "var(--text-muted)" }}>No visits yet</p>
            )}
          </GlassCard>
        </div>
      )}

      {/* ─── Visits Tab ─── */}
      {activeTab === "visits" && (
        <div className="animate-fade-up">
          {visits && visits.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5" style={{ background: "var(--glass-border)" }} />

              <div className="space-y-3">
                {visits.map((visit, i) => {
                  const isWalkIn = visit.visitType === VisitType.WalkIn || visit.visitType === VisitType.Hourly;
                  return (
                    <div key={visit.id} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                      {/* Timeline dot */}
                      <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: isWalkIn ? "var(--glow-coral)" : "var(--glow-aqua)", color: isWalkIn ? "var(--accent-coral)" : "var(--accent-aqua)" }}
                      >
                        {isWalkIn ? <IoTime size={16} /> : visit.visitType === "COACHING" ? <IoFitness size={16} /> : <IoWater size={16} />}
                      </div>

                      <GlassCard padding={false} className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                              {visit.visitType.replace("_", " ")}
                            </p>
                            <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                              {formatDateTime(visit.visitedAt)}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
                            style={{ background: "var(--glass-bg-hover)", color: "var(--text-muted)" }}
                          >
                            #{i + 1}
                          </span>
                        </div>
                      </GlassCard>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyBlock icon={<IoFootsteps size={32} />} title="No visits yet" description="This customer hasn't visited yet" />
          )}
        </div>
      )}

      {/* ─── Membership Tab ─── */}
      {activeTab === "membership" && (
        <div className="space-y-4 animate-fade-up">
          {memberships && memberships.length > 0 ? (
            memberships.map((m, i) => (
              <GlassCard key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: m.status === "ACTIVE" ? "var(--glow-aqua)" : "var(--glass-bg-hover)", color: m.status === "ACTIVE" ? "var(--accent-aqua)" : "var(--text-muted)" }}
                    >
                      <IoWater size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{m.membershipType} Membership</p>
                      <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {formatDate(m.startDate)} — {formatDate(m.endDate)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{
                      background: m.status === "ACTIVE" ? "var(--accent-aqua)" : "var(--glass-bg-hover)",
                      color: m.status === "ACTIVE" ? "white" : "var(--text-muted)",
                    }}
                  >
                    {m.status}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Amount Paid</span>
                  <span className="text-sm font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(m.amount)}</span>
                </div>
              </GlassCard>
            ))
          ) : (
            <EmptyBlock icon={<IoWater size={32} />} title="No memberships" description="This customer has no membership records" action={
              <Link to={`/billing/${customer.id}`}><PrimaryButton size="sm">Buy Membership</PrimaryButton></Link>
            } />
          )}
        </div>
      )}

      {/* ─── Payments Tab ─── */}
      {activeTab === "payments" && (
        <div className="space-y-3 animate-fade-up">
          {transactions && transactions.length > 0 && settings ? (
            <>
              {/* Summary */}
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Total Payments</p>
                    <p className="text-2xl font-bold font-mono mt-1" style={{ color: "var(--accent-coral)" }}>{formatCurrency(totalSpent)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Transactions</p>
                    <p className="text-2xl font-bold font-mono mt-1" style={{ color: "var(--text-primary)" }}>{transactions.length}</p>
                  </div>
                </div>
              </GlassCard>

              {transactions.map((txn) => (
                <Link key={txn.id} to={`/transactions/${txn.id}`} className="block">
                  <GlassCard padding={false} className="p-4 transition-all duration-200 hover:brightness-110 active:scale-[0.99] group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "var(--glow-coral)", color: "var(--accent-coral)" }}
                      >
                        <IoReceipt size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{txn.serviceName}</p>
                        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{txn.billNumber} · {formatDate(txn.paidAt)}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="text-sm font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(txn.amount)}</p>
                        <IoChevronForward size={14} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-muted)" }} />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </>
          ) : (
            <EmptyBlock icon={<IoCard size={32} />} title="No payments" description="This customer hasn't made any payments yet" />
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "var(--glass-bg)" }}>
      <span className="mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }}>{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${mono ? "font-mono" : ""}`} style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

function EmptyBlock({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <GlassCard className="text-center py-12">
      <div className="mb-4 mx-auto w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--glass-bg-hover)", color: "var(--text-muted)" }}>
        {icon}
      </div>
      <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </GlassCard>
  );
}
