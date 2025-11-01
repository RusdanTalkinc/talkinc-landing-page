"use client";
import React, { useRef } from "react";
import Image from "next/image";

function useCarouselScroll() {
  const ref = useRef(null);
  const scrollBy = (dx) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dx, behavior: "smooth" });
  };
  return { ref, scrollBy };
}

export function ActivitiesCarousel({ images }) {
  const { ref, scrollBy } = useCarouselScroll();
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2" style={{ scrollPadding: "1rem" }}>
        {images.map((src, i) => (
          <div key={i} className="min-w-[80%] md:min-w-[45%] lg:min-w-[32%] snap-start">
            <Image src={src} width={800} height={500} alt={`Activity ${i + 1}`} className="w-full h-56 md:h-72 object-cover rounded-2xl" />
          </div>
        ))}
      </div>
      {/* Nav buttons */}
      <button type="button" onClick={() => scrollBy(-400)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md" aria-label="Previous">
        ‹
      </button>
      <button type="button" onClick={() => scrollBy(400)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md" aria-label="Next">
        ›
      </button>
    </div>
  );
}

export function FacilitatorCarousel({ people }) {
  const { ref, scrollBy } = useCarouselScroll();
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2" style={{ scrollPadding: "1rem" }}>
        {people.map((p) => (
          <div key={p.name} className="min-w-[85%] md:min-w-[48%] lg:min-w-[32%] snap-start">
            <div className="rounded-2xl border bg-white shadow p-4">
              <div className="flex items-center gap-4">
                <Image src={p.photo} width={96} height={96} alt={p.name} className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.title}</div>
                  <span className="mt-1 inline-block text-xs font-semibold border rounded-full px-2 py-0.5">{p.badge}</span>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-3">{p.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <button type="button" onClick={() => scrollBy(-400)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md" aria-label="Previous">
        ‹
      </button>
      <button type="button" onClick={() => scrollBy(400)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 backdrop-blur px-3 py-2 text-sm shadow hover:shadow-md" aria-label="Next">
        ›
      </button>
    </div>
  );
}
