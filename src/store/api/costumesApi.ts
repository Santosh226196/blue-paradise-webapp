import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  Costume,
  CostumeCreatePayload,
  CostumesListResponse,
  CostumesStats,
  CostumeSummary,
  CostumeTransaction,
} from "@/types";
import { baseQueryFor } from "./base";
import type { CostumeTxnPayload } from "@/types";

export interface CostumeListArgs {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export interface CostumeTxnListArgs {
  id: string;
  type?: "SALE" | "RENT";
  status?: "COMPLETED" | "ACTIVE" | "RETURNED";
}

export { type CostumeTxnPayload };

export const costumesApi = createApi({
  reducerPath: "costumesApi",
  baseQuery: baseQueryFor("/costumes"),
  tagTypes: ["Costume", "CostumeTxn"],
  endpoints: (builder) => ({
    getCostumes: builder.query<CostumesListResponse, CostumeListArgs>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.page) params.set("page", String(args.page));
        if (args.limit) params.set("limit", String(args.limit));
        if (args.search) params.set("search", args.search);
        if (args.type) params.set("type", args.type);
        return { url: `/?${params.toString()}` };
      },
      providesTags: ["Costume"],
    }),
    getCostume: builder.query<Costume, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Costume", id }],
    }),
    getCostumesStats: builder.query<CostumesStats, void>({
      query: () => "/stats",
      providesTags: ["Costume", "CostumeTxn"],
    }),
    getCostumeSummary: builder.query<CostumeSummary, string>({
      query: (id) => `/${id}/summary`,
      providesTags: (_result, _err, id) => [
        { type: "Costume", id },
        "CostumeTxn",
      ],
    }),
    getCostumeTransactions: builder.query<
      CostumesListResponse<CostumeTransaction>,
      CostumeTxnListArgs
    >({
      query: ({ id, type, status }) => {
        const params = new URLSearchParams();
        if (type) params.set("type", type);
        if (status) params.set("status", status);
        return { url: `/${id}/transactions?${params.toString()}` };
      },
      providesTags: ["CostumeTxn"],
    }),
    createCostume: builder.mutation<Costume, CostumeCreatePayload>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Costume"],
    }),
    updateCostume: builder.mutation<
      Costume,
      { id: string; data: Partial<CostumeCreatePayload> }
    >({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Costume", id },
        "Costume",
      ],
    }),
    deleteCostume: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Costume"],
    }),
    createCostumeTransaction: builder.mutation<
      CostumeTransaction,
      { id: string; data: CostumeTxnPayload }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/transactions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Costume", id },
        "CostumeTxn",
      ],
    }),
    returnCostumeTransaction: builder.mutation<
      CostumeTransaction,
      { id: string; txnId: string }
    >({
      query: ({ id, txnId }) => ({
        url: `/${id}/transactions/${txnId}/return`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Costume", id },
        "CostumeTxn",
      ],
    }),
  }),
});

export const {
  useGetCostumesQuery,
  useGetCostumeQuery,
  useGetCostumesStatsQuery,
  useGetCostumeSummaryQuery,
  useGetCostumeTransactionsQuery,
  useCreateCostumeMutation,
  useUpdateCostumeMutation,
  useDeleteCostumeMutation,
  useCreateCostumeTransactionMutation,
  useReturnCostumeTransactionMutation,
} = costumesApi;