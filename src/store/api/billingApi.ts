import { createApi } from "@reduxjs/toolkit/query/react";
import type { Transaction, CreateTransactionPayload, ExpiringMembership } from "@/types";
import { baseQueryFor } from "./base";

export const billingApi = createApi({
  reducerPath: "billingApi",
  baseQuery: baseQueryFor("/billing"),
  tagTypes: ["Transaction", "Membership", "MembershipBatch"],
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], { from?: string; to?: string }>({
      query: (params) => ({ url: "/transactions", params }),
      providesTags: ["Transaction"],
    }),
    getTransaction: builder.query<Transaction, string>({
      query: (id) => `/transactions/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Transaction", id }],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionPayload>({
      query: (body) => ({ url: "/transactions", method: "POST", body }),
      invalidatesTags: ["Transaction", "Membership", "MembershipBatch"],
    }),
    getTodayTransactions: builder.query<Transaction[], void>({
      query: () => "/transactions/today",
      providesTags: ["Transaction"],
    }),
    getDashboardStats: builder.query<{
      totalCustomers: number;
      todayVisits: number;
      todayRevenue: number;
    }, void>({
      query: () => "/dashboard-stats",
    }),
    getExpiringMemberships: builder.query<ExpiringMembership[], void>({
      query: () => "/memberships/expiring",
      providesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useGetTodayTransactionsQuery,
  useGetDashboardStatsQuery,
  useGetExpiringMembershipsQuery,
} = billingApi;
