export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="ambient-blob blob-1" style={{ top: "-10%", left: "-8%" }} />
      <div className="ambient-blob blob-2" style={{ top: "30%", right: "-5%" }} />
      <div className="ambient-blob blob-3" style={{ bottom: "5%", left: "25%" }} />
    </div>
  );
}
