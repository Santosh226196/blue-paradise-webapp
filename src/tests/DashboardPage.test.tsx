import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { DashboardPage } from "@/pages/DashboardPage";

const settings = {
  businessName: "Blue Paradise Water Club",
  billPrefix: "BP",
  billFooter: "Thank you for visiting!",
  printerSettings: { connected: false },
  clubTiming: {
    openTime: "05:00",
    closeTime: "22:00",
    daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    holidaysEnabled: false,
  },
};

describe("DashboardPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders greeting, admin username, and club timing", () => {
    mockApi("/dashboard-stats", { totalCustomers: 0, todayVisits: 0, todayRevenue: 0 });
    mockApi("/transactions/today", []);

    renderWithProviders(<DashboardPage />, { preloadedState: authenticatedState() });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/admin/i);
    expect(screen.getByText(/05:00/)).toBeInTheDocument();
    expect(screen.getByText(/22:00/)).toBeInTheDocument();
  });

  it("renders club timing from settings", async () => {
    mockApi("/settings", {
      ...settings,
      clubTiming: {
        openTime: "06:00",
        closeTime: "23:00",
        daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        holidaysEnabled: false,
      },
    });
    mockApi("/dashboard-stats", {
      totalCustomers: 0,
      todayVisits: 0,
      todayRevenue: 0,
    });
    mockApi("/transactions/today", []);

    renderWithProviders(<DashboardPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText(/06:00/)).toBeInTheDocument();
    expect(screen.getByText(/23:00/)).toBeInTheDocument();
  });

  it("renders stat cards from the fetched dashboard stats", async () => {
    mockApi("/dashboard-stats", { totalCustomers: 5, todayVisits: 3, todayRevenue: 4500 });
    mockApi("/transactions/today", []);

    renderWithProviders(<DashboardPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Total Customers")).toBeInTheDocument();
    expect(screen.getByText("Today's Visits")).toBeInTheDocument();
    expect(screen.getByText("Today's Revenue")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("₹4,500")).toBeInTheDocument();
  });

  it("shows the empty state when there are no transactions today", async () => {
    mockApi("/dashboard-stats", { totalCustomers: 0, todayVisits: 0, todayRevenue: 0 });
    mockApi("/transactions/today", []);

    renderWithProviders(<DashboardPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("No transactions today")).toBeInTheDocument();
    expect(screen.getByText("Start Billing")).toBeInTheDocument();
  });

  it("renders today's transactions when present", async () => {
    mockApi("/dashboard-stats", { totalCustomers: 0, todayVisits: 0, todayRevenue: 0 });
    mockApi("/transactions/today", [
      {
        id: "t1",
        serviceName: "General Membership",
        amount: 1500,
        paidAt: "2026-08-29T04:30:00.000Z",
        billNumber: "BP000001",
      },
    ]);
    mockApi("/memberships/expiring", []);

    renderWithProviders(<DashboardPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("General Membership")).toBeInTheDocument();
    expect(screen.getByText(/BP000001/)).toBeInTheDocument();
    expect(screen.getByText("₹1,500")).toBeInTheDocument();
  });

  it("renders expiring membership members", async () => {
    mockApi("/dashboard-stats", { totalCustomers: 0, todayVisits: 0, todayRevenue: 0 });
    mockApi("/transactions/today", []);
    mockApi("/memberships/expiring", [
      {
        customerId: "c1",
        customerName: "Rahul Sharma",
        customerMobile: "9876543210",
        membershipType: "MONTHLY",
        endDate: "2026-08-31T00:00:00.000Z",
        status: "EXPIRING_SOON",
        daysLeft: 1,
      },
      {
        customerId: "c2",
        customerName: "Priya Patel",
        customerMobile: "9123456780",
        membershipType: "YEARLY",
        endDate: "2026-07-15T00:00:00.000Z",
        status: "EXPIRED",
        daysLeft: -46,
      },
    ]);

    renderWithProviders(<DashboardPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Expiring Memberships")).toBeInTheDocument();
    expect(await screen.findByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("1 day left")).toBeInTheDocument();
    expect(screen.getByText("Priya Patel")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });
});
