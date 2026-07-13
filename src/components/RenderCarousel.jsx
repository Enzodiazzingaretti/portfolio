import { useRef, useState, useCallback, useEffect } from "react";
import MediaAsset from "./MediaAsset";

const CARD_HEIGHT = 420;

function RenderCard({ work, index, onOpen, cardHeight = CARD_HEIGHT }) {
  const isPortrait = work.portrait;
  const isSquare = work.square;
  const ratio = isPortrait ? (9 / 16) : isSquare ? 1 : (3 / 2);
  const cardWidth = Math.round(cardHeight * ratio);
  const fitClass = (isPortrait || isSquare) ? "object-contain" : "object-cover";
  const src = work.thumbnail ?? work.imageUrl ?? null;
  const label = work.title ?? work.name ?? "";
  const desc = work.description ?? work.notes ?? "";

  return (
    <article className="render-card group flex-none" style={{ width: `${cardWidth}px` }}>
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div
          className="relative overflow-hidden bg-[#0A0A0A]"
          style={{ height: `${cardHeight}px` }}
        >
          <MediaAsset
            src={src}
            alt={label}
            className={`h-full w-full ${fitClass} transition duration-700 group-hover:scale-[1.03]`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="mt-3 px-0.5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-raveRed">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-base font-bold uppercase leading-tight tracking-[-0.02em] text-[#EAEAEA] transition group-hover:text-white">{label}</h3>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[#B0B0B0]">{desc}</p>
        </div>
      </button>
    </article>
  );
}

export default function RenderCarousel({ works, onOpen, cardHeight = CARD_HEIGHT }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [effectiveHeight, setEffectiveHeight] = useState(cardHeight);
  const dragStart = useRef(null);
  const scrollStart = useRef(null);

  // Cards más chicas en mobile: a 420px de alto ocupan toda la pantalla
  useEffect(() => {
    const update = () => {
      const mobile = window.matchMedia("(max-width: 640px)").matches;
      setEffectiveHeight(mobile ? Math.round(cardHeight * 0.62) : cardHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cardHeight]);

  const scroll = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 560, behavior: "smooth" });
  }, []);

  const onMouseMove = useCallback((e) => {
    if (dragStart.current === null) return;
    const diff = e.clientX - dragStart.current;
    if (Math.abs(diff) > 4) setIsDragging(true);
    trackRef.current.scrollLeft = scrollStart.current - diff;
  }, []);

  const onMouseUp = useCallback(() => {
    dragStart.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    setTimeout(() => setIsDragging(false), 50);
  }, [onMouseMove]);

  const onMouseDown = useCallback((e) => {
    setIsDragging(false);
    dragStart.current = e.clientX;
    scrollStart.current = trackRef.current.scrollLeft;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [onMouseMove, onMouseUp]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div className="relative">
      {/* Arrow buttons */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute -left-4 top-[30%] z-10 hidden -translate-y-1/2 items-center justify-center h-8 w-8 border border-white/10 bg-[#050505]/80 backdrop-blur text-white/40 transition hover:text-white hover:border-white/30 md:flex"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Siguiente"
        className="absolute -right-4 top-[30%] z-10 hidden -translate-y-1/2 items-center justify-center h-8 w-8 border border-white/10 bg-[#050505]/80 backdrop-blur text-white/40 transition hover:text-white hover:border-white/30 md:flex"
      >
        →
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        className="flex gap-6 overflow-x-auto pb-4 select-none scrollbar-hide"
        style={{ cursor: isDragging ? "grabbing" : "grab", scrollSnapType: "x mandatory" }}
      >
        {works.map((work, index) => (
          <div key={work.title} style={{ scrollSnapAlign: "start" }}>
            <RenderCard
              work={work}
              index={index}
              cardHeight={effectiveHeight}
              onOpen={isDragging ? undefined : () => onOpen(index)}
            />
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#050505] to-transparent" />
    </div>
  );
}
