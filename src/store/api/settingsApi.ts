import { createApi } from "@reduxjs/toolkit/query/react";
import type { BusinessSettings } from "@/types";
import { baseQueryFor } from "./base";

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
