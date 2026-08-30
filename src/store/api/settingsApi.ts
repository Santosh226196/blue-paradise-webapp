import { createApi } from "@reduxjs/toolkit/query/react";
import type { BusinessSettings } from "@/types";
import { baseQueryFor } from "./base";
import { useAppSelector } from "@/hooks/store";

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
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;

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
