"use client";
import React from "react";

export function Timeline({ items = [] }) {
  return (
    <ol className="relative ml-4 border-s-2 border-slate-200">
      {items.map((it, i) => (
        <li key={i} className="ms-6 pb-6 group">
          {/* Node */}
          <span className="absolute -start-2.5 mt-1 size-5 rounded-full border-2 border-white bg-linear-to-br from-indigo-500 to-fuchsia-500 shadow group-hover:scale-105 transition-transform"></span>

          {/* Index badge / date */}
          <div className="flex items-center gap-2">
            <span className="inline-flex min-w-25 justify-center rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold border">{it.date || `#${String(i + 1).padStart(2, "0")}`}</span>
            <h4 className="text-base sm:text-lg font-bold leading-snug">{it.title}</h4>
          </div>

          {/* Content */}
          {it.desc && <p className="mt-1 text-sm text-slate-600">{it.desc}</p>}
        </li>
      ))}
    </ol>
  );
}
