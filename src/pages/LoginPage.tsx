import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/store/api/authApi";
import { useAppDispatch } from "@/hooks/store";
import { setCredentials } from "@/store/slices/authSlice";
import { useTheme } from "@/hooks/useTheme";
import { AuthLayout, BrandPanel } from "@/components/auth";
import { Button, Input, PasswordInput } from "@/components/ui";
import { Logo } from "@/components/Logo";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Email / username is required")
    .refine(
      (v) => v.includes("@") || /^[a-zA-Z0-9._-]+$/.test(v),
      "Enter a valid email or username",
    ),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

type AuthView =
  | "login"
  | "forgot-identify"
  | "forgot-otp"
  | "forgot-reset"
  | "forgot-success";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<AuthView>("login");

  // Login
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password
  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const [resetIdentity, setResetIdentity] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [maskedDestination, setMaskedDestination] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onLoginSubmit(data: LoginForm) {
    setLoginError("");
    try {
      const payload = { ...data, username: data.username.trim() };
      if (rememberMe) {
        try {
          localStorage.setItem("bp_remember", payload.username);
        } catch {
          /* ignore */
        }
      }
      const result = await login(payload).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Invalid credentials. (Default: admin / admin123)";
      setLoginError(msg);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    if (!resetIdentity.trim()) {
      setForgotError("Please enter your registered username or mobile number");
      return;
    }
    try {
      const res = await forgotPassword({
        identity: resetIdentity.trim(),
      }).unwrap();
      setDemoOtp(res.demoOtp || "123456");
      setMaskedDestination(res.maskedDestination || resetIdentity);
      setView("forgot-otp");
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Could not find account. Please verify your details.";
      setForgotError(msg);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setForgotError("Please enter the 6-digit verification code");
      return;
    }
    try {
      await verifyOtp({
        identity: resetIdentity,
        otp: otpCode.trim(),
      }).unwrap();
      setView("forgot-reset");
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Invalid verification code. Use demo code: 123456";
      setForgotError(msg);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    if (!newPassword || newPassword.length < 4) {
      setForgotError("Password must be at least 4 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please re-enter.");
      return;
    }
    try {
      await resetPassword({ identity: resetIdentity, newPassword }).unwrap();
      setValue(
        "username",
        resetIdentity.toLowerCase() === "9876543210" ? "admin" : resetIdentity,
      );
      setValue("password", newPassword);
      setView("forgot-success");
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Failed to reset password. Please try again.";
      setForgotError(msg);
    }
  }

  function resetForgotFlow() {
    setForgotError("");
    setResetIdentity("");
    setOtpCode("");
    setDemoOtp(null);
    setNewPassword("");
    setConfirmPassword("");
    setView("login");
  }

  const cardStyle = {
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: "20px",
    boxShadow:
      "0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
    backdropFilter: "blur(var(--glass-blur))",
  };

  return (
    <AuthLayout brandPanel={<BrandPanel />}>
      {/* Theme toggle */}
      <div className="absolute top-5 right-5 z-30">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-all duration-200 border hover:brightness-110 cursor-pointer"
          style={{
            borderColor: "var(--glass-border)",
            background: "var(--glass-bg)",
            color: "var(--text-muted)",
          }}
          title={`Switch to ${theme === "dark" ? "Aqua" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="relative p-8 sm:p-10" style={cardStyle}>
        {/* Mobile logo */}
        <div className="flex justify-center mb-6 lg:hidden">
          <Logo size={48} />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight mb-1.5"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            Welcome back, Admin
          </h1>
          <p className="text-sm text-fg-dim">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* ─── LOGIN VIEW ─── */}
        {view === "login" && (
          <>
            {loginError && (
              <div
                className="mb-5 rounded-xl p-3 text-xs font-semibold text-center border animate-scale-in"
                style={{
                  borderColor: "var(--accent-coral)",
                  background: "var(--glow-coral)",
                  color: "var(--accent-coral)",
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              <Input
                label="Email address"
                icon={Mail}
                placeholder="Enter your email"
                autoComplete="username"
                error={errors.username?.message}
                {...register("username")}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: "var(--accent-aqua)" }}
                  />
                  <span
                    className="text-sm text-fg-dim"
                  >
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotError("");
                    setView("forgot-identify");
                  }}
                  className="text-sm font-semibold transition-colors text-accent cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In */}
              <div className="pt-2">
                <Button type="submit" loading={isLoginLoading} fullWidth>
                  Sign In <ArrowRight size={16} />
                </Button>
              </div>
            </form>

            {/* Help text */}
            <p
              className="text-center text-xs mt-6 text-fg-muted"
            >
              Need help?{" "}
              <a
                href="mailto:support@blueparadise.com"
                className="font-semibold text-accent"
              >
                Contact support
              </a>
            </p>
          </>
        )}

        {/* ─── FORGOT PASSWORD: STEP 1 ─── */}
        {view === "forgot-identify" && (
          <div className="animate-scale-in">
            <button
              onClick={resetForgotFlow}
              className="inline-flex items-center gap-1 text-xs font-bold mb-6 transition-colors text-fg-muted cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </button>

            <div className="mb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-glow-a"
              >
                <KeyRound size={22} className="text-accent" />
              </div>
              <h2
                className="text-lg font-bold text-fg"
              >
                Reset Password
              </h2>
              <p
                className="text-xs mt-1 text-fg-dim"
              >
                Enter your staff username or registered mobile to receive a
                6-digit security code.
              </p>
            </div>

            {forgotError && (
              <div
                className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border"
                style={{
                  borderColor: "var(--accent-coral)",
                  background: "var(--glow-coral)",
                  color: "var(--accent-coral)",
                }}
              >
                {forgotError}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Username or mobile"
                icon={Mail}
                placeholder="e.g. admin or 9876543210"
                value={resetIdentity}
                onChange={(e) => setResetIdentity(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={resetForgotFlow}
                  className="w-1/3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isForgotLoading}
                  className="flex-1"
                >
                  Send Code
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 2 (OTP) ─── */}
        {view === "forgot-otp" && (
          <div className="animate-scale-in">
            <button
              onClick={() => setView("forgot-identify")}
              className="inline-flex items-center gap-1 text-xs font-bold mb-6 transition-colors text-fg-muted cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="mb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-glow-a"
              >
                <ShieldCheck
                  size={22}
                  className="text-accent"
                />
              </div>
              <h2
                className="text-lg font-bold text-fg"
              >
                Enter Verification Code
              </h2>
              <p
                className="text-xs mt-1 text-fg-dim"
              >
                We sent a 6-digit OTP code to{" "}
                <span
                  className="font-mono font-semibold text-accent"
                >
                  {maskedDestination}
                </span>
              </p>
            </div>

            {demoOtp && (
              <div
                className="mb-4 p-3 rounded-xl flex items-center justify-between border"
                style={{
                  background: "var(--glow-aqua)",
                  borderColor: "var(--glass-border)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-bold text-accent"
                  >
                    DEMO VERIFICATION OTP
                  </p>
                  <p
                    className="text-sm font-bold font-mono tracking-widest text-fg"
                  >
                    {demoOtp}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(demoOtp)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-deep)",
                  }}
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {forgotError && (
              <div
                className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border"
                style={{
                  borderColor: "var(--accent-coral)",
                  background: "var(--glow-coral)",
                  color: "var(--accent-coral)",
                }}
              >
                {forgotError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoFocus
                className="text-center text-xl font-bold font-mono tracking-[0.4em] min-h-11"
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--input-border)";
                }}
              />
              <Button type="submit" loading={isOtpLoading} fullWidth>
                Verify & Continue
              </Button>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 3 (NEW PASSWORD) ─── */}
        {view === "forgot-reset" && (
          <div className="animate-scale-in">
            <div className="mb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-glow-a"
              >
                <Lock size={22} className="text-accent" />
              </div>
              <h2
                className="text-lg font-bold text-fg"
              >
                Create New Password
              </h2>
              <p
                className="text-xs mt-1 text-fg-dim"
              >
                Enter a secure new password for{" "}
                <span
                  className="font-mono font-semibold text-accent"
                >
                  {resetIdentity}
                </span>
              </p>
            </div>

            {forgotError && (
              <div
                className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border"
                style={{
                  borderColor: "var(--accent-coral)",
                  background: "var(--glow-coral)",
                  color: "var(--accent-coral)",
                }}
              >
                {forgotError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <PasswordInput
                label="New password"
                placeholder="At least 4 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
              />
              <PasswordInput
                label="Confirm password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="pt-2">
                <Button type="submit" loading={isResetLoading} fullWidth>
                  Update Password & Sign In
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 4 (SUCCESS) ─── */}
        {view === "forgot-success" && (
          <div className="text-center animate-scale-in py-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
              style={{
                background: "var(--glow-aqua)",
                borderColor: "var(--glass-border)",
              }}
            >
              <CheckCircle2 size={36} className="text-accent" />
            </div>
            <h2
              className="text-xl font-bold text-fg"
            >
              Password Changed!
            </h2>
            <p
              className="text-xs mt-2 mb-6 text-fg-dim"
            >
              Your password has been successfully updated. You can now sign in
              with your new credentials.
            </p>
            <Button fullWidth onClick={() => setView("login")}>
              Proceed to Sign In
            </Button>
          </div>
        )}

        {/* Footer */}
        <p
          className="text-center text-xs mt-8 pt-6 font-medium"
          style={{
            color: "var(--text-muted)",
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          Restricted access — Admins only
        </p>
      </div>

      <p
        className="text-center text-xs mt-5 font-medium text-fg-muted"
      >
        Blue Paradise Water Club &copy; {new Date().getFullYear()}
      </p>
    </AuthLayout>
  );
}
