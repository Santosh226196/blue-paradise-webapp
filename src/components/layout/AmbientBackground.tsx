export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Top Left Aqua Glow */}
      <div
        className="ambient-blob blob-1"
        style={{
          top: "-5%",
          left: "-5%",
          width: "600px",
          height: "600px",
          opacity: 0.85,
        }}
      />
      {/* Center Right Pool Sapphire Glow */}
      <div
        className="ambient-blob blob-2"
        style={{
          top: "25%",
          right: "-8%",
          width: "550px",
          height: "550px",
          opacity: 0.75,
        }}
      />
      {/* Bottom Left Deep Lagoon Glow */}
      <div
        className="ambient-blob blob-1"
        style={{
          bottom: "10%",
          left: "5%",
          width: "500px",
          height: "500px",
          opacity: 0.7,
        }}
      />
      {/* Bottom Right Warm Coral/Aqua Accent Glow */}
      <div
        className="ambient-blob blob-3"
        style={{
          bottom: "-5%",
          right: "15%",
          width: "450px",
          height: "450px",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
