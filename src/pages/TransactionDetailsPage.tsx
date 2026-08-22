import { useParams, Link } from "react-router";
import { useGetTransactionQuery } from "@/store/api/billingApi";
import { useGetCustomerQuery } from "@/store/api/customersApi";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import { GlassCard, PrimaryButton, GhostButton, SkeletonGlass } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ReceiptCard } from "@/components/ui/ReceiptCard";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  IoArrowBack, IoCheckmarkCircle, IoReceipt, IoPerson,
  IoCalendar, IoTime, IoCard, IoReceiptOutline,
  IoChevronForward,
} from "react-icons/io5";

export function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: transaction, isLoading: txnLoading } = useGetTransactionQuery(id!);
  const { data: customer, isLoading: custLoading } = useGetCustomerQuery(transaction?.customerId ?? "", { skip: !transaction });
  const { data: settings } = useGetSettingsQuery();

  if (txnLoading || custLoading) return (
    <div className="max-w-lg mx-auto space-y-6">
      <SkeletonGlass lines={1} />
      <SkeletonGlass lines={4} />
      <SkeletonGlass lines={3} />
    </div>
  );
  if (!transaction || !customer || !settings) return <div className="text-center py-20" style={{ color: "var(--text-secondary)" }}>Transaction not found</div>;

  const dateParts = formatDateTime(transaction.paidAt).split(", ");

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Reports", href: "/reports" },
        { label: `Transaction ${transaction.billNumber}` }
      ]} />

      {/* Back */}
      <Link to="/"
        className="inline-flex liquid-glass p-2.5 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] items-center justify-center active:scale-95 animate-fade-up"
      >
        <IoArrowBack size={20} style={{ color: "var(--text-primary)" }} />
      </Link>

      {/* Success Banner */}
      <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 text-center animate-scale-in">
        <div className="absolute inset-0 opacity-20"
          style={{ background: "linear-gradient(135deg, var(--accent-aqua) 0%, transparent 60%)" }}
        />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: "var(--accent-aqua)", filter: "blur(40px)" }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 animate-pulse-glow"
            style={{ background: "var(--glow-aqua)" }}
          >
            <IoCheckmarkCircle className="animate-float-gentle" size={36} style={{ color: "var(--accent-aqua)" }} />
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Payment Successful</h1>
          <p className="text-sm font-mono mt-1" style={{ color: "var(--text-muted)" }}>Transaction completed</p>
        </div>
      </div>

      {/* Bill Number + Amount Hero */}
      <div className="grid grid-cols-2 gap-3">
        <div className="liquid-glass relative overflow-hidden p-5 text-center animate-fade-up stagger-1">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Bill Number</p>
          <p className="text-lg font-bold font-mono mt-1.5" style={{ color: "var(--text-primary)" }}>{transaction.billNumber}</p>
        </div>
        <div className="liquid-glass relative overflow-hidden p-5 text-center animate-fade-up stagger-2">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Amount Paid</p>
          <p className="text-lg font-bold font-mono mt-1.5" style={{ color: "var(--accent-coral)" }}>{formatCurrency(transaction.amount)}</p>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="space-y-3">
        {/* Customer Info */}
        <GlassCard padding={false}>
          <Link to={`/customers/${customer.id}`}
            className="flex items-center gap-4 p-4 transition-all hover:brightness-110 group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5FD9D6, #146C8E)" }}
            >
              <IoPerson size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Customer</p>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{customer.name}</p>
              <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{customer.mobile}</p>
            </div>
            <IoChevronForward size={16} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-muted)" }} />
          </Link>
        </GlassCard>

        {/* Service & Date */}
        <GlassCard>
          <div className="space-y-4">
            <DetailRow icon={<IoReceiptOutline size={16} />} label="Service" value={transaction.serviceName} />
            <DetailRow icon={<IoCard size={16} />} label="Payment Method" value={transaction.paymentMethod} />
            <DetailRow icon={<IoCalendar size={16} />} label="Date" value={dateParts[0]} />
            <DetailRow icon={<IoTime size={16} />} label="Time" value={dateParts[1] || ""} />
          </div>
        </GlassCard>

        {/* Status */}
        <GlassCard padding={false}>
          <div className="flex items-center gap-4 p-4"
            style={{ background: "var(--glow-aqua)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-aqua)", color: "white" }}
            >
              <IoCheckmarkCircle size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Transaction Status</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Payment confirmed and recorded</p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
              style={{ background: "var(--accent-aqua)", color: "white" }}
            >
              Success
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Receipt */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <IoReceipt size={16} style={{ color: "var(--text-muted)" }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Receipt Preview</h3>
        </div>
        <ReceiptCard transaction={transaction} customer={customer} settings={settings} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to={`/customers/${customer.id}`} className="flex-1">
          <GhostButton fullWidth size="md">
            <IoPerson size={16} />
            Customer
          </GhostButton>
        </Link>
        <Link to={`/billing/${customer.id}`} className="flex-1">
          <PrimaryButton fullWidth size="md">
            <IoReceipt size={16} />
            New Billing
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
      </div>
      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}
