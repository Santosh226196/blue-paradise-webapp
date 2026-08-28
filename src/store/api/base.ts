import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string) || "/api").replace(/\/+$/, "");

export function baseQueryFor(resource: string) {
  return fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api${resource}`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      headers.set("ngrok-skip-browser-warning", "true");
      const token = (getState() as RootState).auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  });
}
