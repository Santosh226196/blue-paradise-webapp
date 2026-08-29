import { useParams, Link } from "react-router";
import { useGetTransactionQuery } from "@/store/api/billingApi";
import { useGetCustomerQuery } from "@/store/api/customersApi";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import {
  ReceiptCard,
  SkeletonGlass,
  PrimaryButton,
  GhostButton,
} from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatCurrency } from "@/lib/utils";
import {
  IoCheckmarkCircle,
  IoEye,
  IoHome,
  IoReceipt,
  IoPrint,
  IoPerson,
} from "react-icons/io5";

export function BillPreviewPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { data: transaction, isLoading: txnLoading } = useGetTransactionQuery(
    transactionId!,
  );
  const { data: customer, isLoading: custLoading } = useGetCustomerQuery(
    transaction?.customerId ?? "",
    { skip: !transaction },
  );
  const { data: settings } = useGetSettingsQuery();

  if (txnLoading || custLoading)
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <SkeletonGlass lines={1} />
        <SkeletonGlass lines={4} />
        <SkeletonGlass lines={3} />
      </div>
    );
  if (!transaction || !customer || !settings)
    return (
      <div
        className="text-center py-20 text-fg-dim"
      >
        Transaction not found
      </div>
    );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Billing", href: "/billing" },
          { label: `Bill ${transaction.billNumber}` },
        ]}
      />

      {/* Celebration Hero */}
      <div className="liquid-glass relative overflow-hidden p-8 sm:p-10 text-center animate-scale-in">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(95,217,214,0.15) 0%, rgba(20,108,142,0.1) 50%, rgba(255,122,89,0.05) 100%)",
          }}
        />
        {/* Decorative circles */}
        <div
          className="absolute top-4 left-6 w-3 h-3 rounded-full opacity-40 animate-float-gentle bg-accent"
        />
        <div
          className="absolute top-8 right-10 w-2 h-2 rounded-full opacity-30 animate-float-gentle bg-danger"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-6 left-12 w-2 h-2 rounded-full opacity-25 animate-float-gentle bg-info"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-8 right-8 w-4 h-4 rounded-full opacity-20 animate-float-gentle bg-accent"
          style={{ animationDelay: "0.5s" }}
        />

        <div className="relative z-10">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-pulse-glow bg-glow-a"
          >
            <IoCheckmarkCircle
              className="animate-float-gentle text-accent"
              size={44}
            />
          </div>

          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-fg"
          >
            Payment Successful!
          </h1>
          <p
            className="text-sm mt-2 text-fg-dim"
          >
            Thank you, <span className="font-bold">{customer.name}</span>
          </p>

          {/* Amount Badge */}
          <div
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(255,122,89,0.12)",
              border: "1px solid rgba(255,122,89,0.2)",
            }}
          >
            <span
              className="text-xs font-bold uppercase text-danger"
            >
              Paid
            </span>
            <span
              className="text-xl font-bold font-mono text-danger"
            >
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          {/* Bill Number */}
          <p
            className="text-xs font-mono mt-3 text-fg-muted"
          >
            Bill #{transaction.billNumber}
          </p>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="liquid-glass relative overflow-hidden p-5 animate-fade-up stagger-1">
        <div className="flex items-center gap-3 mb-4">
          <IoReceipt size={18} className="text-accent" />
          <h3
            className="text-xs font-bold uppercase tracking-wider text-fg-muted"
          >
            Transaction Summary
          </h3>
        </div>
        <div className="space-y-3">
          <SummaryRow label="Customer" value={customer.name} />
          <SummaryRow label="Mobile" value={customer.mobile} mono />
          <SummaryRow label="Service" value={transaction.serviceName} />
          <SummaryRow label="Payment" value={transaction.paymentMethod} />
          <div
            className="border-t pt-3 flex justify-between items-center border-glass-border"
          >
            <span
              className="text-sm font-bold text-fg-dim"
            >
              Total
            </span>
            <span
              className="text-xl font-bold font-mono text-danger"
            >
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Receipt */}
      <div className="animate-fade-up stagger-2">
        <div className="flex items-center gap-2 mb-3">
          <IoPrint size={14} className="text-fg-muted" />
          <h3
            className="text-xs font-bold uppercase tracking-wider text-fg-muted"
          >
            Thermal Receipt
          </h3>
        </div>
        <ReceiptCard
          transaction={transaction}
          customer={customer}
          settings={settings}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-3">
        <Link to="/" className="flex-1">
          <GhostButton fullWidth size="lg">
            <IoHome size={18} />
            Dashboard
          </GhostButton>
        </Link>
        <Link to={`/transactions/${transaction.id}`} className="flex-1">
          <PrimaryButton fullWidth size="lg">
            <IoEye size={18} />
            Full Details
          </PrimaryButton>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-4">
        <Link to={`/customers/${customer.id}`} className="flex-1">
          <GhostButton fullWidth size="md">
            <IoPerson size={16} />
            Customer Profile
          </GhostButton>
        </Link>
        <Link to={`/billing/${customer.id}`} className="flex-1">
          <GhostButton fullWidth size="md">
            <IoReceipt size={16} />
            New Billing
          </GhostButton>
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-fg-dim">
        {label}
      </span>
      <span
        className={`text-sm font-bold text-fg ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
