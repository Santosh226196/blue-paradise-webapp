import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUploadScannerMutation,
  useDeleteScannerMutation,
} from "@/store/api/settingsApi";
import {
  useChangePasswordMutation,
  useLogoutMutation,
} from "@/store/api/authApi";
import { useAppDispatch } from "@/hooks/store";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useTheme } from "@/hooks/useTheme";
import {
  GlassCard,
  PrimaryButton,
  GhostButton,
  SkeletonGlass,
  Input,
  PasswordInput,
} from "@/components/ui";
import { printerService } from "@/services/printer";
import {
  IoBusiness,
  IoPrint,
  IoLockClosed,
  IoLogOut,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSunny,
  IoMoon,
  IoTime,
  IoSettings,
  IoCamera,
  IoTrash,
  IoQrCode,
} from "react-icons/io5";

export function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();
  const [logout] = useLogoutMutation();

  const [businessName, setBusinessName] = useState("");
  const [billPrefix, setBillPrefix] = useState("");
  const [billFooter, setBillFooter] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [testPrintResult, setTestPrintResult] = useState<
    "success" | "error" | null
  >(null);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [uploadScanner] = useUploadScannerMutation();
  const [deleteScanner] = useDeleteScannerMutation();
  const [scannerUploading, setScannerUploading] = useState(false);
  const scannerInputRef = useRef<HTMLInputElement>(null);

  if (isLoading && !settings)
    return (
      <div className="space-y-4">
        <SkeletonGlass lines={4} />
      </div>
    );
  if (isError && !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-fg-muted">
          Couldn't load settings.
        </p>
        <PrimaryButton onClick={() => window.location.reload()} size="sm">
          Retry
        </PrimaryButton>
      </div>
    );
  }
  if (!settings)
    return (
      <div className="space-y-4">
        <SkeletonGlass lines={4} />
      </div>
    );

  const nameVal = businessName || settings.businessName;
  const prefixVal = billPrefix || settings.billPrefix;
  const footerVal = billFooter || settings.billFooter;

  async function handleSaveBusiness() {
    await updateSettings({
      businessName: nameVal,
      billPrefix: prefixVal,
      billFooter: footerVal,
    });
  }

  async function handleTestPrint() {
    const result = await printerService.testPrint();
    setTestPrintResult(result ? "success" : "error");
    setTimeout(() => setTestPrintResult(null), 3000);
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) return;
    await changePassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {}
    dispatch(logoutAction());
    navigate("/login");
  }

  async function handleScannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setScannerUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await uploadScanner({ scannerImage: dataUrl }).unwrap();
    } catch {
      // silently fail
    } finally {
      setScannerUploading(false);
      if (scannerInputRef.current) scannerInputRef.current.value = "";
    }
  }

  async function handleDeleteScanner() {
    await deleteScanner();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 animate-fade-up">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #5FD9D6, #146C8E)" }}
        >
          <IoSettings size={22} color="white" />
        </div>
        <div>
          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-fg"
          >
            Settings
          </h1>
          <p className="text-sm mt-0.5 text-fg-muted">
            Manage your club preferences
          </p>
        </div>
      </div>

      {/* Desktop: 2-column grid / Mobile: single column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Toggle */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <IoMoon size={20} className="text-accent" />
              ) : (
                <IoSunny size={20} className="text-danger" />
              )}
              <div>
                <h2
                  className="text-sm font-bold text-fg"
                >
                  Theme
                </h2>
                <p className="text-xs text-fg-muted">
                  Currently: {theme === "dark" ? "Dark Ocean" : "Aqua Light"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                background:
                  theme === "dark"
                    ? "var(--accent-aqua)"
                    : "var(--accent-coral)",
              }}
            >
              <span
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
                style={{ left: theme === "dark" ? "4px" : "32px" }}
              />
            </button>
          </div>
        </GlassCard>

        {/* Printer */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <IoPrint size={20} className="text-accent" />
            <h2
              className="text-sm font-bold text-fg"
            >
              Printer
            </h2>
          </div>
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <span
                className="text-sm text-fg-dim"
              >
                Status
              </span>
              <span
                className="text-sm font-bold flex items-center gap-1.5"
                style={{
                  color: settings.printerSettings.connected
                    ? "var(--accent-aqua)"
                    : "var(--accent-coral)",
                }}
              >
                {settings.printerSettings.connected ? (
                  <IoCheckmarkCircle size={14} />
                ) : (
                  <IoCloseCircle size={14} />
                )}
                {settings.printerSettings.connected
                  ? `Connected (${settings.printerSettings.model})`
                  : "Disconnected"}
              </span>
            </div>
            <GhostButton onClick={handleTestPrint} fullWidth>
              Test Print
            </GhostButton>
            {testPrintResult && (
              <p
                className="text-sm text-center font-medium animate-scale-in"
                style={{
                  color:
                    testPrintResult === "success"
                      ? "var(--accent-aqua)"
                      : "var(--accent-coral)",
                }}
              >
                {testPrintResult === "success"
                  ? "Test print sent successfully!"
                  : "Test print failed"}
              </p>
            )}
          </div>
        </GlassCard>

        {/* Business Info — spans full width on desktop */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <IoBusiness size={20} className="text-accent" />
            <h2
              className="text-sm font-bold text-fg"
            >
              Business Info
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Business Name"
                value={nameVal}
                onChange={(e) => setBusinessName(e.target.value)}
                className="min-h-12"
              />
            </div>
              <Input
                label="Bill Prefix"
                value={prefixVal}
                onChange={(e) => setBillPrefix(e.target.value)}
                className="font-mono min-h-12"
              />
            <div className="space-y-2 sm:col-span-2">
              <label
                className="text-xs font-bold uppercase tracking-wider text-fg-muted"
              >
                Bill Footer
              </label>
              <textarea
                value={footerVal}
                onChange={(e) => setBillFooter(e.target.value)}
                rows={2}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 resize-none border border-input-border bg-input text-fg"
              />
            </div>
          </div>
          <div className="mt-5">
            <PrimaryButton onClick={handleSaveBusiness}>
              Save Changes
            </PrimaryButton>
          </div>
        </GlassCard>

        {/* Scanner Upload */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <IoQrCode size={20} className="text-accent" />
            <h2
              className="text-sm font-bold text-fg"
            >
              Payment Scanner
            </h2>
          </div>
          <p className="text-xs text-fg-muted mb-4">
            Upload a QR code or scanner image that customers can scan to make payments.
          </p>
          {settings.scannerImage ? (
            <div className="space-y-4">
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <img
                  src={settings.scannerImage}
                  alt="Payment Scanner"
                  className="w-full max-w-sm mx-auto block object-contain p-4"
                  style={{ maxHeight: "320px" }}
                />
              </div>
              <div className="flex gap-3">
                <GhostButton
                  onClick={() => scannerInputRef.current?.click()}
                  fullWidth
                >
                  <IoCamera size={16} />
                  Replace Scanner
                </GhostButton>
                <GhostButton
                  onClick={handleDeleteScanner}
                  fullWidth
                  style={{
                    color: "var(--accent-coral)",
                    borderColor: "rgba(255,122,89,0.25)",
                  }}
                >
                  <IoTrash size={16} />
                  Remove
                </GhostButton>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{
                background: "var(--glass-bg)",
                border: "2px dashed var(--glass-border)",
              }}
              onClick={() => scannerInputRef.current?.click()}
            >
              <IoCamera size={32} className="mx-auto mb-3 text-fg-muted" />
              <p className="text-sm font-medium text-fg-dim">
                {scannerUploading ? "Uploading..." : "Click to upload scanner image"}
              </p>
              <p className="text-xs text-fg-muted mt-1">
                Supports JPG, PNG, or SVG
              </p>
            </div>
          )}
          <input
            ref={scannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleScannerUpload}
          />
        </GlassCard>

        {/* Club Timing */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <IoTime size={20} className="text-accent" />
            <h2
              className="text-sm font-bold text-fg"
            >
              Club Timing
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Input
                label="Opening Time"
                type="time"
                value={openTime || settings.clubTiming?.openTime || "05:00"}
                onChange={(e) => setOpenTime(e.target.value)}
                className="font-mono min-h-12"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Closing Time"
                type="time"
                value={closeTime || settings.clubTiming?.closeTime || "22:00"}
                onChange={(e) => setCloseTime(e.target.value)}
                className="font-mono min-h-12"
              />
            </div>
            <div className="flex items-end">
              <div
                className="flex items-center justify-between w-full p-2 rounded-xl"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-bold text-fg"
                  >
                    Show on login
                  </p>
                  <p
                    className="text-xs mt-0.5 text-fg-muted"
                  >
                    Display hours to staff
                  </p>
                </div>
                <div
                  className="w-11 h-6 rounded-full flex items-center px-0.5 transition-all" bg-accent
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white shadow-sm transition-all"
                    style={{ transform: "translateX(20px)" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="mt-4 p-4 rounded-xl"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2 text-fg-muted"
            >
              Operating Days
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                settings.clubTiming?.daysOpen ?? [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ]
              ).map((day) => (
                <span
                  key={day}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background: "var(--glow-aqua)",
                    color: "var(--accent-aqua)",
                  }}
                >
                  {day.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <PrimaryButton onClick={handleSaveBusiness} fullWidth>
              Save Timing
            </PrimaryButton>
          </div>
        </GlassCard>

        {/* Change Password */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <IoLockClosed size={20} className="text-accent" />
            <h2
              className="text-sm font-bold text-fg"
            >
              Change Password
            </h2>
          </div>
          <div className="space-y-3">
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="min-h-12"
              showIcon={false}
            />
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="min-h-12"
              showIcon={false}
            />
            <PrimaryButton
              onClick={handleChangePassword}
              loading={changingPassword}
              fullWidth
            >
              Update Password
            </PrimaryButton>
          </div>
        </GlassCard>

        {/* Logout */}
        <GlassCard className="flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-sm text-fg-muted">
              Ready to leave?
            </p>
            <GhostButton
              fullWidth
              onClick={handleLogout}
              size="lg"
              style={{
                color: "var(--accent-coral)",
                borderColor: "rgba(255,122,89,0.25)",
              }}
            >
              <IoLogOut size={18} />
              Logout
            </GhostButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
