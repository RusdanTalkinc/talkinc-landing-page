import React from "react";
import Link from "next/link";

export function Container({ children }) {
  return <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export function Section({ id, title, subtitle, children, className = "" }) {
  return (
    <section id={id} className={`py-10 sm:py-14 ${className}`}>
      <Container>
        {(title || subtitle) && (
          <div className="mb-8">
            {subtitle && <div className="text-xs tracking-widest uppercase text-slate-500 mb-2">{subtitle}</div>}
            {title && <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h2>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/40 bg-white/70 backdrop-blur shadow-lg ${className}`}>
      <div className="p-6">{children}</div>
    </div>
  );
}

export function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs font-semibold min-w-20">{children}</span>;
}

export function GradientButton({ href, children, variant = "primary" }) {
  const base = "inline-flex justify-center items-center rounded-xl px-5 py-3 font-semibold transition";
  const styles = variant === "primary" ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:brightness-95" : "border hover:bg-white/60";
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

export function CTAButtons({ mayarLink, adminWA }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-5">
      <GradientButton href={mayarLink}>Daftar & Bayar via Mayar</GradientButton>
      <GradientButton href={adminWA} variant="ghost">
        Konsultasi dengan Admin
      </GradientButton>
    </div>
  );
}

export function HeaderBar({ mayarLink }) {
  return (
    <div className="sticky top-0 z-30 border-b bg-white/60 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="font-extrabold tracking-tight">
            TALKINC <span className="text-slate-500"></span>
          </Link>
          {mayarLink ? (
            <a href={mayarLink} target="_blank" className="text-sm underline">
              Bayar via Mayar
            </a>
          ) : (
            <span />
          )}
        </div>
      </Container>
    </div>
  );
}

export function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
