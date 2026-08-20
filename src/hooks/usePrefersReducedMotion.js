import { useEffect, useState } from "react";

/**
 * `prefers-reduced-motion: reduce` como estado de React, escuchando cambios.
 *
 * Vivía dentro de LabGrid; se sacó acá cuando el showcase pasó a necesitar lo
 * mismo, para no tener dos copias que puedan divergir.
 */
export function usePrefersReducedMotion() {
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
