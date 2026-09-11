import { createApi } from "@reduxjs/toolkit/query/react";
import type { Transaction, CreateTransactionPayload, ExpiringMembership } from "@/types";
import { baseQueryFor } from "./base";

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  totalAmount?: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TransactionListArgs {
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const billingApi = createApi({
  reducerPath: "billingApi",
  baseQuery: baseQueryFor("/billing"),
  tagTypes: ["Transaction", "Membership", "MembershipBatch"],
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionListResponse, TransactionListArgs>({
      query: (params) => ({ url: "/transactions", params }),
      providesTags: ["Transaction"],
      // Accept both paginated ({ items, total, page, ... }) and legacy bare-array responses
      // so the page still renders if the deployed backend hasn't been updated yet.
      transformResponse: (res: unknown) => {
        if (Array.isArray(res)) {
          const totalAmount = res.reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);
          return { items: res, total: res.length, totalAmount, page: 1, limit: res.length, pages: 1 };
        }
        return res as TransactionListResponse;
      },
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
