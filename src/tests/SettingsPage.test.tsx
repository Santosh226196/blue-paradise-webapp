import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, authenticatedState, mockApi, resetApiMocks, type ApiRequest } from "@/tests/harness";
import { SettingsPage } from "@/pages/SettingsPage";

const settings = {
  businessName: "Blue Paradise Water Club",
  billPrefix: "BP",
  billFooter: "Thank you for visiting!",
  printerSettings: { connected: false },
  clubTiming: {
    openTime: "05:00",
    closeTime: "22:00",
    daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    holidaysEnabled: false,
  },
};

describe("SettingsPage", () => {
  beforeEach(() => {
    resetApiMocks();
  });

  it("renders the heading and subtitle", async () => {
    mockApi("/settings", settings);
    renderWithProviders(<SettingsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Manage your club preferences")).toBeInTheDocument();
  });

  it("renders the business name and club timing values from the API", async () => {
    mockApi("/settings", settings);
    renderWithProviders(<SettingsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByDisplayValue("Blue Paradise Water Club")).toBeInTheDocument();
    expect(screen.getByDisplayValue("05:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("22:00")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("saves updated club timing when Save Timing is clicked", async () => {
    let saved: any = null;
    mockApi("/settings", (req: ApiRequest) => {
      if (req.body) {
        saved = JSON.parse(String(req.body));
      }
      return settings;
    });
    renderWithProviders(<SettingsPage />, {
      preloadedState: authenticatedState(),
    });

    const openInput = await screen.findByLabelText("Opening Time");
    fireEvent.change(openInput, { target: { value: "06:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Timing" }));

    await waitFor(() => {
      expect(saved?.clubTiming?.openTime).toBe("06:00");
    });
    expect(saved?.clubTiming?.closeTime).toBe("22:00");
  });

  it("renders the printer status as connected when the printer is connected", async () => {
    mockApi("/settings", {
      ...settings,
      printerSettings: { connected: true, model: "Epson TM-30" },
    });
    renderWithProviders(<SettingsPage />, {
      preloadedState: authenticatedState(),
    });

    expect(await screen.findByText(/Connected \(Epson TM-30\)/)).toBeInTheDocument();
  });
});
