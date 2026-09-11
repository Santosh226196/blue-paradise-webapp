import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { ReportsPage } from "@/pages/ReportsPage";

const report = {
  totalRevenue: 3000,
  totalTransactions: 2,
  byCategory: {
    MEMBERSHIP: { total: 3000, count: 2 },
  },
  dailyRevenue: [
    {
      period: "2026-08-27",
      total: 1500,
      count: 1,
      byCategory: { MEMBERSHIP: 1500 },
    },
    {
      period: "2026-08-28",
      total: 1500,
      count: 1,
      byCategory: { MEMBERSHIP: 1500 },
    },
  ],
};

const txns = [
  {
    id: "t1",
    billNumber: "BP000001",
    customerId: "c1",
    serviceType: "MEMBERSHIP",
    serviceName: "General Membership",
    amount: 1500,
    paymentMethod: "CASH",
    paidAt: "2026-08-27T04:30:00.000Z",
    createdAt: "2026-08-27T04:30:00.000Z",
  },
  {
    id: "t2",
    billNumber: "BP000002",
    customerId: "c2",
    serviceType: "MEMBERSHIP",
    serviceName: "Monthly Gold",
    amount: 1500,
    paymentMethod: "UPI",
    paidAt: "2026-08-28T04:30:00.000Z",
    createdAt: "2026-08-28T04:30:00.000Z",
  },
];

describe("ReportsPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading and period selector", () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(screen.getByRole("heading", { level: 1, name: "Reports" })).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });

  it("renders the stat cards and chart sections", async () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getAllByText("₹3,000").length).toBeGreaterThan(0);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Avg. Sale")).toBeInTheDocument();
    expect(screen.getByText("Revenue/Period")).toBeInTheDocument();
    expect(screen.getByText("Revenue Trend")).toBeInTheDocument();
    expect(screen.getByText("Revenue by Category")).toBeInTheDocument();
  });

  it("renders recent transactions and category breakdown", async () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Recent Transactions")).toBeInTheDocument();
    expect(screen.getByText("General Membership")).toBeInTheDocument();
    expect(screen.getByText("Monthly Gold")).toBeInTheDocument();
    expect(screen.getAllByText("Membership").length).toBeGreaterThan(0);
  });
});
