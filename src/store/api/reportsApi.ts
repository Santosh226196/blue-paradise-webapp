import { createApi } from "@reduxjs/toolkit/query/react";
import type { Transaction, ReportSummary } from "@/types";
import { baseQueryFor } from "./base";

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
