import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useGetCustomersQuery, useGetCustomerQuery } from "@/store/api/customersApi";
import { useCreateTransactionMutation } from "@/store/api/billingApi";
import { GlassCard, PrimaryButton, GhostButton, ServiceCard, StepperHeader, SkeletonGlass, Modal } from "@/components/ui";
import { ServiceType, SERVICE_NAMES, SERVICE_AMOUNTS, type PaymentMethod } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import {
  IoSearch,
  IoWater,
  IoFitness,
  IoTimer,
  IoPersonAdd,
  IoCashOutline,
  IoQrCodeOutline,
  IoCardOutline,
} from "react-icons/io5";

const STEPS = ["Select Customer", "Select Service", "Collect Payment"];

export function BillingPage() {
  const { customerId } = useParams<{ customerId?: string }>();
  const navigate = useNavigate();
  const { data: preselectedCustomer } = useGetCustomerQuery(customerId!, { skip: !customerId });
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const { data: customers, isLoading: customersLoading } = useGetCustomersQuery({ search });
  const [selectedCustomer, setSelectedCustomer] = useState(preselectedCustomer ?? null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [step, setStep] = useState(customerId ? 1 : 0);
  const [createTransaction, { isLoading: paymentLoading }] = useCreateTransactionMutation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState(false);

  // Error modal
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  useEffect(() => {
    if (preselectedCustomer && !selectedCustomer) {
      setSelectedCustomer(preselectedCustomer);
      if (step === 0) setStep(1);
    }
  }, [preselectedCustomer, selectedCustomer, step]);

  function handlePay() {
    if (!selectedCustomer || !selectedService) return;
    setConfirmModal(false);
    createTransaction({
      customerId: selectedCustomer.id,
      serviceType: selectedService,
      serviceName: SERVICE_NAMES[selectedService],
      amount: SERVICE_AMOUNTS[selectedService],
      paymentMethod,
    })
      .unwrap()
      .then((txn) => {
        showToast("success", `Bill ${txn.billNumber} generated successfully!`);
        navigate(`/bill/${txn.id}`);
      })
      .catch((err) => {
        showToast("error", err?.data?.message || "Payment failed. Please try again.");
        setErrorModal({ open: true, message: err?.data?.message || "Payment processing failed. Please check the details and try again." });
      });
  }

  const inputStyle = {
    background: "var(--input-bg)",
    border: "1.5px solid var(--input-border)",
    color: "var(--text-primary)",
    outlineColor: "var(--input-focus-ring)",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Point of Sale & Billing
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process payments, generate instant thermal receipts and passes
          </p>
        </div>
      </div>

      <StepperHeader steps={STEPS} currentStep={step} />

      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Main Column */}
        <div className={`space-y-4 ${step < 2 ? "lg:col-span-3" : "lg:col-span-5"}`}>
          {/* Step 1: Choose Customer */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-up">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search member by name or mobile..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
                    style={inputStyle}
                  />
                </div>
                <Link to="/customers/new">
                  <PrimaryButton size="md" className="h-full">
                    <IoPersonAdd size={16} />
                    <span className="hidden sm:inline">New Member</span>
                  </PrimaryButton>
                </Link>
              </div>

              {customersLoading ? (
                <SkeletonGlass lines={3} />
              ) : customers && customers.length > 0 ? (
                <div className="space-y-2">
                  {customers.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setStep(1);
                        showToast("info", `Selected ${c.name}`);
                      }}
                      className="liquid-glass relative overflow-hidden w-full p-3.5 text-left transition-all duration-200 min-h-[56px] active:scale-[0.99] animate-fade-up flex items-center justify-between border border-white/10 hover:border-cyan-400/40"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="flex items-center gap-3.5">
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt="" loading="lazy" className="w-10 h-10 rounded-xl object-cover border border-cyan-400/60" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center font-bold text-sm">
                            {c.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">{c.name}</p>
                          <p className="text-xs font-mono text-slate-400">{c.mobile}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl border border-white/10 bg-white/5 space-y-3">
                  <p className="text-sm text-slate-400">No member found matching "{search}"</p>
                  <Link to="/customers/new">
                    <PrimaryButton size="sm">
                      <IoPersonAdd size={16} /> Register as New Member
                    </PrimaryButton>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Service */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-up">
              {selectedCustomer && (
                <GlassCard padding={false} className="p-4 flex items-center justify-between border-cyan-400/30">
                  <div className="flex items-center gap-3">
                    {selectedCustomer.photoUrl ? (
                      <img src={selectedCustomer.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-cyan-400" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center font-bold text-sm">
                        {selectedCustomer.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Selected Member</p>
                      <p className="text-sm font-bold text-white">{selectedCustomer.name}</p>
                      <p className="text-xs font-mono text-slate-400">{selectedCustomer.mobile}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10"
                  >
                    Change
                  </button>
                </GlassCard>
              )}

              <div className="space-y-2.5">
                <ServiceCard
                  title="General Membership"
                  description="Monthly, Quarterly or Yearly full pool access"
                  amount={formatCurrency(SERVICE_AMOUNTS[ServiceType.Membership])}
                  icon={<IoWater size={24} />}
                  selected={selectedService === ServiceType.Membership}
                  onClick={() => setSelectedService(ServiceType.Membership)}
                />
                <ServiceCard
                  title="Swimming Coaching"
                  description="Professional swim instruction & coach sessions"
                  amount={formatCurrency(SERVICE_AMOUNTS[ServiceType.Coaching])}
                  icon={<IoFitness size={24} />}
                  selected={selectedService === ServiceType.Coaching}
                  onClick={() => setSelectedService(ServiceType.Coaching)}
                />
                <ServiceCard
                  title="Hourly Swimming Pass"
                  description="Single 1-hour lane access session"
                  amount={formatCurrency(SERVICE_AMOUNTS[ServiceType.HourlySwimming])}
                  icon={<IoTimer size={24} />}
                  selected={selectedService === ServiceType.HourlySwimming}
                  onClick={() => setSelectedService(ServiceType.HourlySwimming)}
                />
              </div>

              {selectedService && (
                <PrimaryButton fullWidth size="lg" onClick={() => setStep(2)}>
                  Continue to Payment — {formatCurrency(SERVICE_AMOUNTS[selectedService])}
                </PrimaryButton>
              )}
            </div>
          )}

          {/* Step 3: Payment & Print */}
          {step === 2 && selectedCustomer && selectedService && (
            <div className="space-y-5 animate-fade-up lg:max-w-2xl">
              <GlassCard>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-sm text-slate-400">Customer Name</span>
                    <span className="font-bold text-white text-sm">{selectedCustomer.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-sm text-slate-400">Service Plan</span>
                    <span className="font-bold text-cyan-300 text-sm">{SERVICE_NAMES[selectedService]}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Due</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Taxes included</span>
                    </div>
                    <span className="text-3xl font-bold font-mono text-cyan-400">
                      {formatCurrency(SERVICE_AMOUNTS[selectedService])}
                    </span>
                  </div>
                </div>
              </GlassCard>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Select Payment Method
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
                      className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl text-xs font-bold transition-all min-h-[72px] border ${
                        paymentMethod === method
                          ? "bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                          : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <GhostButton onClick={() => setStep(1)} size="lg" className="w-1/3">
                  Back
                </GhostButton>
                <PrimaryButton fullWidth size="lg" onClick={() => setConfirmModal(true)} className="flex-1 shadow-lg shadow-cyan-500/25">
                  Confirm & Generate Bill ({formatCurrency(SERVICE_AMOUNTS[selectedService])})
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel (desktop only) */}
        {step < 2 && (
          <div className="hidden lg:block lg:col-span-2 space-y-4">
            <GlassCard>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Quick Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Selected Member</span>
                  <span className="text-xs font-bold" style={{ color: selectedCustomer ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {selectedCustomer?.name || "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Service</span>
                  <span className="text-xs font-bold" style={{ color: selectedService ? "var(--accent-aqua)" : "var(--text-muted)" }}>
                    {selectedService ? SERVICE_NAMES[selectedService] : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--glow-aqua)", border: "1px solid var(--accent-aqua)" }}>
                  <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Total</span>
                  <span className="text-lg font-bold font-mono" style={{ color: "var(--accent-aqua)" }}>
                    {selectedService ? formatCurrency(SERVICE_AMOUNTS[selectedService]) : "—"}
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Service Pricing</h3>
              <div className="space-y-2">
                {Object.entries(SERVICE_AMOUNTS).map(([type, amount]) => (
                  <div key={type} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{SERVICE_NAMES[type as ServiceType]}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handlePay}
        variant="confirm"
        title="Confirm Payment"
        message={`Process payment of ${formatCurrency(SERVICE_AMOUNTS[selectedService!])} for ${selectedCustomer?.name} via ${paymentMethod}?`}
        confirmLabel={paymentLoading ? "Processing..." : "Pay Now"}
        cancelLabel="Cancel"
      />

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: "" })}
        variant="error"
        title="Payment Failed"
        message={errorModal.message}
      />
    </div>
  );
}
