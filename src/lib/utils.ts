import { format, formatDistanceToNow, isToday, isValid, parseISO } from "date-fns";
import type { ServiceType } from "@/types";
import { SERVICE_AMOUNTS, SERVICE_NAMES } from "@/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function safeParse(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

export function formatDate(dateStr: string | null | undefined): string {
  const d = safeParse(dateStr);
  return d ? format(d, "dd MMM yyyy") : "—";
}

export function formatDateTime(dateStr: string | null | undefined): string {
  const d = safeParse(dateStr);
  return d ? format(d, "dd MMM yyyy, hh:mm a") : "—";
}

export function formatTime(dateStr: string | null | undefined): string {
  const d = safeParse(dateStr);
  return d ? format(d, "hh:mm a") : "—";
}

export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatRelative(dateStr: string | null | undefined): string {
  const d = safeParse(dateStr);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : "—";
}

export function isDateToday(dateStr: string | null | undefined): boolean {
  const d = safeParse(dateStr);
  return d ? isToday(d) : false;
}

export function generateId(): string {
  return (
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );
}

export function generateBillNumber(prefix: string, sequence: number): string {
  return `${prefix}${String(sequence).padStart(6, "0")}`;
}

export function getServiceName(type: ServiceType): string {
  return SERVICE_NAMES[type];
}

export function getServiceAmount(type: ServiceType): number {
  return SERVICE_AMOUNTS[type];
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

