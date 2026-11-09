import { Suspense, lazy, useEffect, useState } from "react";
import { sinGpu } from "../sinGpu";

// three.js (~600 KB) entra recién cuando hace falta: no compite con la carga
const HeroGlass = lazy(() => import("./HeroGlass"));

/**
 * El fondo arranca cuando la página ya cargó y el hilo principal está libre,
 * o antes si el visitante interactúa. Hasta ahí se ve la atmósfera del CSS y
 * el nombre del DOM, que son los mismos colores: el lienzo entra con fundido.
 * (2026-11-08: el WebGL bloqueaba la carga y el rendimiento daba 33.)
 */
function useArranqueDiferido() {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    let hecho = false;
    let idle = 0;
    const eventos = ["pointerdown", "keydown", "wheel", "touchstart"];
    const ir = () => {
      if (hecho) return;
      hecho = true;
      setListo(true);
    };
    const enReposo = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(ir, { timeout: 1800 });
      else idle = window.setTimeout(ir, 400);
    };
    // Sin placa de video el lienzo no se monta: cada cuadro por software
    // tardaba ~750 ms y se redibujaba con cada cambio de la página. Queda la
    // atmósfera del CSS y el nombre del DOM, que son su respaldo.
    if (sinGpu()) return undefined;
    if (document.readyState === "complete") enReposo();
    else window.addEventListener("load", enReposo, { once: true });
    eventos.forEach((e) => window.addEventListener(e, ir, { once: true, passive: true }));
    return () => {
      window.removeEventListener("load", enReposo);
      eventos.forEach((e) => window.removeEventListener(e, ir));
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);
  return listo;
}

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
  const listo = useArranqueDiferido();
  return (
    <div className="hero-backdrop" aria-hidden="true">
      {listo ? (
        <Suspense fallback={null}>
          <HeroGlass home={home} revealActive={revealActive} reduced={reduced} />
        </Suspense>
      ) : null}
    </div>
  );
}
