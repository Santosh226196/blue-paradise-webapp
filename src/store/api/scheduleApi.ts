import { createApi } from "@reduxjs/toolkit/query/react";
import type { ScheduleSlot, DayOfWeek } from "@/types";
import { baseQueryFor } from "./base";

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: baseQueryFor("/schedule"),
  tagTypes: ["Schedule"],
  endpoints: (builder) => ({
    getSchedule: builder.query<ScheduleSlot[], { day?: DayOfWeek }>({
      query: (params) => ({ url: "/", params }),
      providesTags: ["Schedule"],
    }),
    getScheduleSlot: builder.query<ScheduleSlot, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Schedule", id }],
    }),
    createScheduleSlot: builder.mutation<ScheduleSlot, Partial<ScheduleSlot>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Schedule"],
    }),
    updateScheduleSlot: builder.mutation<ScheduleSlot, { id: string; data: Partial<ScheduleSlot> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Schedule", id }, "Schedule"],
    }),
    deleteScheduleSlot: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useGetScheduleSlotQuery,
  useCreateScheduleSlotMutation,
  useUpdateScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
} = scheduleApi;
