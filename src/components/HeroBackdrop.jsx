import { useEffect, useState } from "react";
import HeroGlass from "./HeroGlass";

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
 * Fondo WebGL persistente. Vive en el Shell, fuera de <Routes>, así al navegar
 * no se reinicializa el contexto: fuera del home se apaga y deja de dibujar.
 *
 * Desde el rediseño «vidrio ahumado» (2026-11) es la escultura de vidrio de
 * `HeroGlass`. El hero ASCII anterior (`HeroThreeBackground` + `AsciiPass`)
 * queda en el repo, sin montar, por si se quiere volver a él.
 *
 * @param {boolean} props.active - true en "/"
 * @param {boolean} props.revealActive - el preloader ya terminó
 */
export default function HeroBackdrop({ active, revealActive = true }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={`hero-backdrop${active ? "" : " hero-backdrop--off"}`} aria-hidden="true">
      <HeroGlass active={active} revealActive={revealActive} reduced={reduced} />
    </div>
  );
}
