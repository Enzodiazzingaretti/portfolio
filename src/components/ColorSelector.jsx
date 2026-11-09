import { useEffect, useRef, useState } from "react";
import { GRUPOS, PALETAS, aplicarPaleta, paletaActual } from "../paletas";

/**
 * Selector de color del sitio, en la barra (2026-11-08, a pedido). Un botón
 * redondo con el acento activo abre una fila de muestras; la elección queda
 * guardada para la próxima visita. El cambio va con un fundido (View
 * Transitions, donde existe) y el lienzo WebGL lo sigue solo.
 */
export default function ColorSelector({ labels }) {
  const [activa, setActiva] = useState(paletaActual);
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => {
      if (!raiz.current?.contains(e.target)) setAbierto(false);
    };
    const tecla = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const elegir = (id) => {
    setActiva(id);
    aplicarPaleta(id, { guardar: true, fundido: true });
  };

  const actual = PALETAS.find((p) => p.id === activa) ?? PALETAS[0];
  const nombre = (id) => labels?.nombres?.[id] ?? id;

  return (
    <div ref={raiz} className={`color-sel${abierto ? " is-open" : ""}`}>
      <button
        type="button"
        className="color-sel-btn"
        aria-label={`${labels?.label ?? "Color"}: ${nombre(actual.id)}`}
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
      >
        <span className="color-sel-dot" data-pulso style={{ background: actual.muestra }} aria-hidden="true" />
      </button>
      <div className="color-sel-pop" role="radiogroup" aria-label={labels?.label ?? "Color"} hidden={!abierto}>
        <span className="color-sel-titulo font-mono" aria-hidden="true">
          {labels?.label}
        </span>
        {GRUPOS.map((grupo) => (
          <div key={grupo} className="color-sel-grupo">
            <span className="color-sel-subtitulo font-mono" aria-hidden="true">
              {labels?.grupos?.[grupo] ?? grupo}
            </span>
            <div className="color-sel-fila">
              {PALETAS.filter((p) => p.grupo === grupo).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={activa === p.id}
                  className="color-sel-op"
                  onClick={() => elegir(p.id)}
                >
                  <span className="color-sel-muestra" style={{ "--m": p.muestra, "--f": p.fondo }} aria-hidden="true" />
                  <span className="color-sel-nombre font-mono">{nombre(p.id)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
