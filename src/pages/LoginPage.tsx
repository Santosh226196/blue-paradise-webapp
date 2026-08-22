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
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import { PrimaryButton, GhostButton } from "@/components/ui";
import { Logo } from "@/components/Logo";
import {
  IoEye,
  IoEyeOff,
  IoTime,
  IoPersonOutline,
  IoLockClosedOutline,
  IoShieldCheckmarkOutline,
  IoKeyOutline,
  IoArrowBack,
  IoCheckmarkCircle,
  IoSunnyOutline,
  IoMoonOutline,
  IoSparkles,
} from "react-icons/io5";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

type AuthView = "login" | "forgot-identify" | "forgot-otp" | "forgot-reset" | "forgot-success";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { data: settings } = useGetSettingsQuery();

  // Mode state
  const [view, setView] = useState<AuthView>("login");

  // Login Form
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  const [resetIdentity, setResetIdentity] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [maskedDestination, setMaskedDestination] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 1-Click Demo Fill
  function handleQuickFill() {
    setValue("username", "admin");
    setValue("password", "admin123");
    setLoginError("");
  }

  // Handle Login Submit
  async function onLoginSubmit(data: LoginForm) {
    setLoginError("");
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Invalid credentials. (Default: admin / admin123)";
      setLoginError(msg);
    }
  }

  // Forgot Password Step 1: Send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    if (!resetIdentity.trim()) {
      setForgotError("Please enter your registered username or mobile number");
      return;
    }

    try {
      const res = await forgotPassword({ identity: resetIdentity.trim() }).unwrap();
      setDemoOtp(res.demoOtp || "123456");
      setMaskedDestination(res.maskedDestination || resetIdentity);
      setView("forgot-otp");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Could not find account. Please verify your details.";
      setForgotError(msg);
    }
  }

  // Forgot Password Step 2: Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setForgotError("Please enter the 6-digit verification code");
      return;
    }

    try {
      await verifyOtp({ identity: resetIdentity, otp: otpCode.trim() }).unwrap();
      setView("forgot-reset");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Invalid verification code. Use demo code: 123456";
      setForgotError(msg);
    }
  }

  // Forgot Password Step 3: Save New Password
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
      setValue("username", resetIdentity.toLowerCase() === "9876543210" ? "admin" : resetIdentity);
      setValue("password", newPassword);
      setView("forgot-success");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden font-sans">
      {/* ─── Top Theme Switcher Bar ─── */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-all duration-200 border border-white/10 bg-white/5 hover:bg-white/10 text-cyan-400 backdrop-blur-md shadow-lg"
          title={`Switch to ${theme === "dark" ? "Aqua" : "Dark"} Mode`}
        >
          {theme === "dark" ? <IoSunnyOutline size={18} /> : <IoMoonOutline size={18} />}
        </button>
      </div>

      {/* ─── Light rays through water ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-px h-[60vh] origin-top opacity-[0.08]"
          style={{
            background: "linear-gradient(180deg, var(--accent-aqua), transparent)",
            transform: "rotate(-12deg)",
          }}
        />
        <div
          className="absolute top-0 right-1/3 w-px h-[55vh] origin-top opacity-[0.08]"
          style={{
            background: "linear-gradient(180deg, var(--accent-aqua), transparent)",
            transform: "rotate(8deg)",
          }}
        />
      </div>

      {/* ─── Ambient Glow Mesh ─── */}
      <div
        className="ambient-blob blob-1"
        style={{ top: "5%", left: "-5%", opacity: 0.55, width: "500px", height: "500px" }}
      />
      <div
        className="ambient-blob blob-2"
        style={{ top: "45%", right: "-5%", opacity: 0.45, width: "450px", height: "450px" }}
      />
      <div
        className="ambient-blob blob-3"
        style={{ bottom: "5%", left: "20%", opacity: 0.35, width: "400px", height: "400px" }}
      />

      {/* ─── Main Content Box ─── */}
      <div className="w-full max-w-[430px] relative z-10 animate-scale-in">
        {/* Brand Crest */}
        <div className="text-center mb-6">
          <div className="mb-3.5 flex justify-center">
            <Logo size={96} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Blue Paradise
          </h1>
          <p className="text-xs font-semibold tracking-wider uppercase text-cyan-300 mt-1">
            Water Club Portal
          </p>
        </div>

        {/* ─── LOGIN VIEW ─── */}
        {view === "login" && (
          <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl animate-fade-up">
            {/* Subtle Top Accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent-aqua), transparent)" }}
            />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Staff Sign In</h2>
                <p className="text-xs text-slate-400">Enter your management credentials</p>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/25 transition-all"
                title="Auto-fill admin/admin123 credentials"
              >
                <IoSparkles size={12} />
                <span>Demo Fill</span>
              </button>
            </div>

            {loginError && (
              <div className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border border-rose-500/30 bg-rose-500/15 text-rose-300 animate-scale-in">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register("username")}
                    placeholder="e.g. admin"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium transition-all min-h-[48px] bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
                  />
                </div>
                {errors.username && <p className="text-xs text-rose-400">{errors.username.message}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotError("");
                      setView("forgot-identify");
                    }}
                    className="text-xs font-bold text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm font-medium transition-all min-h-[48px] bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
              </div>

              <PrimaryButton type="submit" fullWidth size="lg" loading={isLoginLoading} className="mt-2">
                Sign In to Dashboard
              </PrimaryButton>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 1 (IDENTIFY) ─── */}
        {view === "forgot-identify" && (
          <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl animate-scale-in">
            <button
              onClick={resetForgotFlow}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white mb-4"
            >
              <IoArrowBack size={16} /> Back to Sign In
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-3">
                <IoKeyOutline size={22} />
              </div>
              <h2 className="text-lg font-bold text-white">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your staff username or registered mobile to receive a 6-digit security code.
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border border-rose-500/30 bg-rose-500/15 text-rose-300">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Username or Mobile Number
                </label>
                <div className="relative">
                  <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    type="text"
                    value={resetIdentity}
                    onChange={(e) => setResetIdentity(e.target.value)}
                    placeholder="e.g. admin or 9876543210"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px] bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <GhostButton type="button" onClick={resetForgotFlow} className="w-1/3">
                  Cancel
                </GhostButton>
                <PrimaryButton type="submit" fullWidth loading={isForgotLoading} className="flex-1">
                  Send Code
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 2 (VERIFY OTP) ─── */}
        {view === "forgot-otp" && (
          <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl animate-scale-in">
            <button
              onClick={() => setView("forgot-identify")}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white mb-4"
            >
              <IoArrowBack size={16} /> Back
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center mb-3">
                <IoShieldCheckmarkOutline size={22} />
              </div>
              <h2 className="text-lg font-bold text-white">Enter Verification Code</h2>
              <p className="text-xs text-slate-400 mt-1">
                We sent a 6-digit OTP code to <span className="text-cyan-300 font-mono">{maskedDestination}</span>
              </p>
            </div>

            {demoOtp && (
              <div className="mb-4 p-3 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-cyan-300">DEMO VERIFICATION OTP</p>
                  <p className="text-sm font-bold font-mono tracking-widest text-white">{demoOtp}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(demoOtp)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {forgotError && (
              <div className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border border-rose-500/30 bg-rose-500/15 text-rose-300">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full px-4 py-3.5 rounded-xl text-center text-xl font-bold font-mono tracking-[0.4em] min-h-[48px] bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
                  autoFocus
                />
              </div>

              <PrimaryButton type="submit" fullWidth size="lg" loading={isOtpLoading}>
                Verify & Continue
              </PrimaryButton>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 3 (NEW PASSWORD) ─── */}
        {view === "forgot-reset" && (
          <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl animate-scale-in">
            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-400/15 text-teal-300 flex items-center justify-center mb-3">
                <IoLockClosedOutline size={22} />
              </div>
              <h2 className="text-lg font-bold text-white">Create New Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter a secure new password for <span className="text-cyan-300 font-mono">{resetIdentity}</span>
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 rounded-xl p-3 text-xs font-semibold text-center border border-rose-500/30 bg-rose-500/15 text-rose-300">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  New Password
                </label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm font-medium min-h-[48px] bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px] bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
                  />
                </div>
              </div>

              <PrimaryButton type="submit" fullWidth size="lg" loading={isResetLoading}>
                Update Password & Sign In
              </PrimaryButton>
            </form>
          </div>
        )}

        {/* ─── FORGOT PASSWORD: STEP 4 (SUCCESS) ─── */}
        {view === "forgot-success" && (
          <div className="liquid-glass relative overflow-hidden p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <IoCheckmarkCircle size={36} />
            </div>

            <h2 className="text-xl font-bold text-white">Password Changed!</h2>
            <p className="text-xs text-slate-300 mt-2 mb-6">
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>

            <PrimaryButton fullWidth size="lg" onClick={() => setView("login")}>
              Proceed to Sign In
            </PrimaryButton>
          </div>
        )}

        {/* Club Hours Information Card */}
        {settings?.clubTiming && (
          <div className="mt-4 liquid-glass relative overflow-hidden p-3.5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-cyan-400/15 text-cyan-300">
                <IoTime size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Club Operating Hours</p>
                <p className="text-xs font-bold font-mono text-white">
                  {settings.clubTiming.openTime} — {settings.clubTiming.closeTime}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Open Daily
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] mt-5 font-medium text-slate-400">
          {settings?.businessName || "Blue Paradise Water Club"} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
