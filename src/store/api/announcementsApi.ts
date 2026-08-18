import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Announcement } from "@/types";

const BASE_URL = "/api";

export const announcementsApi = createApi({
  reducerPath: "announcementsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/announcements` }),
  tagTypes: ["Announcement"],
  endpoints: (builder) => ({
    getAnnouncements: builder.query<Announcement[], void>({
      query: () => "/",
      providesTags: ["Announcement"],
    }),
    getAnnouncement: builder.query<Announcement, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Announcement", id }],
    }),
    createAnnouncement: builder.mutation<Announcement, Partial<Announcement>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Announcement"],
    }),
    updateAnnouncement: builder.mutation<Announcement, { id: string; data: Partial<Announcement> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Announcement", id }, "Announcement"],
    }),
    deleteAnnouncement: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Announcement"],
    }),
    getActiveAnnouncements: builder.query<Announcement[], void>({
      query: () => "/active",
      providesTags: ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetActiveAnnouncementsQuery,
} = announcementsApi;
