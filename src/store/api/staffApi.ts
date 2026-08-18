import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Staff } from "@/types";

const BASE_URL = "/api";

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/staff` }),
  tagTypes: ["Staff"],
  endpoints: (builder) => ({
    getStaff: builder.query<Staff[], { search?: string; role?: string }>({
      query: (params) => ({ url: "/", params }),
      providesTags: ["Staff"],
    }),
    getStaffMember: builder.query<Staff, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Staff", id }],
    }),
    createStaff: builder.mutation<Staff, Partial<Staff>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Staff"],
    }),
    updateStaff: builder.mutation<Staff, { id: string; data: Partial<Staff> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Staff", id }, "Staff"],
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetStaffMemberQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
