import { createApi } from "@reduxjs/toolkit/query/react";
import type { Customer, Visit, Membership, Transaction, ActiveBatchForCustomer, CostumeTransaction } from "@/types";
import { baseQueryFor } from "./base";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: baseQueryFor("/customers"),
  tagTypes: ["Customer", "Visit", "Membership"],
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], { search?: string; type?: string }>({
      query: (params) => ({ url: "/", params }),
      providesTags: ["Customer"],
    }),
    getCustomersWithoutPlan: builder.query<Customer[], void>({
      query: () => "/no-plan",
      providesTags: ["Customer"],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Customer", id }],
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; data: Partial<Customer> }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Customer", id }, "Customer"],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Customer"],
    }),
    getCustomerVisits: builder.query<Visit[], string>({
      query: (customerId) => `/${customerId}/visits`,
      providesTags: ["Visit"],
    }),
    getCustomerMemberships: builder.query<Membership[], string>({
      query: (customerId) => `/${customerId}/memberships`,
      providesTags: ["Membership"],
    }),
    getCustomerBatches: builder.query<ActiveBatchForCustomer[], string>({
      query: (customerId) => `/${customerId}/batches`,
      providesTags: ["Membership"],
    }),
    getCustomerTransactions: builder.query<Transaction[], string>({
      query: (customerId) => `/${customerId}/transactions`,
      providesTags: [],
    }),
    getCustomerCostumeTransactions: builder.query<CostumeTransaction[], string>({
      query: (customerId) => `/${customerId}/costume-transactions`,
      providesTags: [],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomersWithoutPlanQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerVisitsQuery,
  useGetCustomerMembershipsQuery,
  useGetCustomerBatchesQuery,
  useGetCustomerTransactionsQuery,
  useGetCustomerCostumeTransactionsQuery,
} = customersApi;
