"use client";
import React from "react";
import Image from "next/image";
import { ADMIN_WA, CONFIG } from "@/lib/config";
import { Badge, Card, CTAButtons, Field, HeaderBar, Section } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { fmtDate } from "@/lib/datetime";
import { ActivitiesCarousel, FacilitatorCarousel } from "@/components/carousel";
import { Timeline } from "@/components/timeline";
import { Extras } from "@/components/extras";
import AboutSection from "@/components/about";
/* import { ProgramSummary } from "@/components/ProgramSummary"; */
import { Testimonials } from "@/components/testimonials";
import { trackProgramView, trackScrollDepth } from "@/lib/analytics";

import dynamic from "next/dynamic";
// ganti import langsung:
const AudienceList = dynamic(() => import("@/components/audience").then((m) => m.AudienceList), { ssr: false });
const ProgramSummary = dynamic(() => import("@/components/ProgramSummary").then((m) => m.ProgramSummary), { ssr: false });

export function ProgramDetail({ slug }) {
  const handleMayarClick = React.useCallback(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", { value: 1, currency: "IDR" });
    }
  }, []);

  const handleAdminClick = React.useCallback(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact");
    }
  }, []);

  const program = CONFIG.programs.find((p) => p.slug === slug);
  React.useEffect(() => {
    if (!program) return;
    trackProgramView({ slug: program.slug, title: program.pageTitle });
  }, [program?.slug, program?.pageTitle]);

  React.useEffect(() => {
    if (!program) return;
    const thresholds = [25, 50, 75, 100];
    const triggered = new Set();

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const doc = document.documentElement;
      const body = document.body;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight, doc.offsetHeight, body.offsetHeight, doc.clientHeight);
      if (!scrollHeight) return;

      const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const viewportHeight = window.innerHeight || doc.clientHeight;
      const progress = ((scrollTop + viewportHeight) / scrollHeight) * 100;

      thresholds.forEach((threshold) => {
        if (progress >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          trackScrollDepth({ slug: program.slug, depth: threshold });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [program?.slug]);

  if (!program) return <div className="min-h-screen flex items-center justify-center">Program tidak ditemukan</div>;

  const { pageTitle, pageDescription, mayarLink, hero, problems, learn, audience, details, testimonialTitle, testimonials, batch, startDate } = program;

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

            <CTAButtons mayamayarLink={mayarLink} adminWA={ADMIN_WA} onMayarClick={handleMayarClick} onAdminClick={handleAdminClick} />
            <div className="mt-3 text-xs text-emerald-700 font-medium">
              <span className="flame" aria-hidden>
                🔥
              </span>{" "}
              Tersisa {details.seats_left} slot lagi — amankan kursi Anda.
            </div>
          </div>

          {/* Kartu ringkas hero-copy (opsional) */}
          <Card className="bg-linear-to-br from-indigo-500/10 to-fuchsia-500/10">
            <h3 className="text-xl font-bold">{hero.headline}</h3>
            <p className="text-slate-700">
              <span className="font-semibold"></span> {hero.subheadline}
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

      {/* About */}
      <Section title="">
        <AboutSection about={program.about} />
      </Section>
      {/* WHAT YOU'LL LEARN */}
      <Section title="Apa yang Akan Kamu Pelajari">
        <div>
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-white/70 backdrop-blur p-6 shadow">
              <h4 className="font-semibold mb-3">Encounter</h4>
              <Timeline items={learn.encounters || []} />
            </div>
          </div>
        </div>
      </Section>
      {/* Detail Program */}
      <Section>
        <Extras items={learn.extras || []} />
      </Section>

      {/* ACTIVITIES – Carousel */}
      <Section title="Aktivitas Kelas">
        <ActivitiesCarousel images={CONFIG.activities} />
      </Section>

      {/* AUDIENCE */}
      <Section title="Program Ini Cocok Untuk Siapa?">
        <AudienceList items={audience || []} />
      </Section>

      {/* DETAILS & INVESTMENT */}
      <Section title="Detail Program & Nilai Investasi">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Summary Program */}
          <Card className="md:col-span-2">
            <div className="grid sm:grid-cols-2 gap-3 space-y-3 summary-animate">
              <ProgramSummary items={program.summary} />
            </div>
          </Card>

          {/* Investasi */}
          <Card>
            <div className="text-sm text-slate-500">Investasi</div>
            {/* Harga: coret harga normal + tampilkan harga diskon */}
            <div className="mt-1">
              <div className="text-sm text-slate-400 line-through">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(details.normalPrice)}</div>
              <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-fuchsia-600">
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

            <CTAButtons mayarLink={mayarLink} adminWA={ADMIN_WA} onMayarClick={handleMayarClick} onAdminClick={handleAdminClick} />
          </Card>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      {testimonialTitle && testimonials?.length > 0 && (
        <Section title={testimonialTitle}>
          <Testimonials items={testimonials} />
        </Section>
      )}

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
        <Card className="text-center bg-linear-to-br from-indigo-500/10 to-fuchsia-500/10">
          <h3 className="text-2xl font-bold">Siap naik level komunikasi?</h3>
          <p className="text-slate-600 mt-1">Daftar sekarang atau konsultasi dengan admin untuk pilih program yang pas.</p>
          <CTAButtons mayarLink={mayarLink} adminWA={ADMIN_WA} onMayarClick={handleMayarClick} onAdminClick={handleAdminClick} />
        </Card>
      </Section>

      <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} TALKINC</footer>
    </div>
  );
}
