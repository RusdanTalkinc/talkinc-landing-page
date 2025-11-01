import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { Badge, Section } from "@/components/ui";
import { fmtDate } from "@/lib/datetime";
import Image from "next/image";


export default function HomePage() {
  const { brand, tagline } = CONFIG.site;

  return (
    <div className="min-h-screen">
      <Section>
        <div className="flex flex-col items-center text-center gap-4">
          <Image
            src="/talkinc.png"
            width={96}
            height={96}
            alt="Talkinc Logo"
            className="rounded-xl shadow-lg"
            priority
          />

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{brand}</h1>
          <p className="text-slate-600 max-w-2xl">{tagline}</p>
        </div>
      </Section>

      <Section className="pt-0" subtitle="Pilih Program">
        <div className="mx-auto max-w-3xl flex flex-col gap-4">
          {CONFIG.programs.map((p) => (
            <Link
              key={p.slug}
              href={`/program/${p.slug}`}
              className="group rounded-2xl border border-white/40 bg-white/70 backdrop-blur p-5 shadow hover:shadow-xl transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.color} shadow-md`} />
                <div className="flex-1 text-left">
                  <div className="text-lg sm:text-xl font-bold tracking-tight group-hover:underline">
                    {p.pageTitle}
                  </div>
                  <div className="text-sm text-slate-600 line-clamp-2">{p.pageDescription}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <Badge>{p.batch}</Badge>
                    <span>Mulai: {fmtDate(p.startDate)}</span>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600">→</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} TALKINC
      </footer>
    </div>
  );
}
