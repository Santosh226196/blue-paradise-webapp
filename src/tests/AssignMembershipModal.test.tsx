import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { AssignMembershipModal } from "@/components/AssignMembershipModal";

const plans = [{ id: "p1", name: "Monthly Gold", description: "", duration: "MONTHLY", price: 3000, features: [], isActive: true, createdAt: "2026-01-01" }];

const mkBatch = (id: string, name: string, status: string) => ({
  id,
  name,
  description: "",
  planId: null,
  startDate: null,
  endDate: null,
  days: ["Monday"],
  startTime: "07:00",
  endTime: "08:00",
  level: "BEGINNER",
  ageGroup: "ALL",
  coachId: null,
  coach: "",
  maxMembers: 10,
  currentMembers: 0,
  status,
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("AssignMembershipModal batch list", () => {
  beforeEach(() => resetApiMocks());

  it("shows active and upcoming batches, but not completed", async () => {
    mockApi("/membership-plans", plans);
    mockApi("/membership-batches", [
      mkBatch("b1", "Active Morning", "ACTIVE"),
      mkBatch("b2", "Upcoming Evening", "UPCOMING"),
      mkBatch("b3", "Done Batch", "COMPLETED"),
    ]);
    mockApi("/settings", {});

    renderWithProviders(
      <AssignMembershipModal
        customerId="c1"
        customerName="Rahul"
        isOpen
        onClose={() => {}}
      />,
      { preloadedState: authenticatedState() },
    );

    fireEvent.click(await screen.findByText("Monthly Gold"));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Active Morning")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Evening")).toBeInTheDocument();
    expect(screen.queryByText("Done Batch")).not.toBeInTheDocument();
  });
});