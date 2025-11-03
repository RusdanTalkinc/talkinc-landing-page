"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

/* ==== Utils: Normalize Local Image Path ==== */
function normalizeSrc(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src; // external URL
  return src.startsWith("/") ? src : `/${src}`; // force / for local
}

/* ==== SafeImage wrapper ==== */
function SafeImage({ src, alt, width, height, className, priority = false, unoptimized = false }) {
  const safe = normalizeSrc(src) || "/placeholder.jpg";
  return <Image src={safe} alt={alt} width={width} height={height} className={className} priority={priority} unoptimized={unoptimized} />;
}

/* ==== Gesture drag (mouse + touch) ==== */
function useSwipeScroll({ onInteractChange } = {}) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startDrag = (e) => {
      isDragging.current = true;
      el.classList.add("cursor-grabbing");
      startX.current = e.pageX || e.touches?.[0]?.pageX || 0;
      scrollLeft.current = el.scrollLeft;
      onInteractChange?.(true);
    };

    const stopDrag = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      el.classList.remove("cursor-grabbing");
      setTimeout(() => onInteractChange?.(false), 150);
    };

    const onMove = (e) => {
      if (!isDragging.current) return;
      const x = e.pageX || e.touches?.[0]?.pageX || 0;
      const walk = (x - startX.current) * 1.2;
      el.scrollLeft = scrollLeft.current - walk;
    };

    // mouse
    el.addEventListener("mousedown", startDrag);
    el.addEventListener("mouseup", stopDrag);
    el.addEventListener("mouseleave", stopDrag);
    el.addEventListener("mousemove", onMove);

    // touch
    el.addEventListener("touchstart", startDrag, { passive: true });
    el.addEventListener("touchend", stopDrag, { passive: true });
    el.addEventListener("touchcancel", stopDrag, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      el.removeEventListener("mousedown", startDrag);
      el.removeEventListener("mouseup", stopDrag);
      el.removeEventListener("mouseleave", stopDrag);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchstart", startDrag);
      el.removeEventListener("touchend", stopDrag);
      el.removeEventListener("touchcancel", stopDrag);
      el.removeEventListener("touchmove", onMove);
    };
  }, [onInteractChange]);

  return { ref };
}

/* ==== Active index + jump (untuk dots) ==== */
function useActiveIndex(ref, deps = []) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const slides = Array.from(el.children);
    if (!slides.length) return;

    const update = () => {
      const { scrollLeft } = el;
      let idx = 0,
        best = Infinity;
      for (let i = 0; i < slides.length; i++) {
        const left = slides[i].offsetLeft;
        const d = Math.abs(left - scrollLeft);
        if (d < best) {
          best = d;
          idx = i;
        }
      }
      setActive(idx);
    };

    update();
    const onScroll = () => update();
    const ro = new ResizeObserver(update);
    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const jumpTo = (index) => {
    const el = ref.current;
    if (!el) return;
    const slides = Array.from(el.children);
    const target = slides[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  return { active, jumpTo };
}

/* ==== Activities Carousel (no autoslide) ==== */
export function ActivitiesCarousel({ images = [] /* interval ignored */ }) {
  const { ref } = useSwipeScroll();
  const list = useMemo(() => images.map(normalizeSrc).filter(Boolean), [images]);
  const { active, jumpTo } = useActiveIndex(ref, [list.length]);

  return (
    <div className="relative">
      {/* gradient edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent" />

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 cursor-grab" style={{ scrollPadding: "1rem" }} aria-label="Galeri aktivitas">
        {list.map((src, i) => (
          <div key={src + i} className="min-w-[80%] md:min-w-[45%] lg:min-w-[32%] snap-start">
            <SafeImage src={src} width={1280} height={720} alt={`Activity ${i + 1}`} className="w-full h-56 md:h-72 object-cover rounded-2xl border" priority={i === 0} unoptimized />
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {list.map((_, i) => (
          <button key={i} onClick={() => jumpTo(i)} aria-label={`Ke slide ${i + 1}`} className={`h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-slate-900" : "w-2.5 bg-slate-300"}`} />
        ))}
      </div>
    </div>
  );
}

/* ==== Facilitator Carousel (no autoslide) ==== */
export function FacilitatorCarousel({ people = [] /* interval ignored */ }) {
  const { ref } = useSwipeScroll();
  const list = useMemo(() => people.map((p) => ({ ...p, photo: normalizeSrc(p.photo) })), [people]);
  const { active, jumpTo } = useActiveIndex(ref, [list.length]);

  return (
    <div className="relative">
      {/* gradient edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent" />

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 cursor-grab" style={{ scrollPadding: "1rem" }} aria-label="Carousel fasilitator">
        {list.map((p, i) => (
          <div key={p.name + i} className="min-w-[85%] md:min-w-[48%] lg:min-w-[32%] snap-start">
            <div className="rounded-2xl border bg-white/80 backdrop-blur shadow p-4">
              <div className="flex items-center gap-4">
                <SafeImage src={p.photo} width={96} height={96} alt={p.name} className="w-24 h-24 rounded-xl object-cover border" priority={i < 2} unoptimized />
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

      {/* dots */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {list.map((_, i) => (
          <button key={i} onClick={() => jumpTo(i)} aria-label={`Ke slide ${i + 1}`} className={`h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-slate-900" : "w-2.5 bg-slate-300"}`} />
        ))}
      </div>
    </div>
  );
}
