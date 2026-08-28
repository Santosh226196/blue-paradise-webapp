import { createApi } from "@reduxjs/toolkit/query/react";
import type { Transaction, ServiceType } from "@/types";
import { baseQueryFor } from "./base";

export interface RevenueByPeriod {
  period: string;
  total: number;
  count: number;
  byCategory: Record<ServiceType, number>;
}

export interface ReportSummary {
  totalRevenue: number;
  totalTransactions: number;
  byCategory: Record<ServiceType, { total: number; count: number }>;
  dailyRevenue: RevenueByPeriod[];
}

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: baseQueryFor("/reports"),
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    getRevenueReport: builder.query<ReportSummary, { period: string; from?: string; to?: string }>({
      query: (params) => ({ url: "/revenue", params }),
      providesTags: ["Report"],
    }),
    getTransactionList: builder.query<Transaction[], { period: string; from?: string; to?: string }>({
      query: (params) => ({ url: "/transactions", params }),
      providesTags: ["Report"],
    }),
  }),
});

export const { useGetRevenueReportQuery, useGetTransactionListQuery } = reportsApi;
