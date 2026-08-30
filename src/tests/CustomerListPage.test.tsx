import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { CustomerListPage } from "@/pages/CustomerListPage";

describe("CustomerListPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the static heading, search field, and filter chips", () => {
    mockApi("/customers", []);

    renderWithProviders(<CustomerListPage />, { preloadedState: authenticatedState() });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Member Directory");
    expect(screen.getByText(/Manage club members/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by member name/i)).toBeInTheDocument();
    expect(screen.getAllByText("Register Member").length).toBeGreaterThan(0);
    expect(screen.getByText("All Members")).toBeInTheDocument();
    expect(screen.getByText("Membership")).toBeInTheDocument();
    expect(screen.getByText("Coaching")).toBeInTheDocument();
    expect(screen.getByText("Hourly Pass")).toBeInTheDocument();
  });

  it("renders the customer list from the mocked endpoint", async () => {
    mockApi("/customers", [
      {
        id: "c1",
        name: "Aarav Patel",
        mobile: "9876543210",
        aadhaarNumber: "1234 5678 9012",
        firstVisitAt: "2026-08-01T00:00:00.000Z",
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
      },
      {
        id: "c2",
        name: "Meera Nair",
        mobile: "9123456780",
        idCardPhoto: "data:image/png;base64,abc",
        firstVisitAt: "2026-08-02T00:00:00.000Z",
        createdAt: "2026-08-02T00:00:00.000Z",
        updatedAt: "2026-08-02T00:00:00.000Z",
      },
    ]);

    renderWithProviders(<CustomerListPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("Aarav Patel")).toBeInTheDocument();
    expect(screen.getByText("Meera Nair")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("UID: 1234 5678 9012")).toBeInTheDocument();
    expect(screen.getByText("ID Verified")).toBeInTheDocument();
  });

  it("shows the empty state when the endpoint returns an empty array", async () => {
    mockApi("/customers", []);

    renderWithProviders(<CustomerListPage />, { preloadedState: authenticatedState() });

    expect(await screen.findByText("No members found")).toBeInTheDocument();
    expect(screen.getByText("Register your first member to get started")).toBeInTheDocument();
  });

  it("shows registered members without a plan in the New Members tab", async () => {
    mockApi("/customers/no-plan", [
      {
        id: "n1",
        name: "Rohit Verma",
        mobile: "9000011111",
        firstVisitAt: "2026-08-29T00:00:00.000Z",
        createdAt: "2026-08-29T00:00:00.000Z",
        updatedAt: "2026-08-29T00:00:00.000Z",
      },
    ]);
    mockApi("/customers", []);

    renderWithProviders(<CustomerListPage />, { preloadedState: authenticatedState() });

    fireEvent.click(screen.getByText("New Members"));

    expect(await screen.findByText("Rohit Verma")).toBeInTheDocument();
    expect(screen.getByText(/Registered members who haven't purchased/i)).toBeInTheDocument();
  });
});