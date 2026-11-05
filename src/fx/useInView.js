import { useEffect, useRef, useState } from "react";

/**
 * Avisa cuando un elemento entra en pantalla. Por defecto una sola vez: las
 * marcas en tinta y los textos que se decodifican se dibujan al llegar y
 * quedan así, no se repiten cada vez que se scrollea.
 */
export function useInView({ once = true, rootMargin = "0px 0px -12% 0px", threshold = 0.12 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView];
}

/** Con movimiento reducido no se anima nada que no haga falta. */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
