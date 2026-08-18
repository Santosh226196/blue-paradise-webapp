import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Customer, Visit, Membership, Coaching, Transaction, BusinessSettings } from "@/types";

const BASE_URL = "/api";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/customers` }),
  tagTypes: ["Customer", "Visit", "Membership", "Coaching"],
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], { search?: string; type?: string }>({
      query: (params) => ({ url: "/", params }),
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
    getCustomerCoaching: builder.query<Coaching[], string>({
      query: (customerId) => `/${customerId}/coaching`,
      providesTags: ["Coaching"],
    }),
    getCustomerTransactions: builder.query<Transaction[], string>({
      query: (customerId) => `/${customerId}/transactions`,
      providesTags: [],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerVisitsQuery,
  useGetCustomerMembershipsQuery,
  useGetCustomerCoachingQuery,
  useGetCustomerTransactionsQuery,
} = customersApi;
