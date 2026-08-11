import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Scroll suave global con Lenis.
 * Respeta prefers-reduced-motion y expone la instancia
 * para poder frenarlo cuando hay un modal abierto.
 * @param {boolean} paused - Si el scroll debe frenarse (modal abierto)
 * @returns {{ scrollToTop: () => void }}
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

  /**
   * Lenis se apropia del scroll y se traga los `window.scrollTo`: el reset al
   * cambiar de ruta no hacia nada y se caia en la categoria nueva a la altura
   * que tenia la anterior. Verificado en produccion: de /motion a 1047 px se
   * llegaba a /3d con esos mismos 1047 px.
   * Sin Lenis —reduced motion— no hay instancia y va el nativo.
   */
  const scrollToTop = useCallback(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, []);

  /**
   * Lleva a una sección por id. Mismo motivo que scrollToTop: si se usa
   * scrollIntoView, Lenis lo pisa en el frame siguiente.
   * @param {string} id - sin el '#'
   */
  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target);
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { scrollToTop, scrollToSection };
}
