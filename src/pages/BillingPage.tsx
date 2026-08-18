import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetCustomersQuery, useGetCustomerQuery } from "@/store/api/customersApi";
import { useCreateTransactionMutation } from "@/store/api/billingApi";
import { GlassCard, PrimaryButton, ServiceCard, StepperHeader, SkeletonGlass } from "@/components/ui";
import { ServiceType, SERVICE_NAMES, SERVICE_AMOUNTS, type PaymentMethod } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { IoSearch, IoWater, IoFitness, IoTimer } from "react-icons/io5";

const STEPS = ["Customer", "Service", "Payment"];

export function BillingPage() {
  const { customerId } = useParams<{ customerId?: string }>();
  const navigate = useNavigate();
  const { data: preselectedCustomer } = useGetCustomerQuery(customerId!, { skip: !customerId });

  const [search, setSearch] = useState("");
  const { data: customers, isLoading: customersLoading } = useGetCustomersQuery({ search });
  const [selectedCustomer, setSelectedCustomer] = useState(preselectedCustomer ?? null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [step, setStep] = useState(customerId ? 1 : 0);
  const [createTransaction, { isLoading: paymentLoading }] = useCreateTransactionMutation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  useEffect(() => {
    if (preselectedCustomer && !selectedCustomer) {
      setSelectedCustomer(preselectedCustomer);
      if (step === 0) setStep(1);
    }
  }, [preselectedCustomer, selectedCustomer, step]);

  function handlePay() {
    if (!selectedCustomer || !selectedService) return;
    createTransaction({
      customerId: selectedCustomer.id,
      serviceType: selectedService,
      serviceName: SERVICE_NAMES[selectedService],
      amount: SERVICE_AMOUNTS[selectedService],
      paymentMethod,
    }).unwrap().then((txn) => {
      navigate(`/bill/${txn.id}`);
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
      <h1 className="font-display text-2xl sm:text-3xl font-bold animate-fade-up" style={{ color: "var(--text-primary)" }}>New Billing</h1>
      <StepperHeader steps={STEPS} currentStep={step} />

      {step === 0 && (
        <div className="space-y-4 animate-fade-up">
          <div className="relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer by name or mobile..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]"
              style={inputStyle}
            />
          </div>

          {customersLoading ? (
            <SkeletonGlass lines={3} />
          ) : customers && customers.length > 0 ? (
            <div className="space-y-2">
              {customers.map((c, i) => (
                <button key={c.id}
                  onClick={() => { setSelectedCustomer(c); setStep(1); }}
                  className="liquid-glass relative overflow-hidden w-full p-4 text-left transition-all duration-200 min-h-[48px] active:scale-[0.98] animate-fade-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                  <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{c.mobile}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>No customers found</p>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-fade-up">
          {selectedCustomer && (
            <GlassCard padding={false} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Customer</p>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{selectedCustomer.name}</p>
                <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{selectedCustomer.mobile}</p>
              </div>
              <button onClick={() => setStep(0)} className="text-xs font-bold" style={{ color: "var(--accent-aqua)" }}>Change</button>
            </GlassCard>
          )}

          <ServiceCard
            title="General Membership"
            description="Monthly, Quarterly or Yearly access"
            amount={formatCurrency(SERVICE_AMOUNTS[ServiceType.Membership])}
            icon={<IoWater size={24} />}
            selected={selectedService === ServiceType.Membership}
            onClick={() => setSelectedService(ServiceType.Membership)}
          />
          <ServiceCard
            title="Coaching"
            description="Professional swimming coaching"
            amount={formatCurrency(SERVICE_AMOUNTS[ServiceType.Coaching])}
            icon={<IoFitness size={24} />}
            selected={selectedService === ServiceType.Coaching}
            onClick={() => setSelectedService(ServiceType.Coaching)}
          />
          <ServiceCard
            title="Hourly Swimming"
            description="Pay per session swimming"
            amount={formatCurrency(SERVICE_AMOUNTS[ServiceType.HourlySwimming])}
            icon={<IoTimer size={24} />}
            selected={selectedService === ServiceType.HourlySwimming}
            onClick={() => setSelectedService(ServiceType.HourlySwimming)}
          />

          {selectedService && (
            <PrimaryButton fullWidth size="lg" onClick={() => setStep(2)}>
              Continue — {formatCurrency(SERVICE_AMOUNTS[selectedService])}
            </PrimaryButton>
          )}
        </div>
      )}

      {step === 2 && selectedCustomer && selectedService && (
        <div className="space-y-5 animate-fade-up">
          <GlassCard>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--text-secondary)" }}>Customer</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>{selectedCustomer.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--text-secondary)" }}>Service</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>{SERVICE_NAMES[selectedService]}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center" style={{ borderColor: "var(--glass-border)" }}>
                <span className="font-bold" style={{ color: "var(--text-secondary)" }}>Total</span>
                <span className="text-2xl font-bold font-mono" style={{ color: "var(--accent-coral)" }}>{formatCurrency(SERVICE_AMOUNTS[selectedService])}</span>
              </div>
            </div>
          </GlassCard>

          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Payment Method</p>
          <div className="grid grid-cols-3 gap-3">
            {(["CASH", "UPI", "CARD"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className="py-3.5 rounded-xl text-sm font-bold transition-all duration-200 min-h-[48px]"
                style={{
                  background: paymentMethod === method ? "var(--glow-aqua)" : "var(--glass-bg)",
                  border: `2px solid ${paymentMethod === method ? "var(--accent-aqua)" : "var(--glass-border)"}`,
                  color: paymentMethod === method ? "var(--accent-aqua)" : "var(--text-secondary)",
                  boxShadow: paymentMethod === method ? "0 0 16px var(--glow-aqua)" : "none",
                }}
              >
                {method}
              </button>
            ))}
          </div>

          <PrimaryButton fullWidth size="lg" onClick={handlePay} loading={paymentLoading}>
            Pay {formatCurrency(SERVICE_AMOUNTS[selectedService])}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
