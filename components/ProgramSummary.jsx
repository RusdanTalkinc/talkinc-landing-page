"use client";
import React, { useEffect, useState } from "react";

export function ProgramSummary({ items = [] }) {
  // Hindari mismatch: render hanya setelah mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Normalisasi tanpa mutasi
  const list = Array.isArray(items) ? items.map((i) => (typeof i === "string" ? { icon: "•", title: i, desc: "" } : i)) : [];

  if (!mounted) {
    // (opsional) skeleton kecil saat SSR
    return (
      <div className="space-y-3" suppressHydrationWarning>
        {list.slice(0, 3).map((_, i) => (
          <div key={i} className="h-16 rounded-xl border bg-white/70 backdrop-blur" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3" suppressHydrationWarning>
      {list.map((x, i) => (
        <div
          key={x.title || `${x.icon}-${i}`} // key stabil
          className="flex gap-3 rounded-xl border bg-white/80 backdrop-blur p-4 
                     shadow-sm hover:shadow transition"
        >
          <span
            aria-hidden
            className="shrink-0 size-10 grid place-items-center rounded-lg 
                       border bg-white text-lg ring-1 ring-slate-200"
          >
            {x.icon ?? "•"}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 leading-tight break-words">{x.title}</div>
            {x.desc && <div className="text-sm text-slate-600 mt-0.5 leading-relaxed break-words">{x.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
