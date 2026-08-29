import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { customersApi } from "./api/customersApi";
import { billingApi } from "./api/billingApi";
import { reportsApi } from "./api/reportsApi";
import { settingsApi } from "./api/settingsApi";
import { authApi } from "./api/authApi";
import { membershipPlansApi } from "./api/membershipPlansApi";
import { staffApi } from "./api/staffApi";
import { attendanceApi } from "./api/attendanceApi";
import { duePaymentsApi } from "./api/duePaymentsApi";
import { scheduleApi } from "./api/scheduleApi";
import { announcementsApi } from "./api/announcementsApi";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  [customersApi.reducerPath]: customersApi.reducer,
  [billingApi.reducerPath]: billingApi.reducer,
  [reportsApi.reducerPath]: reportsApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [membershipPlansApi.reducerPath]: membershipPlansApi.reducer,
  [staffApi.reducerPath]: staffApi.reducer,
  [attendanceApi.reducerPath]: attendanceApi.reducer,
  [duePaymentsApi.reducerPath]: duePaymentsApi.reducer,
  [scheduleApi.reducerPath]: scheduleApi.reducer,
  [announcementsApi.reducerPath]: announcementsApi.reducer,
});

export function makeStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        customersApi.middleware,
        billingApi.middleware,
        reportsApi.middleware,
        settingsApi.middleware,
        authApi.middleware,
        membershipPlansApi.middleware,
        staffApi.middleware,
        attendanceApi.middleware,
        duePaymentsApi.middleware,
        scheduleApi.middleware,
        announcementsApi.middleware
      ),
    preloadedState,
  });
}

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
