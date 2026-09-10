import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";

export const API_BASE_URL = "https://blue-paradise-backend.onrender.com";
// VITE_API_BASE_URL="https://blue-paradise-backend.onrender.com"


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
