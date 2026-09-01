import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BusinessSettings } from "@/types";
import { baseQueryFor } from "./base";
import { useAppSelector } from "@/hooks/store";
import type { RootState } from "@/store";

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string) || "").replace(/\/+$/, "");

const publicBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api/public/settings`,
  prepareHeaders: (headers, { getState }) => {
    headers.set("ngrok-skip-browser-warning", "true");
    const token = (getState() as RootState).auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: baseQueryFor("/settings"),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<BusinessSettings, void>({
      query: () => "/",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<BusinessSettings, Partial<BusinessSettings>>({
      query: (body) => ({ url: "/", method: "PUT", body }),
      invalidatesTags: ["Settings"],
    }),
    uploadScanner: builder.mutation<{ success: boolean; scannerImage: string }, { scannerImage: string }>({
      query: (body) => ({ url: "/scanner", method: "POST", body }),
      invalidatesTags: ["Settings"],
    }),
    deleteScanner: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/scanner", method: "DELETE" }),
      invalidatesTags: ["Settings"],
    }),
    getPublicScanner: builder.query<{ scannerImage: string; businessName: string }, void>({
      query: () => ({ url: "/scanner", method: "GET" }),
      baseQuery: publicBaseQuery,
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation, useUploadScannerMutation, useDeleteScannerMutation, useGetPublicScannerQuery } = settingsApi;

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: "Blue Paradise Water Club",
  printerSettings: { connected: false },
  billPrefix: "BP",
  billFooter: "Thank you for visiting Blue Paradise!",
  clubTiming: {
    openTime: "05:00",
    closeTime: "23:00",
    daysOpen: [],
    holidaysEnabled: false,
  },
};

const settingsSelector = settingsApi.endpoints.getSettings.select();

export function useCachedSettings(): BusinessSettings {
  const cached = useAppSelector(settingsSelector);
  return cached?.data ?? DEFAULT_SETTINGS;
}
