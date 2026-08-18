import { useRef } from "react";
import type { Transaction, Customer, BusinessSettings } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { printerService, type ReceiptData } from "@/services/printer";
import { PrimaryButton } from "./PrimaryButton";
import { IoPrint } from "react-icons/io5";

interface ReceiptCardProps {
  transaction: Transaction;
  customer: Customer;
  settings: BusinessSettings;
  onPrintComplete?: () => void;
  compact?: boolean;
}

export function ReceiptCard({ transaction, customer, settings, onPrintComplete, compact }: ReceiptCardProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  async function handlePrint() {
    const data: ReceiptData = { settings, transaction, customer };
    await printerService.printReceipt(data);
    onPrintComplete?.();
  }

  return (
    <div className="animate-fade-up">
      <div
        ref={receiptRef}
        className="rounded-t-2xl font-mono text-sm receipt-edge"
        style={{
          background: "var(--receipt-bg)",
          color: "var(--receipt-text)",
          padding: compact ? "1rem" : "1.5rem",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="font-display text-lg font-bold" style={{ color: "#0A3B4A" }}>{settings.businessName}</h2>
          <p className="text-xs mt-1" style={{ color: "var(--receipt-muted)" }}>Thermal Receipt</p>
        </div>

        <div className="border-t border-dashed pt-3 mb-3" style={{ borderColor: "var(--receipt-divider)" }}>
          <div className="flex justify-between">
            <span style={{ color: "var(--receipt-muted)" }}>Bill No:</span>
            <span className="font-bold">{transaction.billNumber}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--receipt-muted)" }}>Date:</span>
            <span>{formatDateTime(transaction.paidAt)}</span>
          </div>
        </div>

        <div className="border-t border-dashed pt-3 mb-3" style={{ borderColor: "var(--receipt-divider)" }}>
          <div className="flex justify-between">
            <span style={{ color: "var(--receipt-muted)" }}>Customer:</span>
            <span className="font-bold">{customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--receipt-muted)" }}>Mobile:</span>
            <span>{customer.mobile}</span>
          </div>
        </div>

        <div className="border-t border-dashed pt-3 mb-3" style={{ borderColor: "var(--receipt-divider)" }}>
          <div className="flex justify-between">
            <span style={{ color: "var(--receipt-muted)" }}>Service:</span>
            <span>{transaction.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--receipt-muted)" }}>Payment:</span>
            <span>{transaction.paymentMethod}</span>
          </div>
        </div>

        <div className="border-t-2 pt-3 mt-3" style={{ borderColor: "var(--receipt-divider-strong)" }}>
          <div className="flex justify-between text-base font-bold">
            <span>TOTAL</span>
            <span style={{ color: "#0A3B4A" }}>{formatCurrency(transaction.amount)}</span>
          </div>
        </div>

        <div className="text-center mt-6 text-xs" style={{ color: "var(--receipt-muted)" }}>
          <p>{settings.billFooter}</p>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 flex justify-center">
          <PrimaryButton onClick={handlePrint} className="gap-2">
            <IoPrint size={18} />
            Print Bill
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
