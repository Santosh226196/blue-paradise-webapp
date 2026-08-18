import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
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

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM yyyy");
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM yyyy, hh:mm a");
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), "hh:mm a");
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function isDateToday(dateStr: string): boolean {
  return isToday(parseISO(dateStr));
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
