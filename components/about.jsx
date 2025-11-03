import React from "react";

/** Inline icon (biar stabil di SSR, tidak pakai emoji) */
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-600" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

/** Section Tentang Kelas */
export default function AboutSection({ about }) {
  const desc = about?.description || "Deskripsi belum tersedia. Silakan hubungi admin untuk detail program.";

  const points = Array.isArray(about?.differentiators) ? about.differentiators : [];

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Judul */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Tentang Kelas</h2>
        </div>

        {/* Grid 2 kolom */}
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Deskripsi (kolom kiri) */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur p-6 shadow">
              <p className="text-slate-700 leading-relaxed">{desc}</p>

              {/* Aksen kecil */}
              <div className="mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-indigo-500/60 via-fuchsia-500/60 to-rose-500/60" />
            </div>
          </div>

          {/* Poin pembeda (kolom kanan) */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur p-6 shadow">
              <h3 className="font-semibold mb-3">Apa yang Membuat Program Ini Berbeda</h3>

              <ul className="space-y-3">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex items-center justify-center rounded-md bg-emerald-50 ring-1 ring-emerald-100 p-1">
                      <CheckIcon />
                    </span>
                    <span className="text-slate-700">{p}</span>
                  </li>
                ))}

                {/* Fallback bila belum ada poin */}
                {points.length === 0 && <li className="text-slate-500 text-sm">Poin pembeda akan ditambahkan segera.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Strip info singkat (opsional, bisa hapus kalau tak perlu) */}
        {/*         <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Fokus", value: "Kepercayaan diri & struktur pesan" },
            { label: "Pendekatan", value: "Praktikal, coaching, feedback" },
            { label: "Outcome", value: "Presence kuat & komunikasi efektif" },
          ].map((x, i) => (
            <div key={i} className="rounded-xl border border-white/40 bg-white/70 backdrop-blur px-4 py-3 shadow">
              <div className="text-xs uppercase tracking-wide text-slate-500">{x.label}</div>
              <div className="font-medium text-slate-800">{x.value}</div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
