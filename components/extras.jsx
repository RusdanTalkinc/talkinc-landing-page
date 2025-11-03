"use client";
import React from "react";

export function Extras({ items = [] }) {
  const list = items.map((i) => (typeof i === "string" ? { icon: "•", title: i } : i));

  return (
    <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((x, i) => (
        <div key={i} className="relative flex flex-col min-w-0 rounded-2xl border bg-white/70 p-5 shadow">
          <div className="flex items-start gap-3 min-w-0">
            <span aria-hidden className="size-12 grid place-items-center rounded-2xl border ring-1 ring-slate-200 text-2xl">
              {x.icon || "•"}
            </span>
            <div className="min-w-0">
              <div className="font-semibold break-words">{x.title}</div>
              {x.desc && <div className="text-sm text-slate-600 mt-1 break-words">{x.desc}</div>}
            </div>
          </div>
          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-indigo-500/60 via-fuchsia-500/60 to-rose-500/60" />
        </div>
      ))}
    </div>
  );
}
