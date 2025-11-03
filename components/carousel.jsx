"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

/* ==== Utils ==== */
function normalizeSrc(src) {
  if (!src) return null;
  // Jika sudah absolute (http/https) biarkan, kalau relatif tambahkan leading slash.
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

function SafeImage({ src, alt, width, height, className, priority = false }) {
  const safe = normalizeSrc(src) || "/placeholder.jpg"; // siapkan placeholder di public/placeholder.jpg jika perlu
  return (
    <Image
      src={safe}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      // Jika masih ada kasus 400 di optimizer, sementara bisa aktifkan:
      // unoptimized
    />
  );
}

function useCarouselScroll() {
  const ref = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = () => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxLeft = scrollWidth - clientWidth;
    setCanPrev(scrollLeft > 0);
    setCanNext(scrollLeft < maxLeft - 1);
  };

  useEffect(() => {
    updateEdges();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollBy = (dx) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  return { ref, canPrev, canNext, scrollBy };
}

/* ==== Activities ==== */
export function ActivitiesCarousel({ images = [] }) {
  const { ref, canPrev, canNext, scrollBy } = useCarouselScroll();
  const list = useMemo(() => images.map(normalizeSrc).filter(Boolean), [images]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") scrollBy(-400);
      if (e.key === "ArrowRight") scrollBy(400);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      {/* gradient edge hint */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/90 to-transparent rounded-l-2xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/90 to-transparent rounded-r-2xl" />

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2" style={{ scrollPadding: "1rem" }} aria-label="Galeri aktivitas">
        {list.map((src, i) => (
          <div key={src + i} className="min-w-[80%] md:min-w-[45%] lg:min-w-[32%] snap-start">
            <SafeImage src={src} width={1280} height={720} alt={`Activity ${i + 1}`} className="w-full h-56 md:h-72 object-cover rounded-2xl border" priority={i < 1} />
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <button
        type="button"
        onClick={() => scrollBy(-400)}
        disabled={!canPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md disabled:opacity-40"
        aria-label="Sebelumnya"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy(400)}
        disabled={!canNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md disabled:opacity-40"
        aria-label="Berikutnya"
      >
        ›
      </button>
    </div>
  );
}

/* ==== Facilitators ==== */
export function FacilitatorCarousel({ people = [] }) {
  const { ref, canPrev, canNext, scrollBy } = useCarouselScroll();
  const list = useMemo(
    () =>
      people.map((p) => ({
        ...p,
        photo: normalizeSrc(p?.photo),
      })),
    [people]
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/90 to-transparent rounded-l-2xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/90 to-transparent rounded-r-2xl" />

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2" style={{ scrollPadding: "1rem" }} aria-label="Carousel fasilitator">
        {list.map((p, i) => (
          <div key={(p.name || "person") + i} className="min-w-[85%] md:min-w-[48%] lg:min-w-[32%] snap-start">
            <div className="rounded-2xl border bg-white/80 backdrop-blur shadow p-4">
              <div className="flex items-center gap-4">
                <SafeImage src={p.photo} width={96} height={96} alt={p.name || "Facilitator"} className="w-24 h-24 rounded-xl object-cover border" priority={i < 2} />
                <div className="min-w-0">
                  <div className="font-bold leading-tight">{p.name}</div>
                  {p.title && <div className="text-sm text-slate-500">{p.title}</div>}
                  {p.badge && <span className="mt-1 inline-block text-xs font-semibold border rounded-full px-2 py-0.5 bg-white/70">{p.badge}</span>}
                </div>
              </div>
              {p.bio && <p className="text-sm text-slate-700 mt-3">{p.bio}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <button
        type="button"
        onClick={() => scrollBy(-400)}
        disabled={!canPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md disabled:opacity-40"
        aria-label="Sebelumnya"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy(400)}
        disabled={!canNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md disabled:opacity-40"
        aria-label="Berikutnya"
      >
        ›
      </button>
    </div>
  );
}
