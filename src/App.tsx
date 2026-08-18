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
import { DashboardPage } from "./pages/DashboardPage";
import { CustomerListPage } from "./pages/CustomerListPage";
import { AddCustomerPage } from "./pages/AddCustomerPage";
import { CustomerProfilePage } from "./pages/CustomerProfilePage";
import { BillingPage } from "./pages/BillingPage";
import { BillPreviewPage } from "./pages/BillPreviewPage";
import { ReportsPage } from "./pages/ReportsPage";
import { TransactionDetailsPage } from "./pages/TransactionDetailsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { MembershipPlansPage } from "./pages/MembershipPlansPage";
import { StaffPage } from "./pages/StaffPage";
import { AttendancePage } from "./pages/AttendancePage";
import { DuePaymentsPage } from "./pages/DuePaymentsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";

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
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/new" element={<AddCustomerPage />} />
          <Route path="customers/:id" element={<CustomerProfilePage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="billing/:customerId" element={<BillingPage />} />
          <Route path="bill/:transactionId" element={<BillPreviewPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="transactions/:id" element={<TransactionDetailsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="membership-plans" element={<MembershipPlansPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="due-payments" element={<DuePaymentsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
        </Route>
        <Route path="*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
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
