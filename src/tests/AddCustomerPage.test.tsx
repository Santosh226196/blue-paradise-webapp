import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks } from "@/tests/harness";
import { AddCustomerPage } from "@/pages/AddCustomerPage";

describe("AddCustomerPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the form heading, breadcrumb, and required fields", () => {
    renderWithProviders(<AddCustomerPage />, { preloadedState: authenticatedState() });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Register New Member");
    expect(screen.getByText("New Customer")).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aadhaar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText("Residential Address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register Customer" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddCustomerPage />, { preloadedState: authenticatedState() });

    await user.click(screen.getByRole("button", { name: "Register Customer" }));

    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid 10-digit mobile number")).toBeInTheDocument();
  });

  it("submits a valid form and shows a success toast", async () => {
    const user = userEvent.setup();
    mockApi("/customers", {
      id: "c1",
      name: "Aarav Patel",
      mobile: "9876543210",
      firstVisitAt: "2026-08-01T00:00:00.000Z",
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    });

    renderWithProviders(<AddCustomerPage />, { preloadedState: authenticatedState() });

    await user.type(screen.getByLabelText(/Full Name/i), "Aarav Patel");
    await user.type(screen.getByLabelText(/Mobile Number/i), "9876543210");
    await user.click(screen.getByRole("button", { name: "Register Customer" }));

    expect(await screen.findByText(/Aarav Patel registered successfully/i)).toBeInTheDocument();
  });
});