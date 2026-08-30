import { createApi } from "@reduxjs/toolkit/query/react";
import type { MembershipBatch, BatchMembersResponse } from "@/types";
import { baseQueryFor } from "./base";

export const membershipBatchesApi = createApi({
  reducerPath: "membershipBatchesApi",
  baseQuery: baseQueryFor("/membership-batches"),
  tagTypes: ["MembershipBatch", "Membership"],
  endpoints: (builder) => ({
    getMembershipBatches: builder.query<MembershipBatch[], void>({
      query: () => "/",
      providesTags: ["MembershipBatch"],
    }),
    createMembershipBatch: builder.mutation<MembershipBatch, Partial<MembershipBatch>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["MembershipBatch"],
    }),
    updateMembershipBatch: builder.mutation<MembershipBatch, { id: string; data: Partial<MembershipBatch> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "MembershipBatch", id },
        "MembershipBatch",
      ],
    }),
    deleteMembershipBatch: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["MembershipBatch"],
    }),
    getBatchMembers: builder.query<BatchMembersResponse, string>({
      query: (id) => `/${id}/members`,
      providesTags: (_result, _err, id) => [{ type: "MembershipBatch", id }, "MembershipBatch"],
    }),
    assignMembershipToBatch: builder.mutation<{ success: boolean }, { batchId: string; membershipId: string; reason?: string }>({
      query: ({ batchId, ...body }) => ({ url: `/${batchId}/assign`, method: "POST", body }),
      invalidatesTags: (_result, _err, { batchId }) => [
        { type: "MembershipBatch", id: batchId },
        "MembershipBatch",
        "Membership",
      ],
    }),
    changeBatch: builder.mutation<{ success: boolean }, { batchId: string; membershipId: string; effectiveFrom?: string; reason?: string }>({
      query: ({ batchId, ...body }) => ({ url: `/${batchId}/change`, method: "POST", body }),
      invalidatesTags: ["MembershipBatch", "Membership"],
    }),
  }),
});

export const {
  useGetMembershipBatchesQuery,
  useCreateMembershipBatchMutation,
  useUpdateMembershipBatchMutation,
  useDeleteMembershipBatchMutation,
  useGetBatchMembersQuery,
  useAssignMembershipToBatchMutation,
  useChangeBatchMutation,
} = membershipBatchesApi;
