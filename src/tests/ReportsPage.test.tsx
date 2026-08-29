import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { ReportsPage } from "@/pages/ReportsPage";

const report = {
  totalRevenue: 3700,
  totalTransactions: 3,
  byCategory: {
    MEMBERSHIP: { total: 1500, count: 1 },
    COACHING: { total: 2000, count: 1 },
    HOURLY_SWIMMING: { total: 200, count: 1 },
  },
  dailyRevenue: [
    {
      period: "2026-08-27",
      total: 1500,
      count: 1,
      byCategory: { MEMBERSHIP: 1500, COACHING: 0, HOURLY_SWIMMING: 0 },
    },
    {
      period: "2026-08-28",
      total: 2000,
      count: 1,
      byCategory: { MEMBERSHIP: 0, COACHING: 2000, HOURLY_SWIMMING: 0 },
    },
    {
      period: "2026-08-29",
      total: 200,
      count: 1,
      byCategory: { MEMBERSHIP: 0, COACHING: 0, HOURLY_SWIMMING: 200 },
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
    serviceType: "COACHING",
    serviceName: "Coaching",
    amount: 2000,
    paymentMethod: "UPI",
    paidAt: "2026-08-28T04:30:00.000Z",
    createdAt: "2026-08-28T04:30:00.000Z",
  },
  {
    id: "t3",
    billNumber: "BP000003",
    customerId: "c3",
    serviceType: "HOURLY_SWIMMING",
    serviceName: "Hourly Swimming",
    amount: 200,
    paymentMethod: "CARD",
    paidAt: "2026-08-29T04:30:00.000Z",
    createdAt: "2026-08-29T04:30:00.000Z",
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
    expect(screen.getByText("Hourly")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });

  it("renders the stat cards and chart sections", async () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("₹3,700")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Avg. Sale")).toBeInTheDocument();
    expect(screen.getByText("Revenue/Day")).toBeInTheDocument();
    expect(screen.getByText("Revenue Trend")).toBeInTheDocument();
    expect(screen.getByText("Revenue by Category")).toBeInTheDocument();
  });

  it("renders recent transactions and category breakdown", async () => {
    mockApi("/reports/revenue", report);
    mockApi("/reports/transactions", txns);

    renderWithProviders(<ReportsPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Recent Transactions")).toBeInTheDocument();
    expect(screen.getByText("General Membership")).toBeInTheDocument();
    expect(screen.getAllByText("Coaching").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hourly Swimming").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Membership").length).toBeGreaterThan(0);
  });
});
