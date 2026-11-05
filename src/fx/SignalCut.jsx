import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "./useInView";

const BARS = 7;

/**
 * Corte de señal entre rutas: franjas rojas y negras barren la pantalla y
 * dejan ver la página nueva, con la ruta de destino escrita como un rótulo de
 * consola. Dura ~0,6 s y no bloquea nada: la página nueva ya está montada
 * debajo, el corte solo la tapa mientras entra.
 *
 * No corre en la primera carga (ahí está el preloader), ni al cambiar solo el
 * hash, ni con movimiento reducido.
 */
export default function SignalCut({ labels }) {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const [cut, setCut] = useState(null);

  useEffect(() => {
    if (prev.current === pathname) return undefined;
    prev.current = pathname;
    if (prefersReducedMotion()) return undefined;
    const destino = pathname === "/" ? labels?.home ?? "HOME" : pathname.replace(/^\//, "").toUpperCase();
    setCut({ key: Date.now(), destino });
    const t = window.setTimeout(() => setCut(null), 760);
    return () => window.clearTimeout(t);
  }, [pathname, labels]);

  if (!cut) return null;

  return (
    <div className="signal-cut" key={cut.key} aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <span key={i} className="signal-cut-bar" style={{ "--i": i, "--n": BARS }} />
      ))}
      <span className="signal-cut-label font-mono">
        <span className="signal-cut-dot" />
        {">"} /{cut.destino}
      </span>
    </div>
  );
}
