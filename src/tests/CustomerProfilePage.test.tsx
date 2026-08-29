import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { CustomerProfilePage } from "@/pages/CustomerProfilePage";

function ProfileRoute() {
  return (
    <Routes>
      <Route path="/customers/:id" element={<CustomerProfilePage />} />
    </Routes>
  );
}

const settings = {
  businessName: "Blue Paradise",
  billPrefix: "BP",
  billFooter: "Thank you",
  printerSettings: { connected: false },
  clubTiming: {
    openTime: "05:00",
    closeTime: "22:00",
    daysOpen: ["Monday"],
    holidaysEnabled: false,
  },
};

const customer = {
  id: "c1",
  name: "Aarav Patel",
  mobile: "9876543210",
  aadhaarNumber: "1234 5678 9012",
  age: 28,
  gender: "MALE",
  address: "12 Lotus Lane",
  firstVisitAt: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
};

describe("CustomerProfilePage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders customer name, tab navigation, and static labels from mocked data", async () => {
    mockApi("/customers/c1/visits", []);
    mockApi("/customers/c1/transactions", []);
    mockApi("/customers/c1/memberships", []);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(<ProfileRoute />, {
      preloadedState: authenticatedState(),
      initialEntries: ["/customers/c1"],
    });

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Aarav Patel");
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Photo & ID Verification")).toBeInTheDocument();
    expect(screen.getByText("Current Membership")).toBeInTheDocument();
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("Total Visits")).toBeInTheDocument();
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("Member Since")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Overview/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Visits/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Membership/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Payments/ })).toBeInTheDocument();
  });

  it("renders memberships, recent visits, and transactions when data is present", async () => {
    const user = userEvent.setup();
    mockApi("/customers/c1/visits", [
      {
        id: "v1",
        customerId: "c1",
        visitType: "WALK_IN",
        visitedAt: "2026-08-28T10:00:00.000Z",
      },
    ]);
    mockApi("/customers/c1/transactions", [
      {
        id: "t1",
        billNumber: "BP000001",
        customerId: "c1",
        serviceType: "HOURLY_SWIMMING",
        serviceName: "Hourly Swimming",
        amount: 200,
        paymentMethod: "CASH",
        paidAt: "2026-08-28T10:00:00.000Z",
        createdAt: "2026-08-28T10:00:00.000Z",
      },
    ]);
    mockApi("/customers/c1/memberships", [
      {
        id: "m1",
        customerId: "c1",
        membershipType: "MONTHLY",
        startDate: "2026-08-01T00:00:00.000Z",
        endDate: "2026-08-31T00:00:00.000Z",
        amount: 1500,
        status: "ACTIVE",
      },
    ]);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(<ProfileRoute />, {
      preloadedState: authenticatedState(),
      initialEntries: ["/customers/c1"],
    });

    expect(await screen.findByText("Active Member")).toBeInTheDocument();
    expect(screen.getByText("MONTHLY Membership")).toBeInTheDocument();
    expect(screen.getByText("WALK IN")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Membership/ }));
    expect(await screen.findByText("Amount Paid")).toBeInTheDocument();
    expect(screen.getAllByText("₹1,500").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /Payments/ }));
    expect(await screen.findByText("Hourly Swimming")).toBeInTheDocument();
    expect(screen.getByText(/BP000001/)).toBeInTheDocument();
    expect(screen.getAllByText("₹200").length).toBeGreaterThan(0);
  });

  it("renders empty states when memberships, visits, and transactions are empty", async () => {
    const user = userEvent.setup();
    mockApi("/customers/c1/visits", []);
    mockApi("/customers/c1/transactions", []);
    mockApi("/customers/c1/memberships", []);
    mockApi("/customers/c1", customer);
    mockApi("/settings", settings);

    renderWithProviders(<ProfileRoute />, {
      preloadedState: authenticatedState(),
      initialEntries: ["/customers/c1"],
    });

    expect(await screen.findByText("No active membership")).toBeInTheDocument();
    expect(screen.getByText("Activate Now")).toBeInTheDocument();
    expect(screen.getByText("No visits yet")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Payments/ }));
    expect(await screen.findByText("No payments")).toBeInTheDocument();
    expect(screen.getByText("This customer hasn't made any payments yet")).toBeInTheDocument();
  });
});