import { Component, type ReactNode, type ErrorInfo } from "react";
import { IoWarning, IoRefresh } from "react-icons/io5";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
          <div
            className="ambient-blob blob-1"
            style={{ top: "-15%", left: "-10%" }}
          />
          <div
            className="ambient-blob blob-2"
            style={{ top: "25%", right: "-8%" }}
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
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ background: "rgba(255,122,89,0.12)" }}
                >
                  <IoWarning
                    size={32}
                    className="text-danger"
                  />
                </div>

                <h1
                  className="font-display text-xl font-bold text-fg"
                >
                  Something went wrong
                </h1>
                <p
                  className="text-sm mt-2 max-w-xs mx-auto text-fg-dim"
                >
                  An unexpected error occurred. Please try again or contact
                  support if the problem persists.
                </p>

                {this.state.error && (
                  <div
                    className="mt-4 p-3 rounded-xl text-left text-xs font-mono overflow-auto max-h-32"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {this.state.error.message}
                  </div>
                )}

                <button
                  onClick={this.handleRetry}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white min-h-12 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #FF7A59, #E85D3A)",
                  }}
                >
                  <IoRefresh size={18} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
