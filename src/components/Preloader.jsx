import { useEffect, useState, useRef } from "react";

const LINES = [
  "INITIALIZING PORTFOLIO_SYS v1.0",
  "LOADING ASSET MANIFEST...",
  "3D RENDER CACHE: OK",
  "MOTION SYSTEM: ONLINE",
  "VISUAL ARCHIVE: INDEXED",
  "IDENTITY LAYER: ACTIVE",
  "BOOT SEQUENCE COMPLETE",
];

const MIN_DURATION = 1200;
const MAX_WAIT = 8000;

export default function Preloader({ onDone, criticalAssets = [] }) {
  const [percent, setPercent] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const loadedRef = useRef(0);
  const displayRef = useRef(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const total = criticalAssets.length || 1;
    let realProgress = 0;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancelAnimationFrame(rafRef.current);
      setPercent(100);
      setLineIndex(LINES.length - 1);
      setTimeout(() => {
        setExiting(true);
        setTimeout(onDone, 600);
      }, 200);
    };

    const onAssetLoad = () => {
      loadedRef.current += 1;
      realProgress = loadedRef.current / total;
    };

    criticalAssets.forEach((src) => {
      if (!src || src.endsWith(".mp4") || src.endsWith(".webm")) {
        onAssetLoad();
        return;
      }
      const img = new Image();
      img.onload = onAssetLoad;
      img.onerror = onAssetLoad;
      img.src = src;
    });

    const deadline = setTimeout(finish, MAX_WAIT);

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const minFloor = Math.min(elapsed / MIN_DURATION, 0.85);
      const target = Math.max(minFloor, realProgress);
      displayRef.current += (target - displayRef.current) * 0.06;
      const p = Math.min(Math.round(displayRef.current * 100), 99);
      setPercent(p);
      setLineIndex(Math.min(Math.floor(displayRef.current * LINES.length), LINES.length - 1));

      if (realProgress >= 1 && elapsed >= MIN_DURATION) {
        clearTimeout(deadline);
        finish();
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(deadline);
    };
  }, [onDone, criticalAssets]);

  return (
    <div
      className={`preloader fixed inset-0 z-[500] flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ${exiting ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      aria-hidden="true"
    >
      <div className="w-full max-w-2xl px-8 md:px-0">
        <p className="font-mono text-caption uppercase tracking-[0.35em] text-raveRed/60 mb-6">
          KEXXY / PORTFOLIO_SYS
        </p>

        <div
          className="font-display font-bold uppercase leading-none tracking-[-0.05em] text-paper select-none"
          style={{ fontSize: "clamp(5rem, 20vw, 14rem)" }}
        >
          {String(percent).padStart(3, "0")}
          <span className="text-raveRed">%</span>
        </div>

        <div className="mt-8 h-px w-full bg-white/[0.06] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-raveRed transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-5 h-4 overflow-hidden">
          <p
            key={lineIndex}
            className="font-mono text-label uppercase tracking-[0.28em] text-white/25 animate-[fadeSlideUp_120ms_ease_both]"
          >
            {LINES[lineIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
