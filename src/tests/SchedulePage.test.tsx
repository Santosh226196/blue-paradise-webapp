import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { SchedulePage } from "@/pages/SchedulePage";

const slots = [
  {
    id: "sl1",
    day: "Monday",
    startTime: "06:00",
    endTime: "07:00",
    type: "LANE",
    label: "Morning Lap Swim",
    lane: 1,
    maxCapacity: 8,
    currentBookings: 3,
  },
  {
    id: "sl2",
    day: "Monday",
    startTime: "07:00",
    endTime: "08:00",
    type: "COACHING",
    label: "Beginner Class",
    coachId: "s1",
    maxCapacity: 6,
    currentBookings: 2,
  },
  {
    id: "sl3",
    day: "Tuesday",
    startTime: "18:00",
    endTime: "20:00",
    type: "OPEN_SWIM",
    label: "Open Swim",
    maxCapacity: 20,
    currentBookings: 0,
  },
];

describe("SchedulePage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading", async () => {
    mockApi("/schedule", []);
    mockApi("/staff", []);
    renderWithProviders(<SchedulePage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Schedule" })).toBeInTheDocument();
    expect(screen.getByText("Weekly pool timetable & sessions")).toBeInTheDocument();
  });

  it("renders the schedule slots from the API without crashing", async () => {
    mockApi("/schedule", slots);
    mockApi("/staff", []);
    renderWithProviders(<SchedulePage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("Morning Lap Swim")).toBeInTheDocument();
    expect(await screen.findByText("Beginner Class")).toBeInTheDocument();
    expect(screen.getAllByText("Open Swim").length).toBeGreaterThan(0);
  });

  it("shows the empty state when no slots are scheduled", async () => {
    mockApi("/schedule", []);
    mockApi("/staff", []);
    renderWithProviders(<SchedulePage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText("No slots scheduled")).toBeInTheDocument();
    expect(screen.getByText("Add time slots to build your weekly timetable")).toBeInTheDocument();
  });
});
