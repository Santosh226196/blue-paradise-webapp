import type { AuthLayoutProps } from "@/types";

export function AuthLayout({ brandPanel, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-deep">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[45%]">
        {brandPanel}
      </div>

      {/* Right form panel */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 bg-deep"
      >
        <div className="w-full max-w-110 animate-scale-in">{children}</div>
      </div>
    </div>
  );
}
