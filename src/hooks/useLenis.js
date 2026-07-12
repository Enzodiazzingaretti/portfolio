import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Scroll suave global con Lenis.
 * Respeta prefers-reduced-motion y expone la instancia
 * para poder frenarlo cuando hay un modal abierto.
 * @param {boolean} paused - Si el scroll debe frenarse (modal abierto)
 */
export function useLenis(paused = false) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      anchors: true,
    });
    lenisRef.current = lenis;

    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [paused]);
}
