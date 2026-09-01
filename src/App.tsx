import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./hooks/useTheme";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { ToastProvider } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout";
import { OfflinePage } from "./pages/OfflinePage";
import { LoginPage } from "./pages/LoginPage";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const CustomerListPage = lazy(() => import("./pages/CustomerListPage").then(m => ({ default: m.CustomerListPage })));
const AddCustomerPage = lazy(() => import("./pages/AddCustomerPage").then(m => ({ default: m.AddCustomerPage })));
const CustomerProfilePage = lazy(() => import("./pages/CustomerProfilePage").then(m => ({ default: m.CustomerProfilePage })));
const BillingPage = lazy(() => import("./pages/BillingPage").then(m => ({ default: m.BillingPage })));
const BillPreviewPage = lazy(() => import("./pages/BillPreviewPage").then(m => ({ default: m.BillPreviewPage })));
const ReportsPage = lazy(() => import("./pages/ReportsPage").then(m => ({ default: m.ReportsPage })));
const TransactionDetailsPage = lazy(() => import("./pages/TransactionDetailsPage").then(m => ({ default: m.TransactionDetailsPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const MembershipPlansPage = lazy(() => import("./pages/MembershipPlansPage").then(m => ({ default: m.MembershipPlansPage })));
const StaffPage = lazy(() => import("./pages/StaffPage").then(m => ({ default: m.StaffPage })));
const AttendancePage = lazy(() => import("./pages/AttendancePage").then(m => ({ default: m.AttendancePage })));
const DuePaymentsPage = lazy(() => import("./pages/DuePaymentsPage").then(m => ({ default: m.DuePaymentsPage })));
const SchedulePage = lazy(() => import("./pages/SchedulePage").then(m => ({ default: m.SchedulePage })));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage").then(m => ({ default: m.AnnouncementsPage })));
const ScannerDisplayPage = lazy(() => import("./pages/ScannerDisplayPage").then(m => ({ default: m.ScannerDisplayPage })));

function RouteSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const isOnline = useOnlineStatus();

  if (!isOnline) return <OfflinePage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Suspense fallback={<RouteSpinner />}><DashboardPage /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<RouteSpinner />}><CustomerListPage /></Suspense>} />
          <Route path="customers/new" element={<Suspense fallback={<RouteSpinner />}><AddCustomerPage /></Suspense>} />
          <Route path="customers/:id" element={<Suspense fallback={<RouteSpinner />}><CustomerProfilePage /></Suspense>} />
          <Route path="billing" element={<Suspense fallback={<RouteSpinner />}><BillingPage /></Suspense>} />
          <Route path="billing/:customerId" element={<Suspense fallback={<RouteSpinner />}><BillingPage /></Suspense>} />
          <Route path="bill/:transactionId" element={<Suspense fallback={<RouteSpinner />}><BillPreviewPage /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<RouteSpinner />}><ReportsPage /></Suspense>} />
          <Route path="transactions/:id" element={<Suspense fallback={<RouteSpinner />}><TransactionDetailsPage /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<RouteSpinner />}><SettingsPage /></Suspense>} />
          <Route path="membership-plans" element={<Suspense fallback={<RouteSpinner />}><MembershipPlansPage /></Suspense>} />
          <Route path="staff" element={<Suspense fallback={<RouteSpinner />}><StaffPage /></Suspense>} />
          <Route path="attendance" element={<Suspense fallback={<RouteSpinner />}><AttendancePage /></Suspense>} />
          <Route path="due-payments" element={<Suspense fallback={<RouteSpinner />}><DuePaymentsPage /></Suspense>} />
          <Route path="schedule" element={<Suspense fallback={<RouteSpinner />}><SchedulePage /></Suspense>} />
          <Route path="announcements" element={<Suspense fallback={<RouteSpinner />}><AnnouncementsPage /></Suspense>} />
        </Route>
        <Route path="scanner" element={<Suspense fallback={<RouteSpinner />}><ScannerDisplayPage /></Suspense>} />
        <Route path="*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Suspense fallback={<RouteSpinner />}><DashboardPage /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
