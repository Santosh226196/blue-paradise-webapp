import { toPng } from "html-to-image";
import { useEffect, useRef } from "react";
import type { Staff } from "@/types";
import { StaffIdCard } from "@/components/StaffIdCard";

interface IdCardDownloaderProps {
  staff: Staff;
  onDone: () => void;
}

export function IdCardDownloader({ staff, onDone }: IdCardDownloaderProps) {
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
        const dataUrl = await toPng(n, { pixelRatio: 3, cacheBust: true });
        if (cancelled) return;
        const link = document.createElement("a");
        link.download = `${(staff.employeeId || staff.name).replace(/[^A-Za-z0-9_-]+/g, "-").toUpperCase()}-ID.png`;
        link.href = dataUrl;
        link.click();
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
  }, [staff, onDone]);

  return (
    <div
      aria-hidden
      style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none", opacity: 0 }}
    >
      <div ref={nodeRef}>
        <StaffIdCard staff={staff} />
      </div>
    </div>
  );
}