import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: { username: string } | null;
  token: string | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = "bp_auth";

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null, isAuthenticated: false };
    const parsed = JSON.parse(raw) as { user?: { username: string }; token?: string };
    if (parsed.token && parsed.user) {
      return { user: parsed.user, token: parsed.token, isAuthenticated: true };
    }
    return { user: null, token: null, isAuthenticated: false };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: { payload: { user: { username: string }; token: string } }) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: action.payload.user, token: action.payload.token })
        );
      } catch {
        /* ignore storage errors */
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore storage errors */
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
