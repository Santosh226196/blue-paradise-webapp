import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { BillPreviewPage } from "@/pages/BillPreviewPage";

const transaction = {
  id: "t1",
  billNumber: "BP000001",
  customerId: "c1",
  serviceType: "HOURLY_SWIMMING",
  serviceName: "Hourly Swimming",
  amount: 200,
  paymentMethod: "CASH",
  paidAt: "2026-08-29T04:30:00.000Z",
  createdAt: "2026-08-29T04:30:00.000Z",
};

const customer = {
  id: "c1",
  name: "Alice Waters",
  mobile: "9876500001",
  aadhaarNumber: "1234",
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

describe("BillPreviewPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the payment success heading and bill number", async () => {
    mockApi("/transactions/t1", transaction);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(
      <Routes>
        <Route path="/bill/:transactionId" element={<BillPreviewPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/bill/t1"] }
    );

    expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
    expect(screen.getByText("Bill #BP000001")).toBeInTheDocument();
  });

  it("renders the customer name and settings business name", async () => {
    mockApi("/transactions/t1", transaction);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(
      <Routes>
        <Route path="/bill/:transactionId" element={<BillPreviewPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/bill/t1"] }
    );

    expect(await screen.findByText("Thank you,", { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText("Alice Waters").length).toBeGreaterThan(0);
    expect(await screen.findByText("Blue Paradise Water Club")).toBeInTheDocument();
  });

  it("shows the not-found state when the transaction is missing", async () => {
    mockApi("/transactions/t1", () => undefined);
    renderWithProviders(
      <Routes>
        <Route path="/bill/:transactionId" element={<BillPreviewPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/bill/t1"] }
    );

    expect(await screen.findByText("Transaction not found")).toBeInTheDocument();
  });
});
