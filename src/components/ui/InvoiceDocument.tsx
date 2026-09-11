import type { Transaction, Customer, BusinessSettings } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { IoWaterOutline, IoCheckmarkCircle } from "react-icons/io5";

interface InvoiceDocumentProps {
  transaction: Transaction;
  customer: Customer;
  settings: BusinessSettings;
}

export function InvoiceDocument({
  transaction,
  customer,
  settings,
}: InvoiceDocumentProps) {
  const paid = formatDateTime(transaction.paidAt);
  const [paidDate, paidTime] =
    paid.includes(",") && paid.split(", ").length === 2
      ? paid.split(", ")
      : [paid, ""];
  const total = transaction.amount;

  return (
    <div className="w-full bg-white text-slate-900">
      {/* Accent band */}
      <div className="h-1.5 w-full bg-cyan-900" />

      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900 text-cyan-300">
                <IoWaterOutline size={22} />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight text-cyan-950 uppercase leading-tight">
                  {settings.businessName || "Blue Paradise Water Club"}
                </h1>
                <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                  Water Club &amp; Resort · Mumbai
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Plot 42, Marine Aqua Boulevard, Mumbai · Tel: +91 98765 43210
            </p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-semibold text-slate-600">
              GSTIN: 27AABCB1234M1Z5
            </span>
          </div>

          <div className="text-right">
            <h2 className="font-display text-3xl font-bold tracking-[0.2em] text-slate-800">
              INVOICE
            </h2>
            <div className="font-mono text-xs text-slate-600 mt-2 space-y-0.5">
              <p>
                Invoice No:{" "}
                <span className="font-bold text-slate-900">
                  {transaction.billNumber}
                </span>
              </p>
              <p>
                Date:{" "}
                <span className="font-semibold text-slate-800">{paidDate}</span>
              </p>
              <p>
                Time:{" "}
                <span className="font-semibold text-slate-800">{paidTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bill To + Payment */}
        <div className="mt-6 grid grid-cols-2 gap-5">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Billed To
            </h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs space-y-1">
              <p className="text-sm font-bold text-slate-900">{customer.name}</p>
              <p className="font-mono text-slate-600">Mobile: {customer.mobile}</p>
              {customer.aadhaarNumber && (
                <p className="font-mono text-slate-600">
                  Aadhaar: {customer.aadhaarNumber}
                </p>
              )}
              {customer.address && (
                <p className="text-slate-600">Address: {customer.address}</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Payment Details
            </h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-bold text-slate-900">
                  {transaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  <IoCheckmarkCircle size={12} /> Paid
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Terminal</span>
                <span className="font-semibold text-slate-800">
                  POS-01 (Admin)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <table className="mt-5 w-full text-xs">
          <thead>
            <tr className="bg-cyan-900 text-white">
              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider">
                Item / Description
              </th>
              <th className="px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                Qty
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider">
                Rate
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="px-3 py-3">
                <p className="font-bold text-slate-900">
                  {transaction.serviceName}
                </p>
                <p className="text-[10px] text-slate-500">
                  Water Club Entry / Pass
                </p>
              </td>
              <td className="px-3 py-3 text-center font-mono text-slate-700">1</td>
              <td className="px-3 py-3 text-right font-mono text-slate-700">
                {formatCurrency(total)}
              </td>
              <td className="px-3 py-3 text-right font-mono font-bold text-slate-950">
                {formatCurrency(total)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes &amp; Cess (GST)</span>
              <span className="font-semibold text-emerald-700">Included</span>
            </div>
            <div className="flex items-center justify-between border-t-2 border-slate-900 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Total Paid
              </span>
              <span className="font-mono text-xl font-bold text-cyan-950">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-4 text-center text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            {settings.billFooter || "Thank you for visiting Blue Paradise!"}
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            Invoice {transaction.billNumber} · Generated{" "}
            {formatDateTime(transaction.createdAt)}
          </p>
          <p className="text-[10px] text-slate-400">
            This is a computer generated invoice and does not require a
            signature.
          </p>
        </div>
      </div>
    </div>
  );
}