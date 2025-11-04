"use client";
import React, { useEffect, useMemo, useState } from "react";

/* ===== Utils ===== */
const pad = (n) => String(n).padStart(2, "0");

// Parser fleksibel + default WIB (+07:00)
function parseStart(startISO) {
  if (!startISO || typeof startISO !== "string") return NaN;
  const s = startISO.trim();

  const dmY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // DD/MM/YYYY
  if (dmY) {
    const [, d, m, y] = dmY;
    return Date.parse(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T00:00:00+07:00`);
  }

  const yMd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/); // YYYY-MM-DD
  if (yMd) return Date.parse(`${s}T00:00:00+07:00`);

  const t = Date.parse(s); // ISO lengkap
  return Number.isNaN(t) ? NaN : t;
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function useCountdown(targetStr, enabled) {
  const targetMs = useMemo(() => parseStart(targetStr), [targetStr]);
  const [now, setNow] = useState(() => 0); // 0 saat SSR → tidak dipakai
  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now()); // set awal setelah mounted
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled]);

  if (Number.isNaN(targetMs)) return { state: "invalid", d: 0, h: 0, m: 0, s: 0, targetMs: null };
  if (!enabled) return { state: "idle", d: 0, h: 0, m: 0, s: 0, targetMs }; // belum mounted → jangan render dinamis

  const diff = targetMs - now;
  if (diff <= 0) return { state: "live", d: 0, h: 0, m: 0, s: 0, targetMs };

  const sec = Math.floor(diff / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return { state: "counting", d, h, m, s, targetMs };
}

/* ===== UI subcomponents ===== */
function Badge({ children }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-700">{children}</span>;
}

function Chip({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/80 ring-1 ring-slate-200 shadow-sm px-3 py-2 min-w-[68px] backdrop-blur">
      <div className="font-mono tabular-nums text-3xl md:text-4xl font-black tracking-tight" suppressHydrationWarning>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

/* ===== Main ===== */
export function Countdown({ startISO, title = "Kelas mulai dalam" }) {
  const mounted = useMounted();
  const { state, d, h, m, s, targetMs } = useCountdown(startISO, mounted);

  // Format tanggal setelah mounted saja → cegah mismatch
  const startLabel = useMemo(() => {
    if (!mounted || !targetMs) return null;
    try {
      const dt = new Date(targetMs);
      const opts = {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      };
      return new Intl.DateTimeFormat("id-ID", opts).format(dt).replace(".", ":");
    } catch {
      return null;
    }
  }, [mounted, targetMs]);

  // State invalid (tanggal tidak terbaca)
  if (state === "invalid" && mounted) {
    return (
      <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-rose-700">
        <span>⚠️</span>
        <span className="text-sm">
          Tanggal mulai tidak valid. Periksa <code>startDate</code> di config.
        </span>
      </div>
    );
  }

  return (
    <div className="relative mt-5 w-full">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 blur-[2px]" />

      <div className="relative rounded-2xl border border-emerald-200/70 bg-white/80 backdrop-blur shadow-lg px-4 py-4 md:px-6 md:py-5">
        {/* Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {state === "live" ? (
            <h4 className="text-sm md:text-base font-semibold text-slate-800 flex items-center gap-2">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600" />
              </span>
              Sedang berlangsung
            </h4>
          ) : (
            <h4 className="text-sm md:text-base font-semibold text-slate-800 flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {title}
            </h4>
          )}

          {/* Badge tanggal (muncul setelah mount) */}
          {startLabel && <Badge>🗓️ Mulai: {startLabel} WIB</Badge>}
        </div>

        {/* Body */}
        {mounted && state === "counting" ? (
          <div className="flex items-stretch gap-2 md:gap-3">
            <Chip label="hari" value={pad(d)} />
            <Chip label="jam" value={pad(h)} />
            <Chip label="menit" value={pad(m)} />
            <Chip label="detik" value={pad(s)} />
          </div>
        ) : mounted && state === "live" ? (
          <div className="rounded-xl bg-emerald-50/60 ring-1 ring-emerald-200 inline-flex items-center gap-2 px-3 py-2 text-emerald-800">
            <span>📣</span>
            <span className="text-sm font-semibold">Yuk amankan kursi sekarang—kelas sedang berjalan!</span>
          </div>
        ) : (
          // Skeleton saat SSR / sebelum mounted → aman dari mismatch
          <div className="flex items-stretch gap-2 md:gap-3">
            {["hari", "jam", "menit", "detik"].map((lbl) => (
              <div key={lbl} className="flex flex-col items-center justify-center rounded-2xl bg-white/60 ring-1 ring-slate-200 px-3 py-2 min-w-[68px]">
                <div className="h-8 md:h-10 w-12 md:w-16 rounded-md bg-slate-200 animate-pulse" />
                <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">{lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* Shimmer bar */}
        <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-[shimmer_1.8s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" style={{ transform: "translateX(-100%)" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
