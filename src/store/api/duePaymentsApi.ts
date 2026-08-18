import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DuePayment } from "@/types";

const BASE_URL = "/api";

export const duePaymentsApi = createApi({
  reducerPath: "duePaymentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/due-payments` }),
  tagTypes: ["DuePayment"],
  endpoints: (builder) => ({
    getDuePayments: builder.query<DuePayment[], { status?: string }>({
      query: (params) => ({ url: "/", params }),
      providesTags: ["DuePayment"],
    }),
    getDuePayment: builder.query<DuePayment, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "DuePayment", id }],
    }),
    createDuePayment: builder.mutation<DuePayment, Partial<DuePayment>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["DuePayment"],
    }),
    markAsPaid: builder.mutation<DuePayment, string>({
      query: (id) => ({ url: `/${id}/pay`, method: "POST" }),
      invalidatesTags: ["DuePayment"],
    }),
    deleteDuePayment: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["DuePayment"],
    }),
    getDuePaymentsSummary: builder.query<{ totalPending: number; totalOverdue: number; count: number }, void>({
      query: () => "/summary",
    }),
  }),
});

export const {
  useGetDuePaymentsQuery,
  useGetDuePaymentQuery,
  useCreateDuePaymentMutation,
  useMarkAsPaidMutation,
  useDeleteDuePaymentMutation,
  useGetDuePaymentsSummaryQuery,
} = duePaymentsApi;
