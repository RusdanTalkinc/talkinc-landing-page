"use client";
import Image from "next/image";
import React from "react";

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label={`${n} stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

// kartu testimonial (dipakai grid & carousel)
function TestiCard({ t }) {
  const initial = t?.name?.[0]?.toUpperCase?.() || "A";
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-white/50 bg-white/80 backdrop-blur p-5 shadow hover:shadow-md transition">
      {/* Header: avatar + nama + role + rating */}
      <div className="flex items-center gap-3">
        {t.avatar ? (
          <Image src={t.avatar} width={44} height={44} alt={t.name} className="size-11 rounded-full object-cover border" />
        ) : (
          <div className="size-11 rounded-full grid place-items-center border bg-linear-to-br from-indigo-50 to-fuchsia-50 font-bold">{initial}</div>
        )}
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{t.name}</div>
          {t.role && <div className="text-xs text-slate-500">{t.role}</div>}
        </div>
        <div className="ms-auto">
          <Stars n={t.rating ?? 5} />
        </div>
      </div>

      {/* Quote */}
      <blockquote className="mt-3 text-slate-700 leading-relaxed">“{t.quote}”</blockquote>

      {/* Accent line */}
      <div className="mt-4 h-[3px] w-20 rounded-full bg-linear-to-r from-indigo-500/60 via-fuchsia-500/60 to-rose-500/60" />
    </figure>
  );
}

/** Grid versi desktop + auto-snap carousel di mobile */
export function Testimonials({ items = [] }) {
  if (!items?.length) return null;

  return (
    <div>
      {/* Mobile: horizontal scroll-snap */}
      <div className="md:hidden relative">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          {items.map((t, i) => (
            <div key={i} className="min-w-[85%] snap-start">
              <TestiCard t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: responsive grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t, i) => (
          <TestiCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}
