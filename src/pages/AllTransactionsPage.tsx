import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useGetTransactionsQuery } from "@/store/api/billingApi";
import { useGetCustomersQuery, useGetCustomerQuery } from "@/store/api/customersApi";
import { useCachedSettings } from "@/store/api/settingsApi";
import {
  GlassCard,
  GhostButton,
  SkeletonGlass,
  Breadcrumb,
  Input,
} from "@/components/ui";
import { InvoiceDownloader } from "@/components/InvoiceDownloader";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  IoClose,
  IoDownload,
  IoReceipt,
  IoTime,
  IoCard,
  IoCalendar,
  IoPerson,
  IoCheckmarkCircle,
  IoFunnelOutline,
  IoSearch,
  IoCashOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import type { Customer, Transaction } from "@/types";

interface TransactionDetailModalProps {
  transaction: Transaction;
  customer: Customer | undefined;
  onClose: () => void;
  onDownload: () => void;
}

function TransactionDetailModal({
  transaction,
  customer,
  onClose,
  onDownload,
}: TransactionDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const dateParts = formatDateTime(transaction.paidAt).split(", ");

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-up"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="liquid-glass relative overflow-hidden w-full max-w-md animate-scale-in">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--accent-aqua)" }} />

        <div className="p-6 space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-fg-muted cursor-pointer"
            aria-label="Close"
          >
            <IoClose size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
            >
              <IoReceipt size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-fg">Transaction Details</h3>
              <p className="text-sm font-mono mt-1 text-fg-muted">
                {transaction.billNumber}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <DetailRow icon={<IoReceipt size={16} />} label="Transaction ID" value={transaction.id} mono />
            <DetailRow icon={<IoPerson size={16} />} label="Customer" value={customer?.name ?? "Unknown"} />
            <DetailRow icon={<IoPerson size={16} />} label="Customer ID" value={transaction.customerId} mono />
            <DetailRow icon={<IoReceipt size={16} />} label="Service" value={transaction.serviceName} />
            <DetailRow icon={<IoCard size={16} />} label="Payment Method" value={transaction.paymentMethod} />
            <DetailRow icon={<IoCalendar size={16} />} label="Date" value={dateParts[0]} />
            <DetailRow icon={<IoTime size={16} />} label="Time" value={dateParts[1] || "—"} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <div className="flex items-center gap-2.5">
              <IoCheckmarkCircle size={18} className="text-accent" />
              <span className="text-sm font-bold text-fg">Amount Paid</span>
            </div>
            <span className="text-lg font-bold font-mono text-danger">
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <Link to={`/bill/${transaction.id}`} className="flex-1">
              <GhostButton fullWidth size="md">
                <IoReceipt size={16} />
                View Bill
              </GhostButton>
            </Link>
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-110 shadow-lg cursor-pointer"
              style={{ background: "var(--accent-aqua)" }}
            >
              <IoDownload size={16} />
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-fg-muted shrink-0">{icon}</span>
        <span className="text-sm text-fg-dim">{label}</span>
      </div>
      <span className={`text-sm font-bold text-fg text-right truncate ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export function AllTransactionsPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [downloadingTxn, setDownloadingTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDate, toDate]);

  const { data, isLoading, isFetching } = useGetTransactionsQuery({
    from: fromDate || undefined,
    to: toDate || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  // Clamp page if the result set shrinks below the current page (e.g. after deletions).
  useEffect(() => {
    if (data && page > data.pages) setPage(data.pages);
  }, [data, page]);

  const { data: customers } = useGetCustomersQuery({});
  const settings = useCachedSettings();

  const customerMap = useMemo(() => {
    return new Map((customers ?? []).map((c) => [c.id, c]));
  }, [customers]);

  const txns = data?.items ?? [];
  const pages = data?.pages ?? 1;

  const selectedCustomer = selectedTxn ? customerMap.get(selectedTxn.customerId) : undefined;
  const {
    data: fetchedDownloadingCustomer,
  } = useGetCustomerQuery(downloadingTxn?.customerId ?? "", {
    skip: !downloadingTxn || Boolean(downloadingTxn && customerMap.get(downloadingTxn.customerId)),
  });
  const downloadingCustomer = downloadingTxn
    ? (customerMap.get(downloadingTxn.customerId)) || fetchedDownloadingCustomer
    : undefined;

  function handleClearFilters() {
    setSearchText("");
    setFromDate("");
    setToDate("");
  }

  function goPage(next: number) {
    if (next < 1 || next > pages) return;
    setPage(next);
  }

  const hasFilters = Boolean(searchText || fromDate || toDate);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Reports", href: "/reports" },
          { label: "All Transactions" },
        ]}
      />

      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg">
            All Transactions
          </h1>
          <p className="text-xs mt-0.5 text-fg-muted">
            Complete transaction history — search by customer, mobile, or bill number
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-fg-muted">
          <div className="flex items-center gap-1.5">
            <IoFunnelOutline size={15} />
            {data?.total ?? 0} txns
          </div>
          {(data?.totalAmount ?? 0) > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{ background: "var(--glow-aqua)" }}
            >
              <IoCashOutline size={15} className="text-accent" />
              <span className="font-mono text-accent">{formatCurrency(data?.totalAmount ?? 0)}</span>
              {(fromDate || toDate) && (
                <span className="text-[10px] font-semibold text-fg-muted">
                  ({fromDate || "…"} → {toDate || "…"})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="animate-fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-1 space-y-1.5">
            <label htmlFor="customer-search" className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
              Search
            </label>
            <Input
              id="customer-search"
              placeholder="Name, mobile, or bill no."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              icon={IoSearch}
            />
          </div>

          <Input
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <Input
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <GhostButton
            size="md"
            onClick={handleClearFilters}
            disabled={!hasFilters}
            fullWidth
          >
            Clear Filters
          </GhostButton>
        </div>
      </GlassCard>

      {/* Transaction List */}
      <GlassCard>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-fg-muted">
          Transaction History
        </h3>
        {isLoading ? (
          <SkeletonGlass lines={4} />
        ) : txns.length > 0 ? (
          <>
          <div className="space-y-2">
            {txns.map((txn, i) => {
              const customer = customerMap.get(txn.customerId);
              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl transition-all duration-200 min-h-12 animate-fade-up cursor-pointer hover:brightness-110"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    animationDelay: `${Math.min(i, 10) * 0.03}s`,
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(95,217,214,0.12)",
                        color: "var(--accent-aqua)",
                      }}
                    >
                      <span className="text-xs font-bold">M</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-fg truncate">
                        {customer?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs font-mono text-fg-muted truncate">
                        {txn.billNumber} · {formatDateTime(txn.paidAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-bold font-mono text-danger">
                      {formatCurrency(txn.amount)}
                    </p>
                    <button
                      aria-label="Download invoice"
                      title="Download invoice"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDownloadingTxn(txn);
                      }}
                      className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-fg-muted cursor-pointer"
                    >
                      <IoDownload size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3">
            <GhostButton
              size="sm"
              onClick={() => goPage(page - 1)}
              disabled={page <= 1 || isFetching}
            >
              <IoChevronBack size={14} /> Prev
            </GhostButton>
            <p className="text-xs font-mono text-fg-muted">
              Page {page} of {pages} · {data?.total ?? 0} items
              {isFetching && (
                <span className="text-accent ml-1 text-[10px]">loading…</span>
              )}
            </p>
            <GhostButton
              size="sm"
              onClick={() => goPage(page + 1)}
              disabled={page >= pages || isFetching}
            >
              Next <IoChevronForward size={14} />
            </GhostButton>
          </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
            >
              <IoReceipt size={24} />
            </div>
            <p className="text-sm font-bold text-fg mb-1">No transactions found</p>
            <p className="text-xs text-fg-dim">
              {hasFilters
                ? "Try adjusting your filters to see more results."
                : "Record transactions from the Billing screen and they will appear here."}
            </p>
          </div>
        )}
      </GlassCard>

      {/* Detail Modal */}
      {selectedTxn && (
        <TransactionDetailModal
          transaction={selectedTxn}
          customer={selectedCustomer}
          onClose={() => setSelectedTxn(null)}
          onDownload={() => {
            setSelectedTxn(null);
            setDownloadingTxn(selectedTxn);
          }}
        />
      )}

      {/* Invoice Downloader */}
      {downloadingTxn && downloadingCustomer && (
        <InvoiceDownloader
          transaction={downloadingTxn}
          customer={downloadingCustomer}
          settings={settings}
          onDone={() => setDownloadingTxn(null)}
        />
      )}
    </div>
  );
}