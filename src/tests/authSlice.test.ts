import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, { setCredentials, logout } from "@/store/slices/authSlice";

const STORAGE_KEY = "bp_auth";

beforeEach(() => {
  localStorage.clear();
});

describe("authSlice", () => {
  it("starts unauthenticated when no stored session", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("hydrates an authenticated session from localStorage on init", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: { username: "admin" }, token: "abc" }));
    vi.resetModules();
    const { default: freshReducer } = await import("@/store/slices/authSlice");
    const state = freshReducer(undefined, { type: "@@INIT" });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ username: "admin" });
    expect(state.token).toBe("abc");
  });

  it("ignores malformed stored data", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.isAuthenticated).toBe(false);
  });

  it("setCredentials persists the session", () => {
    const state = authReducer(undefined, setCredentials({ user: { username: "admin" }, token: "tok123" }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ username: "admin" });
    expect(state.token).toBe("tok123");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")).toEqual({
      user: { username: "admin" },
      token: "tok123",
    });
  });

  it("logout clears state and storage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: { username: "admin" }, token: "abc" }));
    let state = authReducer(undefined, { type: "@@INIT" });
    state = authReducer(state, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
