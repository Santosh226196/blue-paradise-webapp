import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { AttendancePage } from "@/pages/AttendancePage";

const inPool = [
  {
    id: "a1",
    customerId: "c1",
    customerName: "Alice Waters",
    checkInTime: "2026-08-29T06:15:00.000Z",
    checkOutTime: undefined,
    visitType: "MEMBERSHIP",
    lane: 2,
  },
];

const today = [
  ...inPool,
  {
    id: "a2",
    customerId: "c2",
    customerName: "Bob Smith",
    checkInTime: "2026-08-29T05:30:00.000Z",
    checkOutTime: "2026-08-29T07:00:00.000Z",
    visitType: "HOURLY",
  },
];

describe("AttendancePage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading and stats without crashing", async () => {
    mockApi("/attendance/today", today);
    mockApi("/attendance/active", inPool);
    renderWithProviders(<AttendancePage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Live Attendance" })).toBeInTheDocument();
    expect(screen.getByText("Track daily pool entries, lane allocations, and verification photos")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders the currently in pool list and today's check-outs", async () => {
    mockApi("/attendance/today", today);
    mockApi("/attendance/active", inPool);
    renderWithProviders(<AttendancePage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("Alice Waters")).toBeInTheDocument();
    expect(screen.findByText(/Currently In Pool/)).toBeTruthy();
    expect(await screen.findByText("Bob Smith")).toBeInTheDocument();
  });

  it("shows empty message and empty state when there is no attendance", async () => {
    mockApi("/attendance/today", []);
    mockApi("/attendance/active", []);
    renderWithProviders(<AttendancePage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("No one currently in the pool")).toBeInTheDocument();
    expect(await screen.findByText("No attendance today")).toBeInTheDocument();
  });
});
