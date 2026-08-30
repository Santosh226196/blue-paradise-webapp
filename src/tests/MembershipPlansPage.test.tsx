import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { MembershipPlansPage } from "@/pages/MembershipPlansPage";

const plans = [
  {
    id: "p1",
    name: "Premium Monthly",
    description: "Full access for one month",
    duration: "MONTHLY",
    price: 1500,
    features: ["Pool access", "Locker"],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "p2",
    name: "Yearly Gold",
    description: "Best value plan",
    duration: "YEARLY",
    price: 12000,
    features: [],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("MembershipPlansPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading", async () => {
    mockApi("/membership-plans", []);
    renderWithProviders(<MembershipPlansPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Membership Plans" })).toBeInTheDocument();
    expect(screen.getByText("Configure plans and batches")).toBeInTheDocument();
  });

  it("renders the list of membership plans from the API", async () => {
    mockApi("/membership-plans", plans);
    renderWithProviders(<MembershipPlansPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("Premium Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly Gold")).toBeInTheDocument();
    expect(screen.getByText("Full access for one month")).toBeInTheDocument();
  });

  it("shows the empty state when there are no plans", async () => {
    mockApi("/membership-plans", []);
    renderWithProviders(<MembershipPlansPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("No membership plans")).toBeInTheDocument();
    expect(screen.getByText("Create your first membership plan to get started")).toBeInTheDocument();
  });
});
