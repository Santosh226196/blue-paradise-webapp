import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/hooks/store";
import { setCredentials } from "@/store/slices/authSlice";
import { useTheme } from "@/hooks/useTheme";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import { PrimaryButton } from "@/components/ui";
import { IoEye, IoEyeOff, IoTime, IoLocation } from "react-icons/io5";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: settings } = useGetSettingsQuery();

  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setError("");
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch {
      setError("Invalid credentials. Try admin / admin123");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* ─── Deep ocean background gradient ─── */}
      <div className="absolute inset-0" style={{
        background: theme === "dark"
          ? "linear-gradient(180deg, #020C12 0%, #061E2E 25%, #0A3B4A 50%, #0E5A73 75%, #146C8E 100%)"
          : "linear-gradient(180deg, #D4F5F4 0%, #B8EEED 25%, #A8E6E4 50%, #88DADA 75%, #68D0D0 100%)"
      }} />

      {/* ─── Light rays through water ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-[60vh] origin-top opacity-[0.07] login-ray"
          style={{ background: "linear-gradient(180deg, var(--accent-aqua), transparent)", transform: "rotate(-12deg)" }}
        />
        <div className="absolute top-0 left-[38%] w-px h-[50vh] origin-top opacity-[0.05] login-ray"
          style={{ background: "linear-gradient(180deg, var(--accent-aqua), transparent)", transform: "rotate(-5deg)", animationDelay: "2s" }}
        />
        <div className="absolute top-0 right-1/3 w-px h-[55vh] origin-top opacity-[0.06] login-ray"
          style={{ background: "linear-gradient(180deg, var(--accent-aqua), transparent)", transform: "rotate(8deg)", animationDelay: "4s" }}
        />
        <div className="absolute top-0 right-[22%] w-px h-[45vh] origin-top opacity-[0.04] login-ray"
          style={{ background: "linear-gradient(180deg, var(--accent-aqua), transparent)", transform: "rotate(15deg)", animationDelay: "1s" }}
        />
      </div>

      {/* ─── Bubbles ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="login-bubble"
            style={{
              left: `${5 + Math.random() * 90}%`,
              width: `${4 + Math.random() * 14}px`,
              height: `${4 + Math.random() * 14}px`,
              animationDuration: `${6 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 8}s`,
              opacity: 0.15 + Math.random() * 0.25,
            }}
          />
        ))}
      </div>


      {/* ─── Animated Waves (bottom) ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <path className="wave wave-1"
            d="M0,160 C240,120 480,200 720,160 C960,120 1200,200 1440,160 L1440,200 L0,200 Z"
            fill="var(--accent-aqua)" fillOpacity="0.06"
          />
          <path className="wave wave-2"
            d="M0,170 C360,130 600,190 900,150 C1100,120 1300,180 1440,150 L1440,200 L0,200 Z"
            fill="var(--accent-pool)" fillOpacity="0.08"
          />
          <path className="wave wave-3"
            d="M0,180 C200,155 500,195 800,170 C1050,150 1250,185 1440,170 L1440,200 L0,200 Z"
            fill="var(--accent-aqua)" fillOpacity="0.04"
          />
        </svg>
      </div>

      {/* ─── Ambient blobs ─── */}
      <div className="ambient-blob blob-1" style={{ top: "5%", left: "-5%", opacity: 0.4 }} />
      <div className="ambient-blob blob-2" style={{ top: "50%", right: "-8%", opacity: 0.3 }} />
      <div className="ambient-blob blob-3" style={{ bottom: "15%", left: "15%", opacity: 0.2 }} />

      {/* ─── Main Content ─── */}
      <div className="w-full max-w-[400px] relative z-10 animate-scale-in mt-8 sm:mt-0">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float-gentle relative z-10"
              style={{ background: "linear-gradient(135deg, #5FD9D6, #146C8E)", boxShadow: "0 8px 40px rgba(95,217,214,0.35)" }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M6 26c4-6 8-6 12 0s8 6 12 0 8-6 12 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M6 18c4-6 8-6 12 0s8 6 12 0 8-6 12 0" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <circle cx="20" cy="12" r="3" fill="white" opacity="0.8" />
              </svg>
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow" style={{ margin: "-4px" }} />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Blue Paradise
          </h1>
          <p className="text-sm mt-1.5 font-medium" style={{ color: "var(--text-secondary)" }}>Water Club Management</p>
        </div>

        {/* Login Card */}
        <div className="liquid-glass relative overflow-hidden p-7 sm:p-8">
          {/* Card inner glow */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--accent-aqua), transparent)" }} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <h2 className="text-lg font-bold text-center" style={{ color: "var(--text-primary)" }}>Staff Login</h2>

            {error && (
              <div className="rounded-xl p-3.5 text-sm font-medium text-center animate-scale-in"
                style={{ background: "rgba(255,122,89,0.12)", border: "1px solid rgba(255,122,89,0.25)", color: "var(--accent-coral)" }}
              >
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }} htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register("username")}
                  onFocus={() => setFocus("username")}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 min-h-[48px] focus:scale-[1.01]"
                  style={{
                    background: "var(--input-bg)",
                    border: "1.5px solid var(--input-border)",
                    color: "var(--text-primary)",
                    outlineColor: "var(--input-focus-ring)",
                  }}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && <p className="text-xs font-medium" style={{ color: "var(--accent-coral)" }}>{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }} htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm font-medium transition-all duration-300 min-h-[48px] focus:scale-[1.01]"
                  style={{
                    background: "var(--input-bg)",
                    border: "1.5px solid var(--input-border)",
                    color: "var(--text-primary)",
                    outlineColor: "var(--input-focus-ring)",
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium" style={{ color: "var(--accent-coral)" }}>{errors.password.message}</p>}
            </div>

            <PrimaryButton type="submit" fullWidth size="lg" loading={isLoading}>
              Dive In
            </PrimaryButton>

            <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
              Forgot password? Contact system administrator
            </p>
          </form>
        </div>

        {/* Club Timing */}
        {settings?.clubTiming && (
          <div className="mt-5 liquid-glass relative overflow-hidden p-4 animate-fade-up stagger-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--glow-aqua)", color: "var(--accent-aqua)" }}
              >
                <IoTime size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Club Hours</p>
                <p className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                  {settings.clubTiming.openTime} — {settings.clubTiming.closeTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Open</p>
                <p className="text-xs font-semibold" style={{ color: "var(--accent-aqua)" }}>
                  {settings.clubTiming.daysOpen?.length ?? 7} days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] mt-6 font-medium" style={{ color: "var(--text-muted)" }}>
          {settings?.businessName || "Blue Paradise Water Club"} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
