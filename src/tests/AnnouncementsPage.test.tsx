import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { AnnouncementsPage } from "@/pages/AnnouncementsPage";

const announcements = [
  {
    id: "an1",
    title: "Pool Maintenance Notice",
    message: "The pool will be closed on Sunday for maintenance.",
    priority: "HIGH",
    isActive: true,
    createdAt: "2026-08-20T00:00:00.000Z",
  },
  {
    id: "an2",
    title: "New Timings",
    message: "Updated timings are now in effect.",
    priority: "MEDIUM",
    isActive: false,
    createdAt: "2026-08-15T00:00:00.000Z",
  },
];

describe("AnnouncementsPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading", async () => {
    mockApi("/announcements", []);
    renderWithProviders(<AnnouncementsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Announcements" })).toBeInTheDocument();
    expect(screen.getByText("Club-wide notices and updates")).toBeInTheDocument();
  });

  it("renders the list of announcements from the API", async () => {
    mockApi("/announcements", announcements);
    renderWithProviders(<AnnouncementsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("Pool Maintenance Notice")).toBeInTheDocument();
    expect(screen.getByText("New Timings")).toBeInTheDocument();
    expect(screen.getByText("The pool will be closed on Sunday for maintenance.")).toBeInTheDocument();
  });

  it("shows the empty state when there are no announcements", async () => {
    mockApi("/announcements", []);
    renderWithProviders(<AnnouncementsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("No announcements")).toBeInTheDocument();
    expect(screen.getByText("Post your first announcement to notify club members")).toBeInTheDocument();
  });
});
