import { useState } from "react";
import type { Transaction, Customer, BusinessSettings } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { printerService, type ReceiptData } from "@/services/printer";
import { PrimaryButton } from "./PrimaryButton";
import {
  IoPrint,
  IoCheckmarkCircle,
  IoCopyOutline,
  IoCheckmark,
  IoWaterOutline,
} from "react-icons/io5";

interface ReceiptCardProps {
  transaction: Transaction;
  customer: Customer;
  settings: BusinessSettings;
  onPrintComplete?: () => void;
  compact?: boolean;
}

export function ReceiptCard({
  transaction,
  customer,
  settings,
  onPrintComplete,
  compact,
}: ReceiptCardProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handlePrint() {
    setIsPrinting(true);
    const data: ReceiptData = { settings, transaction, customer };
    try {
      await printerService.printReceipt(data);
      // Trigger native browser print dialog for thermal / regular printer
      window.print();
      onPrintComplete?.();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPrinting(false);
    }
  }

  function handleCopyText() {
    const text = [
      `================================`,
      `  ${settings.businessName.toUpperCase()}  `,
      `   WATER CLUB & RESORT - MUMBAI   `,
      `================================`,
      `Bill No    : ${transaction.billNumber}`,
      `Date & Time: ${formatDateTime(transaction.paidAt)}`,
      `Cashier    : POS-01 (Admin)`,
      `--------------------------------`,
      `Customer   : ${customer.name}`,
      `Mobile     : ${customer.mobile}`,
      customer.aadhaarNumber ? `Aadhaar    : ${customer.aadhaarNumber}` : "",
      `--------------------------------`,
      `ITEM               QTY    AMOUNT`,
      `${transaction.serviceName.padEnd(18).slice(0, 18)} 1   ${formatCurrency(transaction.amount)}`,
      `--------------------------------`,
      `Subtotal   : ${formatCurrency(transaction.amount)}`,
      `GST / Tax  : Included`,
      `TOTAL PAID : ${formatCurrency(transaction.amount)}`,
      `Payment    : ${transaction.paymentMethod}`,
      `Status     : COMPLETED (PAID)`,
      `================================`,
      `  ${settings.billFooter}  `,
      `================================`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  }

  return (
    <div className="animate-fade-up w-full max-w-md mx-auto">
      {/* Printable Thermal Slip Container */}
      <div className="printable-thermal-receipt relative">
        <div
          className="thermal-receipt-paper relative overflow-hidden text-slate-900 border border-slate-200"
          style={{
            padding: compact ? "1.25rem 1.25rem 1rem" : "1.75rem 1.75rem 1.25rem",
            fontFeatureSettings: '"tnum"',
          }}
        >
          {/* Header */}
          <div className="text-center pb-3">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyan-900 text-cyan-300 mb-2">
              <IoWaterOutline size={20} />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-cyan-950 uppercase">
              {settings.businessName || "Blue Paradise Water Club"}
            </h2>
            <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
              Water Club Center
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Plot 42, Marine Aqua Boulevard, Mumbai · Tel: +91 98765 43210
            </p>
            <div className="inline-block mt-1.5 px-2.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-semibold text-slate-600">
              GSTIN: 27AABCB1234M1Z5
            </div>
          </div>

          {/* Dotted separator with side ticket notches */}
          <div className="relative my-3">
            <div className="receipt-notch-left -top-[7px]" />
            <div className="receipt-notch-right -top-[7px]" />
            <div className="border-t-2 border-dashed border-slate-300" />
          </div>

          {/* Receipt Meta Details */}
          <div className="font-mono text-xs space-y-1 text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">RECEIPT NO:</span>
              <span className="font-bold text-slate-900 text-sm tracking-wide">
                {transaction.billNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">DATE & TIME:</span>
              <span className="font-semibold text-slate-900">
                {formatDateTime(transaction.paidAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">TERMINAL:</span>
              <span className="text-slate-800">POS-01 (Admin)</span>
            </div>
          </div>

          {/* Dotted separator */}
          <div className="border-t border-dashed border-slate-300 my-3" />

          {/* Customer Details */}
          <div className="font-mono text-xs space-y-1 text-slate-700">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-medium">CUSTOMER:</span>
              <span className="font-bold text-slate-950 text-right max-w-[200px] truncate">
                {customer.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">MOBILE:</span>
              <span className="font-semibold text-slate-900">{customer.mobile}</span>
            </div>
            {customer.aadhaarNumber && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">ID / AADHAAR:</span>
                <span className="text-slate-700">{customer.aadhaarNumber}</span>
              </div>
            )}
          </div>

          {/* Dotted separator */}
          <div className="border-t-2 border-slate-800 my-3" />

          {/* Itemized Table Header */}
          <div className="font-mono text-[11px] font-bold text-slate-900 uppercase flex justify-between pb-1.5 border-b border-slate-300">
            <span className="flex-1">ITEM / DESCRIPTION</span>
            <span className="w-10 text-center">QTY</span>
            <span className="w-20 text-right">AMOUNT</span>
          </div>

          {/* Item Row */}
          <div className="font-mono text-xs py-2 flex justify-between items-center text-slate-900">
            <div className="flex-1 pr-2">
              <p className="font-bold text-slate-950">{transaction.serviceName}</p>
              <p className="text-[10px] text-slate-500">Water Club Entry / Pass</p>
            </div>
            <span className="w-10 text-center font-semibold text-slate-700">1</span>
            <span className="w-20 text-right font-bold text-slate-950">
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          {/* Summary Breakdown */}
          <div className="border-t border-dashed border-slate-300 pt-2.5 mt-2 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(transaction.amount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & Cess (GST):</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Included</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-t-2 border-slate-900 mt-2.5 pt-2.5 flex justify-between items-center font-mono">
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase block">
                Total Amount Paid
              </span>
              <div className="inline-flex items-center gap-1 mt-0.5">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <IoCheckmarkCircle size={12} /> PAID
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  via {transaction.paymentMethod}
                </span>
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-950">
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          {/* Barcode & Verification */}
          <div className="mt-5 pt-3 border-t border-dashed border-slate-300 text-center">
            {/* SVG Simulated Barcode */}
            <div className="flex justify-center items-center gap-[2px] h-10 px-4 py-1 bg-slate-50 rounded">
              <svg width="220" height="32" viewBox="0 0 220 32" className="max-w-full">
                <rect x="0" y="0" width="3" height="32" fill="#111827" />
                <rect x="5" y="0" width="2" height="32" fill="#111827" />
                <rect x="10" y="0" width="4" height="32" fill="#111827" />
                <rect x="17" y="0" width="1" height="32" fill="#111827" />
                <rect x="21" y="0" width="3" height="32" fill="#111827" />
                <rect x="27" y="0" width="5" height="32" fill="#111827" />
                <rect x="35" y="0" width="2" height="32" fill="#111827" />
                <rect x="40" y="0" width="3" height="32" fill="#111827" />
                <rect x="46" y="0" width="1" height="32" fill="#111827" />
                <rect x="50" y="0" width="4" height="32" fill="#111827" />
                <rect x="57" y="0" width="2" height="32" fill="#111827" />
                <rect x="62" y="0" width="5" height="32" fill="#111827" />
                <rect x="70" y="0" width="2" height="32" fill="#111827" />
                <rect x="75" y="0" width="3" height="32" fill="#111827" />
                <rect x="81" y="0" width="1" height="32" fill="#111827" />
                <rect x="85" y="0" width="4" height="32" fill="#111827" />
                <rect x="92" y="0" width="3" height="32" fill="#111827" />
                <rect x="98" y="0" width="2" height="32" fill="#111827" />
                <rect x="103" y="0" width="5" height="32" fill="#111827" />
                <rect x="111" y="0" width="1" height="32" fill="#111827" />
                <rect x="115" y="0" width="4" height="32" fill="#111827" />
                <rect x="122" y="0" width="2" height="32" fill="#111827" />
                <rect x="127" y="0" width="3" height="32" fill="#111827" />
                <rect x="133" y="0" width="5" height="32" fill="#111827" />
                <rect x="141" y="0" width="2" height="32" fill="#111827" />
                <rect x="146" y="0" width="4" height="32" fill="#111827" />
                <rect x="153" y="0" width="1" height="32" fill="#111827" />
                <rect x="157" y="0" width="3" height="32" fill="#111827" />
                <rect x="163" y="0" width="4" height="32" fill="#111827" />
                <rect x="170" y="0" width="2" height="32" fill="#111827" />
                <rect x="175" y="0" width="5" height="32" fill="#111827" />
                <rect x="183" y="0" width="3" height="32" fill="#111827" />
                <rect x="189" y="0" width="1" height="32" fill="#111827" />
                <rect x="193" y="0" width="4" height="32" fill="#111827" />
                <rect x="200" y="0" width="2" height="32" fill="#111827" />
                <rect x="205" y="0" width="5" height="32" fill="#111827" />
                <rect x="213" y="0" width="2" height="32" fill="#111827" />
                <rect x="218" y="0" width="2" height="32" fill="#111827" />
              </svg>
            </div>
            <p className="font-mono text-[10px] text-slate-500 tracking-widest mt-1">
              *{transaction.billNumber}*
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-3 pt-2 text-[11px] text-slate-600">
            <p className="font-semibold text-slate-800">
              {settings.billFooter || "Thank you for visiting Blue Paradise!"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Please present this receipt for pool gate & locker entry.
            </p>
          </div>
        </div>

        {/* Authentic Sawtooth Tear Edge at the bottom */}
        <div className="receipt-tear-bottom" />
      </div>

      {/* Action Buttons (Hidden when printing) */}
      {!compact && (
        <div className="no-print mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <PrimaryButton
            onClick={handlePrint}
            loading={isPrinting}
            size="lg"
            className="flex-1 w-full justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <IoPrint size={18} />
            Print Thermal Receipt
          </PrimaryButton>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 border border-white/15 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto"
          >
            {isCopied ? (
              <>
                <IoCheckmark size={16} className="text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <IoCopyOutline size={16} />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
