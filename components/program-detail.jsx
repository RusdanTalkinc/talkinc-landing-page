"use client";
import React from "react";
import Image from "next/image";
import { ADMIN_WA, CONFIG } from "@/lib/config";
import { Badge, Card, CTAButtons, Field, HeaderBar, Section } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { fmtDate } from "@/lib/datetime";
import { ActivitiesCarousel, FacilitatorCarousel } from "@/components/carousel";
import { Timeline } from "@/components/timeline";

export function ProgramDetail({ slug }) {
  const program = CONFIG.programs.find((p) => p.slug === slug);
  if (!program) return <div className="min-h-screen flex items-center justify-center">Program tidak ditemukan</div>;

  const { pageTitle, pageDescription, mayarLink, hero, problems, about, learn, audience, details, testimonials, batch, startDate } = program;

  return (
    <div className="min-h-screen">
      <HeaderBar mayarLink={mayarLink} />

      {/* HERO */}
      <Section className="pt-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge>{batch}</Badge>
              <span className="text-xs text-slate-500">Mulai: {fmtDate(startDate)}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight">{pageTitle}</h1>
            <p className="mt-3 text-slate-600">{pageDescription}</p>

            <div className="mt-4">
              <Countdown startISO={startDate} />
            </div>

            <CTAButtons mayarLink={mayarLink} adminWA={ADMIN_WA} />
            <div className="mt-3 text-xs text-emerald-700 font-medium">
              <span className="flame" aria-hidden>
                🔥
              </span>{" "}
              Tersisa {details.seats_left} slot lagi — amankan kursi Anda.
            </div>
          </div>

          {/* Kartu ringkas hero-copy (opsional) */}
          <Card className="bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10">
            <h3 className="text-xl font-bold">Ubah Gugup Jadi Percaya Diri</h3>
            <p className="mt-2 text-slate-700">
              <span className="font-semibold">Headline:</span> {hero.headline}
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Subheadline:</span> {hero.subheadline}
            </p>
          </Card>
        </div>
      </Section>

      {/* PROBLEMS */}
      <Section>
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur p-6">
          <h3 className="text-[20px] font-bold mb-3">Apakah Kamu Pernah Merasakan Ini?</h3>

          {/* List masalah */}
          <div className="grid sm:grid-cols-2 gap-3">
            {(problems || []).map((p, i) => {
              const isObj = typeof p === "object" && p !== null;
              const icon = isObj ? p.icon : "•";
              const title = isObj ? p.title : p;
              const desc = isObj ? p.desc : "";
              return (
                <div key={i} className="rounded-xl border bg-white/70 p-4 flex gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="font-semibold">{title}</div>
                    {desc ? <div className="text-sm text-slate-500">{desc}</div> : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accordion Insight Mikro */}
          <div className="pi-acc mt-4 rounded-xl border border-slate-200/80">
            <details>
              <summary>
                <span aria-hidden="true">💡</span>
                {program.insight.title}
                <span className="hint" aria-hidden="true"></span>
                <span className="chev">›</span>
              </summary>

              <div className="pi-panel">
                <p className="text-slate-700">{program.insight.description}</p>

                <ul className="mt-3 space-y-3">
                  {program.insight.reasons.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="pi-ic">{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <br />
                        {item.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </Section>

      {/* FACILITATORS – Carousel, dengan badge & bio */}
      <Section title="Fasilitator">
        <FacilitatorCarousel people={CONFIG.facilitators} />
      </Section>

      {/* WHAT YOU'LL LEARN */}
      <Section title="Apa yang Akan Kamu Pelajari">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-white/70 backdrop-blur p-6 shadow">
              <h4 className="font-semibold mb-3">Encounter</h4>
              <Timeline items={learn.encounters || []} />
            </div>
          </div>

          <Card>
            <h4 className="font-semibold">Format Pembelajaran</h4>
            <ul className="mt-2 list-disc ml-5 space-y-1 text-slate-700">
              {(learn.format || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h4 className="font-semibold">Benefit</h4>
            <ul className="mt-2 list-disc ml-5 space-y-1 text-slate-700">
              {(learn.benefits || []).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* ACTIVITIES – Carousel */}
      <Section title="Aktivitas Kelas">
        <ActivitiesCarousel images={CONFIG.activities} />
      </Section>

      {/* AUDIENCE */}
      <Section title="Program Ini Cocok Untuk Siapa?">
        <Card>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            {audience.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Card>
      </Section>

      {/* DETAILS & INVESTMENT */}
      <Section title="Detail Program & Nilai Investasi">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <Card className="md:col-span-2">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-700">
              <Field label="Format kelas" value={details.format} />
              <Field label="Durasi" value={details.duration} />
              <Field label="Kapasitas" value={details.capacity} />
              <Field label="Level" value={details.level} />
              <Field label="Lokasi" value={details.location} />
              <Field label="Jadwal" value={details.schedule} />
              <Field label="Waktu" value={details.time} />
            </div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Investasi</div>

            {/* Harga: coret harga normal + tampilkan harga diskon */}
            <div className="mt-1">
              <div className="text-sm text-slate-400 line-through">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(details.normalPrice)}</div>
              <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(details.discountPrice)}
              </div>
              {/* Badge hemat */}
              {details.normalPrice > details.discountPrice && (
                <div className="mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold bg-white/70">Hemat {Math.round(((details.normalPrice - details.discountPrice) / details.normalPrice) * 100)}%</div>
              )}
            </div>

            {/* Teks urgensi + efek api */}
            <div className="mt-3 text-sm font-medium flex items-center gap-2">
              <span className="flame" aria-hidden>
                🔥
              </span>
              <span className="text-emerald-700">Tersisa {details.seats_left} slot lagi — amankan kursi Anda.</span>
            </div>

            <CTAButtons mayarLink={mayarLink} adminWA={ADMIN_WA} />
          </Card>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title="Apa Kata Alumni?">
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <p className="text-slate-700">“{t.text}”</p>
              <div className="mt-2 text-sm text-slate-500">— {t.name}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* LOGOS */}
      <Section title="Dipercaya oleh Profesional dari Berbagai Perusahaan">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
          {CONFIG.trustedLogos.map((l, i) => (
            <div key={i} className="flex justify-center items-center">
              <Image src={l} width={140} height={48} alt={`logo-${i}`} className="max-h-12 object-contain opacity-80 hover:opacity-100 hover:grayscale-0 transition" />
            </div>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <Card className="text-center bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10">
          <h3 className="text-2xl font-bold">Siap naik level komunikasi?</h3>
          <p className="text-slate-600 mt-1">Daftar sekarang atau konsultasi dengan admin untuk pilih program yang pas.</p>
          <CTAButtons mayarLink={mayarLink} adminWA={ADMIN_WA} />
        </Card>
      </Section>

      <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} TALKINC</footer>
    </div>
  );
}
