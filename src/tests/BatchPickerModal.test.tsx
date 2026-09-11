import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { BatchPickerModal } from "@/components/BatchPickerModal";

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
  maxMembers: 10,
  currentMembers: 0,
  status,
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("BatchPickerModal", () => {
  beforeEach(() => resetApiMocks());

  it("Change mode shows only active batches plus the current one, pre-selected", async () => {
    mockApi("/membership-batches", [
      mkBatch("b1", "Active Morning", "ACTIVE"),
      mkBatch("b2", "Upcoming Evening", "UPCOMING"),
      mkBatch("b3", "Done Batch", "COMPLETED"),
      mkBatch("b4", "Future Batch", "UPCOMING"),
    ]);

    renderWithProviders(
      <BatchPickerModal
        membershipId="m1"
        membershipType="Monthly Gold"
        currentBatchId="b2"
        customerName="Anurag Kumar Singh"
        isOpen
        onClose={() => {}}
      />,
      { preloadedState: authenticatedState() },
    );

    const confirm = await screen.findByRole("button", { name: "Already in This Batch" });
    expect(confirm).toBeDisabled();

    expect(await screen.findByText("Active Morning")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Evening")).toBeInTheDocument();
    expect(screen.queryByText("Done Batch")).not.toBeInTheDocument();
    expect(screen.queryByText("Future Batch")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Active Morning"));

    const confirmChange = screen.getByRole("button", { name: "Confirm Change" });
    expect(confirmChange).toBeEnabled();
  });

  it("Assign mode lists only active and upcoming batches", async () => {
    mockApi("/membership-batches", [
      mkBatch("b1", "Active Morning", "ACTIVE"),
      mkBatch("b2", "Upcoming Evening", "UPCOMING"),
      mkBatch("b3", "Done Batch", "COMPLETED"),
    ]);

    renderWithProviders(
      <BatchPickerModal
        membershipId="m1"
        membershipType="Monthly Gold"
        customerName="Rahul"
        isOpen
        onClose={() => {}}
      />,
      { preloadedState: authenticatedState() },
    );

    expect(await screen.findByText("Active Morning")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Evening")).toBeInTheDocument();
    expect(screen.queryByText("Done Batch")).not.toBeInTheDocument();

    const confirm = screen.getByRole("button", { name: "Confirm Assign" });
    expect(confirm).toBeDisabled();

    fireEvent.click(screen.getByText("Upcoming Evening"));
    expect(confirm).toBeEnabled();
  });
});