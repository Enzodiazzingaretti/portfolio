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
 * Fondo WebGL persistente de todo el sitio. Vive en el Shell, fuera de
 * <Routes>, así al navegar no se reinicializa el contexto.
 *
 * Desde 2026-11 es `HeroGlass`: las animaciones con filtro ASCII en todo el
 * fondo y, en el home, el nombre y la escultura de vidrio que las refracta.
 *
 * @param {boolean} props.home - true en "/": dibuja el nombre y el vidrio
 * @param {boolean} props.revealActive - el preloader ya terminó
 */
export default function HeroBackdrop({ home, revealActive = true }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <HeroGlass home={home} revealActive={revealActive} reduced={reduced} />
    </div>
  );
}
