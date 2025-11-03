"use client";
import React from "react";

export function AudienceList({ items = [] }) {
  // Jangan mutate. Normalisasi ke array baru.
  const list = Array.isArray(items) ? items.map((it) => (typeof it === "string" ? { icon: "•", title: it } : it)) : [];

  return (
    <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((a, i) => (
        <div
          key={a.title || a.text || `${a.icon}-${i}`} // key stabil
          className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-5 shadow
                     hover:shadow-md transition flex gap-3"
        >
          <span
            aria-hidden
            className="mt-0.5 inline-grid place-items-center size-8 shrink-0 rounded-lg
                       border bg-white/90 ring-1 ring-slate-200 text-lg"
          >
            {a.icon || "•"}
          </span>

          <div className="min-w-0">
            <div className="font-bold text-slate-900 leading-snug break-words">{a.title || a.text}</div>
            {a.desc && <p className="mt-2 text-slate-600 text-sm leading-relaxed break-words">{a.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
