import { useEffect, useRef, useState } from "react";
import HeroThreeBackground from "./HeroThreeBackground";
import { HERO_VARIANT_IDS, getVariant } from "./heroVariants";

// Ciclado más lento que antes (7s → 14s): la escena tiene tiempo de respirar
// en vez de sentirse como un carrusel.
const CYCLE_MS = 14000;
const CROSSFADE_MS = 1600;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);
  return reduced;
}

/**
 * Fondo three.js persistente. Vive en el Shell, fuera de <Routes>, así al
 * navegar entre categorías no se reinicializa WebGL: solo se congela y se
 * atenúa. Ciclado automático sin selector manual visible.
 *
 * @param {boolean} props.active - true en "/", false en rutas de categoría
 * @param {boolean} props.revealActive - el preloader ya terminó
 */
export default function HeroBackdrop({ active, revealActive = true }) {
  const reduced = usePrefersReducedMotion();
  const [layers, setLayers] = useState(() => [
    { key: 0, variant: getVariant(HERO_VARIANT_IDS[0]), instant: false },
  ]);
  const counter = useRef(0);
  const cursor = useRef(0);

  // El ciclo solo corre en el home, con la pestaña visible y sin reduced-motion
  useEffect(() => {
    if (!active || reduced || !revealActive) return undefined;
    const id = setInterval(() => {
      if (document.hidden) return;
      cursor.current = (cursor.current + 1) % HERO_VARIANT_IDS.length;
      counter.current += 1;
      setLayers((prev) => [
        ...prev,
        { key: counter.current, variant: getVariant(HERO_VARIANT_IDS[cursor.current]), instant: true },
      ]);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [active, reduced, revealActive]);

  // Descarta las capas viejas cuando terminó el fundido
  useEffect(() => {
    if (layers.length <= 1) return undefined;
    const timer = setTimeout(() => setLayers((prev) => prev.slice(-1)), CROSSFADE_MS);
    return () => clearTimeout(timer);
  }, [layers]);

  return (
    <div className={`hero-backdrop${active ? "" : " hero-backdrop--dim"}`} aria-hidden="true">
      {layers.map((layer) => (
        <div key={layer.key} className={`hero-bg-layer${layer.instant ? " hero-bg-layer--enter" : ""}`}>
          <HeroThreeBackground
            variant={layer.variant}
            staticMode={reduced}
            revealActive={revealActive}
            instantReveal={layer.instant}
            paused={!active}
          />
        </div>
      ))}
      <div className="hero-backdrop-wash" />
    </div>
  );
}
