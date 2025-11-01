"use client";
import React, { useEffect, useMemo, useState } from "react";

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    if (!targetISO) return { over: false, d: 0, h: 0, m: 0, s: 0 };
    const target = new Date(targetISO);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { over: true, d: 0, h: 0, m: 0, s: 0 };
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { over: false, d, h, m, s };
  }, [targetISO, now]);
}

export function Countdown({ startISO }) {
  const { over, d, h, m, s } = useCountdown(startISO);
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2">
      {over ? (
        <span className="font-semibold">Sedang/Telah berlangsung</span>
      ) : (
        <>
          <span className="text-sm text-slate-500">Kelas mulai dalam</span>
          <span className="font-mono font-bold">
            {d}h {h}j {m}m {s}d
          </span>
        </>
      )}
    </div>
  );
}
