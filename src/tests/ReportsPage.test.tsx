import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { ReportsPage } from "@/pages/ReportsPage";

const report = {
  totalRevenue: 5000,
  totalTransactions: 3,
  byCategory: {
    MEMBERSHIP: { total: 3000, count: 2 },
    COSTUME: { total: 2000, count: 1 },
  },
  costume: {
    sale: { total: 1200, count: 1 },
    rent: { total: 800, count: 1 },
  },
  dailyRevenue: [
    {
      period: "2026-08-27",
      total: 2700,
      count: 2,
      byCategory: { MEMBERSHIP: 1500, COSTUME: 1200 },
    },
    {
      period: "2026-08-28",
      total: 2300,
      count: 1,
      byCategory: { MEMBERSHIP: 1500, COSTUME: 800 },
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
    expect(screen.getByText("All Time")).toBeInTheDocument();
    expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
    expect(screen.getByText("Custom Date Range")).toBeInTheDocument();
  });

  it("renders the stat cards and chart sections", async () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getAllByText("₹5,000").length).toBeGreaterThan(0);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Avg. Sale")).toBeInTheDocument();
    expect(screen.getByText("Revenue/Period")).toBeInTheDocument();
    expect(screen.getByText("Revenue Trend")).toBeInTheDocument();
    expect(screen.getByText("Revenue by Category")).toBeInTheDocument();
    expect(screen.getAllByText("Costume").length).toBeGreaterThan(0);
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

  it("shows Clear Filter when a filter is applied and resets it", () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(screen.queryByText("Clear Filter")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("This Month"));
    expect(screen.getByText("Clear Filter")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear Filter"));
    expect(screen.queryByText("Clear Filter")).not.toBeInTheDocument();
    expect(screen.getByText("All Time").style.background).toBe("var(--glow-aqua)");
  });
});
