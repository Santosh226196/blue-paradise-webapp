import { useEffect, useMemo, useRef, useState } from "react";
import { IoTimeOutline } from "react-icons/io5";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const STEPS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

function to12(hhmm: string) {
  if (!hhmm) return { hour: "12", minute: "00", period: "AM" };
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { hour: String(hour), minute: String(m ?? 0).padStart(2, "0"), period };
}

function to24(hour: string, minute: string, period: string) {
  let h = Number(hour) % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

function parseInput(text: string): string | null {
  const m = text.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{1,2}))?\s*([ap]m)?$/);
  if (!m) return null;
  let hour = Number(m[1]);
  let minute = m[2] ? Number(m[2]) : 0;
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  const ap = m[3] ?? (hour >= 8 ? "pm" : "am");
  if (ap === "pm" && hour !== 12) hour += 12;
  if (ap === "am" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function pct(index: number, count: number) {
  const angle = (index / count) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const r = 40;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
}

export function TimePickerField({
  label,
  value,
  onChange,
  min,
  error,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  min?: string;
  error?: string;
}) {
  const current12 = useMemo(() => to12(value), [value]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [text, setText] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [parseError, setParseError] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const displayed = value
    ? `${current12.hour}:${current12.minute} ${current12.period}`
    : "";

  const commit = (part: "hour" | "minute" | "period", val: string) => {
    const next = to24(
      part === "hour" ? val : current12.hour,
      part === "minute" ? val : current12.minute,
      part === "period" ? val : current12.period,
    );
    if (part !== "period" && min && next <= min) return;
    onChange(next);
    setEditing(false);
    setParseError("");
    if (part === "hour") setMode("minute");
    if (part === "period") setOpen(false);
  };

  const commitText = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setEditing(false);
      setParseError("");
      return;
    }
    const next = parseInput(trimmed);
    if (!next) {
      setParseError("Enter time like 9:30 am");
      setEditing(true);
      return;
    }
    if (min && next <= min) {
      setParseError("End time must be after start time");
      setEditing(true);
      return;
    }
    onChange(next);
    setEditing(false);
    setParseError("");
  };

  const isHourDisabled = (hour: string) => {
    if (!min || mode !== "hour") return false;
    return to24(hour, current12.minute, current12.period) <= min;
  };

  const isMinuteDisabled = (minute: string) => {
    if (!min || mode !== "minute") return false;
    return to24(current12.hour, minute, current12.period) <= min;
  };

  const options = mode === "hour" ? HOURS.map(String) : STEPS;
  const disabledCheck = mode === "hour" ? isHourDisabled : isMinuteDisabled;
  const selectedIndex = mode === "hour"
    ? options.indexOf(current12.hour)
    : options.indexOf(current12.minute);

  return (
    <div ref={wrapRef} className="space-y-1.5 relative">
      <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={editing ? text : displayed}
          placeholder="9:30 am"
          onClick={() => { setOpen(o => !o); setMode("hour"); }}
          onFocus={(e) => { setEditing(true); setText(displayed); e.target.select(); }}
          onChange={(e) => { setText(e.target.value); setParseError(""); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commitText(); }
            if (e.key === "Escape") { setEditing(false); setParseError(""); setOpen(false); }
            if (e.key === "Tab") { commitText(); setOpen(false); }
          }}
          onBlur={commitText}
          className={`w-full rounded-xl text-sm font-medium min-h-11 pl-4 pr-11 border transition-all outline-none cursor-pointer ${
            error || parseError
              ? "border-2 border-red-400/60 bg-red-500/5"
              : "border border-input-border bg-input focus:border-input-focus"
          }`}
          style={{ color: "var(--text-primary)" }}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setOpen(o => !o); if (!open) setMode("hour"); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-fg-muted hover:text-cyan-300 hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Open time picker"
        >
          <IoTimeOutline size={18} />
        </button>
      </div>
      {(error || parseError) && (
        <p className="text-xs text-red-400 pl-1">{parseError || error}</p>
      )}

      {open && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-30 left-1/2 -translate-x-1/2 mt-2 rounded-2xl p-4 w-[min(272px,calc(100vw-2rem))]"
          style={{
            background: "var(--bg-mid)",
            border: "1px solid var(--glass-border-strong)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header: readout + AM/PM */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <button
              type="button"
              onClick={() => setMode("hour")}
              className="flex-1 px-2 py-2 rounded-lg text-base font-bold cursor-pointer transition-all text-center"
              style={{
                color: "var(--text-primary)",
                background: mode === "hour" ? "var(--glass-bg-hover)" : "transparent",
              }}
            >
              {current12.hour}
            </button>
            <span className="text-xl font-bold text-cyan-300 leading-none">:</span>
            <button
              type="button"
              onClick={() => setMode("minute")}
              className="flex-1 px-2 py-2 rounded-lg text-base font-bold cursor-pointer transition-all text-center"
              style={{
                color: "var(--text-primary)",
                background: mode === "minute" ? "var(--glass-bg-hover)" : "transparent",
              }}
            >
              {current12.minute}
            </button>
            <div className="flex flex-col ml-2">
              <button
                type="button"
                onClick={() => commit("period", "AM")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  current12.period === "AM"
                    ? "bg-cyan-400/20 text-cyan-300"
                    : "text-fg-muted hover:bg-white/5"
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => commit("period", "PM")}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  current12.period === "PM"
                    ? "bg-cyan-400/20 text-cyan-300"
                    : "text-fg-muted hover:bg-white/5"
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Clock dial */}
          <div
            className="relative mx-auto rounded-full aspect-square border border-white/10"
            style={{ background: "var(--bg-surface)", borderColor: "var(--glass-border-strong)" }}
          >
            {options.map((opt, i) => {
              const pos = pct(i, options.length);
              const selected = i === selectedIndex;
              const disabled = disabledCheck(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() => commit(mode, opt)}
                  className="absolute flex items-center justify-center rounded-full font-bold transition-all cursor-pointer w-[15%] h-[15%] max-w-10 max-h-10 text-xs sm:text-sm"
                  style={{
                    left: `calc(${pos.x}% - 7.5%)`,
                    top: `calc(${pos.y}% - 7.5%)`,
                    background: selected
                      ? "var(--accent-aqua)"
                      : disabled
                        ? "transparent"
                        : "transparent",
                    color: selected
                      ? "white"
                      : disabled
                        ? "var(--text-muted)"
                        : "var(--text-primary)",
                    opacity: disabled ? 0.35 : 1,
                  }}
                >
                  {opt}
                </button>
              );
            })}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />
          </div>

          <p className="text-center mt-3 text-[10px] sm:text-[11px] text-fg-muted">
            {mode === "hour" ? "Select hour" : "Select minutes"}
          </p>
        </div>
      )}
    </div>
  );
}