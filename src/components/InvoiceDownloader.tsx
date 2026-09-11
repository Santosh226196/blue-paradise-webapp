import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useEffect, useRef } from "react";
import type { Transaction, Customer, BusinessSettings } from "@/types";
import { InvoiceDocument } from "@/components/ui/InvoiceDocument";

interface InvoiceDownloaderProps {
  transaction: Transaction;
  customer: Customer;
  settings: BusinessSettings;
  onDone: () => void;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export function InvoiceDownloader({
  transaction,
  customer,
  settings,
  onDone,
}: InvoiceDownloaderProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const node = nodeRef.current;
    if (!node) return;

    async function run(n: HTMLDivElement) {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
        const images = Array.from(n.querySelectorAll("img"));
        await Promise.all(
          images.map((img) =>
            img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, 320));
        const dataUrl = await toPng(n, { pixelRatio: 2, cacheBust: true });
        if (cancelled) return;

        const doc = new jsPDF({
          unit: "mm",
          format: [A4_WIDTH_MM, A4_HEIGHT_MM],
        });
        doc.addImage(dataUrl, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
        const safeBill = transaction.billNumber.replace(/[^A-Za-z0-9_-]+/g, "-");
        doc.save(`INV-${safeBill}.pdf`);
      } catch {
        // ignore export errors
      } finally {
        if (!cancelled) onDone();
      }
    }

    void run(node);
    return () => {
      cancelled = true;
    };
  }, [transaction, customer, settings, onDone]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: -99999,
        top: 0,
        width: `${A4_WIDTH_MM}mm`,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <div
        ref={nodeRef}
        style={{
          width: `${A4_WIDTH_MM}mm`,
          minHeight: `${A4_HEIGHT_MM}mm`,
          background: "#ffffff",
          padding: "12mm 14mm",
          boxSizing: "border-box",
        }}
      >
        <InvoiceDocument
          transaction={transaction}
          customer={customer}
          settings={settings}
        />
      </div>
    </div>
  );
}