import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { BillingPage } from "@/pages/BillingPage";

const customers = [
  {
    id: "c1",
    name: "Alice Waters",
    mobile: "9876500001",
    firstVisitAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("BillingPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading and stepper", async () => {
    mockApi("/customers", []);
    renderWithProviders(
      <Routes>
        <Route path="/billing" element={<BillingPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/billing"] }
    );

    expect(screen.getByRole("heading", { level: 1, name: "Point of Sale & Billing" })).toBeInTheDocument();
    expect(screen.getByText("Select Customer")).toBeInTheDocument();
  });

  it("renders the customer list from the API", async () => {
    mockApi("/customers", customers);
    renderWithProviders(
      <Routes>
        <Route path="/billing" element={<BillingPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/billing"] }
    );

    expect(await screen.findByText("Alice Waters")).toBeInTheDocument();
    expect(screen.getByText("9876500001")).toBeInTheDocument();
  });

  it("shows the empty state when no customers match", async () => {
    mockApi("/customers", []);
    renderWithProviders(
      <Routes>
        <Route path="/billing" element={<BillingPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/billing"] }
    );

    expect(await screen.findByText(/No member found matching/)).toBeInTheDocument();
  });

  it("preselects a customer from the route param", async () => {
    mockApi("/customers/c7", {
      id: "c7",
      name: "Bob Smith",
      mobile: "9876599999",
      firstVisitAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    mockApi("/customers", []);
    renderWithProviders(
      <Routes>
        <Route path="/billing/:customerId" element={<BillingPage />} />
      </Routes>,
      { preloadedState: authenticatedState(), initialEntries: ["/billing/c7"] }
    );

    expect((await screen.findAllByText("Bob Smith")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Selected Member").length).toBeGreaterThan(0);
  });
});
