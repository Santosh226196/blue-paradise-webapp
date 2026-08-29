import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const navigateMock = vi.fn();
const loginMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/hooks/store", () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({ theme: "dark", brand: "water", toggleTheme: vi.fn(), setBrand: vi.fn() }),
}));

vi.mock("@/store/api/authApi", () => ({
  useLoginMutation: () => [loginMock, { isLoading: false }],
  useForgotPasswordMutation: () => [vi.fn(), { isLoading: false }],
  useVerifyOtpMutation: () => [vi.fn(), { isLoading: false }],
  useResetPasswordMutation: () => [vi.fn(), { isLoading: false }],
}));

import { LoginPage } from "@/pages/LoginPage";

describe("LoginPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    loginMock.mockReset();
  });

  it("renders the admin login heading and fields", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /Welcome back, Admin/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Restricted access/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty required fields", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/Email \/ username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("submits credentials and navigates to the dashboard on success", async () => {
    const user = userEvent.setup();
    loginMock.mockImplementation(() => ({
      unwrap: async () => ({ token: "t", user: { username: "admin" } }),
    }));

    render(<LoginPage />);
    await user.type(screen.getByPlaceholderText(/enter your email/i), "admin");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "admin123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ username: "admin", password: "admin123" });
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error message when login fails", async () => {
    const user = userEvent.setup();
    loginMock.mockImplementation(() => ({
      unwrap: async () => {
        throw { data: { message: "Invalid credentials" } };
      },
    }));

    render(<LoginPage />);
    await user.type(screen.getByPlaceholderText(/enter your email/i), "admin");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("toggles the password visibility with the show/hide button", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const password = screen.getByPlaceholderText(/enter your password/i);
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(screen.getByPlaceholderText(/enter your password/i)).toHaveAttribute("type", "text");
  });
});
