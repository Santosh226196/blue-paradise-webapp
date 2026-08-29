import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  generateBillNumber,
  getServiceName,
  getServiceAmount,
} from "@/lib/utils";
import { ServiceType } from "@/types";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", false, null, undefined, "c")).toBe("a b c");
  });

  it("returns empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats as INR with no decimals", () => {
    expect(formatCurrency(1500)).toBe("₹1,500");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("₹0");
  });

  it("handles amounts with a paise component (rounds)", () => {
    expect(formatCurrency(1234.99)).toBe("₹1,235");
  });
});

describe("generateBillNumber", () => {
  it("pads the sequence to 6 digits with the prefix", () => {
    expect(generateBillNumber("BP", 1)).toBe("BP000001");
    expect(generateBillNumber("BP", 12345)).toBe("BP012345");
  });

  it("handles large sequence numbers", () => {
    expect(generateBillNumber("BP", 123456)).toBe("BP123456");
  });
});

describe("service helpers", () => {
  it("maps a service type to its display name", () => {
    expect(getServiceName(ServiceType.Membership)).toBe("General Membership");
    expect(getServiceName(ServiceType.Coaching)).toBe("Coaching");
    expect(getServiceName(ServiceType.HourlySwimming)).toBe("Hourly Swimming");
  });

  it("maps a service type to its amount", () => {
    expect(getServiceAmount(ServiceType.Membership)).toBe(1500);
    expect(getServiceAmount(ServiceType.Coaching)).toBe(2000);
    expect(getServiceAmount(ServiceType.HourlySwimming)).toBe(200);
  });
});
