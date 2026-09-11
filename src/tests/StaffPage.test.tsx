import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { StaffPage } from "@/pages/StaffPage";

const staff = [
  {
    id: "s1",
    name: "Ravi Kumar",
    mobile: "9876500001",
    role: "MANAGER",
    specialization: "Freestyle",
    isAvailable: true,
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "s2",
    name: "Meera Nair",
    mobile: "9876500002",
    role: "LIFEGUARD",
    isAvailable: false,
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("StaffPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading", async () => {
    mockApi("/staff", []);
    renderWithProviders(<StaffPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Staff" })).toBeInTheDocument();
    expect(screen.getByText("Manage team members and staff")).toBeInTheDocument();
  });

  it("renders the list of staff from the API", async () => {
    mockApi("/staff", staff);
    renderWithProviders(<StaffPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("Ravi Kumar")).toBeInTheDocument();
    expect(screen.getByText("Meera Nair")).toBeInTheDocument();
    expect(screen.getAllByText("Manager").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lifeguard").length).toBeGreaterThan(0);
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Off Duty")).toBeInTheDocument();
  });

  it("shows the empty state when there are no staff members", async () => {
    mockApi("/staff", []);
    renderWithProviders(<StaffPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("No staff members")).toBeInTheDocument();
    expect(screen.getByText("Add your first staff member to get started")).toBeInTheDocument();
  });

  it("renders staff profile photo when photoUrl is present", async () => {
    const staffWithPhoto = [
      {
        id: "s1",
        name: "Ravi Kumar",
        mobile: "9876500001",
        role: "LIFEGUARD",
        specialization: "Freestyle",
        isAvailable: true,
        photoUrl: "https://example.com/ravi.jpg",
        joinedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    mockApi("/staff", staffWithPhoto);
    renderWithProviders(<StaffPage />, {
      preloadedState: authenticatedState(),
    });

    const img = await screen.findByAltText("Ravi Kumar");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/ravi.jpg");
  });
});
