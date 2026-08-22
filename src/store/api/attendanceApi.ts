import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AttendanceRecord } from "@/types";

const BASE_URL = "/api";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/attendance` }),
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    getTodayAttendance: builder.query<AttendanceRecord[], void>({
      query: () => "/today",
      providesTags: ["Attendance"],
    }),
    getAttendanceByDate: builder.query<AttendanceRecord[], string>({
      query: (date) => `/${date}`,
      providesTags: ["Attendance"],
    }),
    checkIn: builder.mutation<AttendanceRecord, { customerId: string; customerName: string; visitType: string; lane?: number; photoUrl?: string }>({
      query: (body) => ({ url: "/check-in", method: "POST", body }),
      invalidatesTags: ["Attendance"],
    }),
    checkOut: builder.mutation<AttendanceRecord, string>({
      query: (id) => ({ url: `/${id}/check-out`, method: "POST" }),
      invalidatesTags: ["Attendance"],
    }),
    getCurrentlyInPool: builder.query<AttendanceRecord[], void>({
      query: () => "/active",
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetTodayAttendanceQuery,
  useGetAttendanceByDateQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useGetCurrentlyInPoolQuery,
} = attendanceApi;
