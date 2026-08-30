import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { DuePaymentsPage } from "@/pages/DuePaymentsPage";

const payments = [
  {
    id: "d1",
    customerId: "c1",
    customerName: "Alice Waters",
    customerMobile: "9876500001",
    description: "Monthly fee",
    amount: 1500,
    dueDate: "2026-09-01",
    status: "PENDING",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "d2",
    customerId: "c2",
    customerName: "Bob Smith",
    customerMobile: "9876500002",
    description: "Equipment charge",
    amount: 800,
    dueDate: "2026-08-10",
    status: "OVERDUE",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
];

const summary = { totalPending: 1500, totalOverdue: 800, count: 2 };

describe("DuePaymentsPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading", async () => {
    mockApi("/due-payments/summary", summary);
    mockApi("/due-payments", []);
    renderWithProviders(<DuePaymentsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Due Payments" })).toBeInTheDocument();
    expect(screen.getByText("Track outstanding balances")).toBeInTheDocument();
  });

  it("renders the summary and list of due payments", async () => {
    mockApi("/due-payments/summary", summary);
    mockApi("/due-payments", payments);
    renderWithProviders(<DuePaymentsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("Alice Waters")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(await screen.findByText("Total Due")).toBeInTheDocument();
  });

  it("shows the empty state when there are no due payments", async () => {
    mockApi("/due-payments/summary", { totalPending: 0, totalOverdue: 0, count: 0 });
    mockApi("/due-payments", []);
    renderWithProviders(<DuePaymentsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("No due payments")).toBeInTheDocument();
    expect(screen.getByText("All clear! No outstanding balances.")).toBeInTheDocument();
  });
});
