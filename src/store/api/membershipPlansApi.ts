import { createApi } from "@reduxjs/toolkit/query/react";
import type { MembershipPlan } from "@/types";
import { baseQueryFor } from "./base";

export const membershipPlansApi = createApi({
  reducerPath: "membershipPlansApi",
  baseQuery: baseQueryFor("/membership-plans"),
  tagTypes: ["MembershipPlan"],
  endpoints: (builder) => ({
    getMembershipPlans: builder.query<MembershipPlan[], void>({
      query: () => "/",
      providesTags: ["MembershipPlan"],
    }),
    getMembershipPlan: builder.query<MembershipPlan, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "MembershipPlan", id }],
    }),
    createMembershipPlan: builder.mutation<MembershipPlan, Partial<MembershipPlan>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["MembershipPlan"],
    }),
    updateMembershipPlan: builder.mutation<MembershipPlan, { id: string; data: Partial<MembershipPlan> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "MembershipPlan", id }, "MembershipPlan"],
    }),
    deleteMembershipPlan: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["MembershipPlan"],
    }),
  }),
});

export const {
  useGetMembershipPlansQuery,
  useGetMembershipPlanQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useDeleteMembershipPlanMutation,
} = membershipPlansApi;
