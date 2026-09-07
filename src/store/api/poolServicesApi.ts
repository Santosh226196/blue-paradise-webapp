import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  PoolService,
  PoolServiceCreatePayload,
} from "@/types";
import { baseQueryFor } from "./base";

export const poolServicesApi = createApi({
  reducerPath: "poolServicesApi",
  baseQuery: baseQueryFor("/pool-services"),
  tagTypes: ["PoolService"],
  endpoints: (builder) => ({
    getPoolServices: builder.query<PoolService[], void>({
      query: () => "/",
      providesTags: ["PoolService"],
    }),
    getPoolService: builder.query<PoolService, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _err, id) => [{ type: "PoolService", id }],
    }),
    createPoolService: builder.mutation<
      PoolService,
      PoolServiceCreatePayload
    >({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["PoolService"],
    }),
    updatePoolService: builder.mutation<
      PoolService,
      { id: string; data: Partial<PoolServiceCreatePayload> }
    >({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "PoolService", id },
        "PoolService",
      ],
    }),
    deletePoolService: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["PoolService"],
    }),
  }),
});

export const {
  useGetPoolServicesQuery,
  useGetPoolServiceQuery,
  useCreatePoolServiceMutation,
  useUpdatePoolServiceMutation,
  useDeletePoolServiceMutation,
} = poolServicesApi;
