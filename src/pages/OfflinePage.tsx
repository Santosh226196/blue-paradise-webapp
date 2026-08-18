import { IoCloudOffline, IoRefresh } from "react-icons/io5";

export function OfflinePage() {
  function handleRetry() {
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="ambient-blob blob-1" style={{ top: "-15%", left: "-10%" }} />
      <div className="ambient-blob blob-2" style={{ top: "25%", right: "-8%" }} />
      <div className="ambient-blob blob-3" style={{ bottom: "10%", left: "20%" }} />

      <div className="w-full max-w-sm relative z-10 text-center animate-scale-in">
        <div className="liquid-glass relative overflow-hidden p-10">
          <div className="absolute inset-0 opacity-10"
            style={{ background: "linear-gradient(135deg, var(--accent-coral), transparent 60%)" }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
              style={{ background: "rgba(255,122,89,0.12)" }}
            >
              <IoCloudOffline size={40} style={{ color: "var(--accent-coral)" }} />
            </div>

            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              No Internet Connection
            </h1>
            <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>
              Please check your network connection and try again. The app needs internet to load data.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white min-h-[48px] transition-all duration-200 active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg, #FF7A59, #E85D3A)" }}
              >
                <IoRefresh size={18} />
                Try Again
              </button>

              <div className="flex items-center gap-3 justify-center">
                <div className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>TIPS</span>
                <div className="h-px flex-1" style={{ background: "var(--glass-border)" }} />
              </div>

              <ul className="text-left text-xs space-y-2" style={{ color: "var(--text-muted)" }}>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent-aqua)" }} />
                  Check if Wi-Fi or mobile data is turned on
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent-aqua)" }} />
                  Try turning airplane mode on and off
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent-aqua)" }} />
                  Restart your router if on Wi-Fi
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
