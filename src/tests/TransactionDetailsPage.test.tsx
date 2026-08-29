import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { TransactionDetailsPage } from "@/pages/TransactionDetailsPage";

const transaction = {
  id: "t1",
  billNumber: "BP000005",
  customerId: "c1",
  serviceType: "MEMBERSHIP",
  serviceName: "General Membership",
  amount: 1500,
  paymentMethod: "UPI",
  paidAt: "2026-08-29T04:30:00.000Z",
  createdAt: "2026-08-29T04:30:00.000Z",
};

const customer = {
  id: "c1",
  name: "Alice Waters",
  mobile: "9876500001",
  firstVisitAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const settings = {
  businessName: "Blue Paradise Water Club",
  billPrefix: "BP",
  billFooter: "Thank you for visiting!",
  printerSettings: { connected: false },
  clubTiming: {
    openTime: "05:00",
    closeTime: "22:00",
    daysOpen: ["Monday"],
    holidaysEnabled: false,
  },
};

describe("TransactionDetailsPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the success banner and bill number", async () => {
    mockApi("/transactions/t1", transaction);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(
      <Routes>
        <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/transactions/t1"] }
    );

    expect(await screen.findByText("Payment Successful")).toBeInTheDocument();
    expect(screen.getAllByText("BP000005").length).toBeGreaterThan(0);
  });

  it("renders the amount and detail rows", async () => {
    mockApi("/transactions/t1", transaction);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(
      <Routes>
        <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/transactions/t1"] }
    );

    expect(await screen.findByText("Amount Paid")).toBeInTheDocument();
    expect(screen.getAllByText("₹1,500").length).toBeGreaterThan(0);
    expect(screen.getAllByText("General Membership").length).toBeGreaterThan(0);
    expect(screen.getByText("UPI")).toBeInTheDocument();
  });

  it("shows the not-found state when the transaction is missing", async () => {
    mockApi("/transactions/t1", () => undefined);
    renderWithProviders(
      <Routes>
        <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/transactions/t1"] }
    );

    expect(await screen.findByText("Transaction not found")).toBeInTheDocument();
  });
});
