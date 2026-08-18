import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BusinessSettings } from "@/types";

const BASE_URL = "/api";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/settings` }),
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
