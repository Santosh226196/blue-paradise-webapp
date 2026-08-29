import { IoCloudOffline, IoRefresh } from "react-icons/io5";

export function OfflinePage() {
  function handleRetry() {
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="ambient-blob blob-1"
        style={{ top: "-15%", left: "-10%" }}
      />
      <div
        className="ambient-blob blob-2"
        style={{ top: "25%", right: "-8%" }}
      />
      <div
        className="ambient-blob blob-3"
        style={{ bottom: "10%", left: "20%" }}
      />

      <div className="w-full max-w-sm relative z-10 text-center animate-scale-in">
        <div className="liquid-glass relative overflow-hidden p-10">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-coral), transparent 60%)",
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 bg-[rgba(255,122,89,0.12)]"
            >
              <IoCloudOffline
                size={40}
                className="text-danger"
              />
            </div>

            <h1
              className="font-display text-2xl font-bold text-fg"
            >
              No Internet Connection
            </h1>
            <p
              className="text-sm mt-2 max-w-xs mx-auto text-fg-dim"
            >
              Please check your network connection and try again. The app needs
              internet to load data.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white min-h-12 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #FF7A59, #E85D3A)",
                }}
              >
                <IoRefresh size={18} />
                Try Again
              </button>

              <div className="flex items-center gap-3 justify-center">
                <div
                  className="h-px flex-1 bg-glass-border"
                />
                <span
                  className="text-xs font-bold text-fg-muted"
                >
                  TIPS
                </span>
                <div
                  className="h-px flex-1 bg-glass-border"
                />
              </div>

              <ul
                className="text-left text-xs space-y-2 text-fg-muted"
              >
                <li className="flex items-start gap-2">
                  <span
                    className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-accent"
                  />
                  Check if Wi-Fi or mobile data is turned on
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-accent"
                  />
                  Try turning airplane mode on and off
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-accent"
                  />
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
