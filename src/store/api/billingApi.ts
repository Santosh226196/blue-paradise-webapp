import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Transaction, ServiceType, PaymentMethod } from "@/types";

const BASE_URL = "/api";

export interface CreateTransactionPayload {
  customerId: string;
  serviceType: ServiceType;
  serviceName: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export const billingApi = createApi({
  reducerPath: "billingApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/billing` }),
  tagTypes: ["Transaction"],
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
      invalidatesTags: ["Transaction"],
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
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useGetTodayTransactionsQuery,
  useGetDashboardStatsQuery,
} = billingApi;
