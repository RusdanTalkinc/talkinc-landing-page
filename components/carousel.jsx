"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

/* ==== Utils: Normalize Local Image Path ==== */
function normalizeSrc(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src; // external URL
  return src.startsWith("/") ? src : `/${src}`; // force / prefix for local
}

/* ==== SafeImage wrapper (fix for Vercel + fallback) ==== */
function SafeImage({ src, alt, width, height, className, priority = false, unoptimized = false }) {
  const safe = normalizeSrc(src) || "/placeholder.jpg"; // optional fallback

  return (
    <Image
      src={safe}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={unoptimized} // ✅ Forward unoptimized to Next/Image
    />
  );
}

/* ==== Carousel scrolling logic ==== */
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

/* ==== Activities Carousel ==== */
export function ActivitiesCarousel({ images = [] }) {
  const { ref, canPrev, canNext, scrollBy } = useCarouselScroll();
  const list = useMemo(() => images.map(normalizeSrc).filter(Boolean), [images]);

  // Optional keyboard navigation
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
      {/* gradient edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent" />

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3" style={{ scrollPadding: "1rem" }}>
        {list.map((src, i) => (
          <div key={src + i} className="min-w-[80%] md:min-w-[45%] lg:min-w-[32%] snap-start">
            <SafeImage
              src={src}
              width={1280}
              height={720}
              alt={`Activity ${i + 1}`}
              className="w-full h-56 md:h-72 object-cover rounded-2xl border"
              priority={i === 0}
              unoptimized // ✅ apply here
            />
          </div>
        ))}
      </div>

      {/* nav buttons */}
      <button onClick={() => scrollBy(-400)} disabled={!canPrev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 backdrop-blur px-3 py-2 shadow disabled:opacity-30">
        ‹
      </button>
      <button onClick={() => scrollBy(400)} disabled={!canNext} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 backdrop-blur px-3 py-2 shadow disabled:opacity-30">
        ›
      </button>
    </div>
  );
}

/* ==== Facilitator Carousel ==== */
export function FacilitatorCarousel({ people = [] }) {
  const { ref, canPrev, canNext, scrollBy } = useCarouselScroll();

  const list = useMemo(
    () =>
      people.map((p) => ({
        ...p,
        photo: normalizeSrc(p.photo),
      })),
    [people]
  );

  return (
    <div className="relative">
      {/* gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent" />

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3" style={{ scrollPadding: "1rem" }}>
        {list.map((p, i) => (
          <div key={p.name + i} className="min-w-[85%] md:min-w-[48%] lg:min-w-[32%] snap-start">
            <div className="rounded-2xl border bg-white/80 backdrop-blur shadow p-4">
              <div className="flex items-center gap-4">
                <SafeImage
                  src={p.photo}
                  width={96}
                  height={96}
                  alt={p.name}
                  className="w-24 h-24 rounded-xl object-cover border"
                  priority={i < 2}
                  unoptimized // ✅ apply here
                />
                <div>
                  <div className="font-bold">{p.name}</div>
                  {p.title && <div className="text-sm text-slate-500">{p.title}</div>}
                  {p.badge && <span className="mt-1 inline-block text-xs font-semibold border rounded-full px-2 py-0.5 bg-white/70">{p.badge}</span>}
                </div>
              </div>
              {p.bio && <p className="text-sm text-slate-700 mt-3">{p.bio}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* nav buttons */}
      <button onClick={() => scrollBy(-400)} disabled={!canPrev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 backdrop-blur px-3 py-2 shadow disabled:opacity-30">
        ‹
      </button>
      <button onClick={() => scrollBy(400)} disabled={!canNext} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 backdrop-blur px-3 py-2 shadow disabled:opacity-30">
        ›
      </button>
    </div>
  );
}
