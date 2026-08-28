import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryFor } from "./base";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { username: string };
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordRequest {
  identity: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  demoOtp?: string;
  maskedDestination: string;
}

interface VerifyOtpRequest {
  identity: string;
  otp: string;
}

interface VerifyOtpResponse {
  success: boolean;
  resetToken: string;
}

interface ResetPasswordRequest {
  identity: string;
  newPassword: string;
  resetToken?: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryFor("/auth"),
  tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({ url: "/change-password", method: "POST", body }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({ url: "/forgot-password", method: "POST", body }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({ url: "/verify-otp", method: "POST", body }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({ url: "/reset-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
