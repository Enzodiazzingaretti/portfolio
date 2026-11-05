import { useEffect, useState } from "react";
import Scramble from "./Scramble";
import { useInView } from "./useInView";

/**
 * Piezas chicas del HUD: reloj de Mendoza, destellos de cuatro puntas, miras
 * y el encabezado de sección. Todo decorativo salvo el encabezado, que lleva
 * el título real de la sección.
 */

const FORMATO_HORA = (() => {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Mendoza",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return null;
  }
})();

/** Hora local de Mendoza, que es desde donde trabaja: dato real, no adorno. */
export function HudClock({ prefix = "MDZ", className = "" }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!FORMATO_HORA) return null;
  return (
    <span className={`hud-clock font-mono ${className}`}>
      {prefix} <span className="hud-clock-time">{FORMATO_HORA.format(now)}</span> UTC−3
    </span>
  );
}

/** Destello de cuatro puntas, el de los afiches de ciencia ficción. */
export function Sparkle({ className = "", style }) {
  return (
    <svg className={`sparkle ${className}`} style={style} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 0 C12.9 7.6 16.4 11.1 24 12 C16.4 12.9 12.9 16.4 12 24 C11.1 16.4 7.6 12.9 0 12 C7.6 11.1 11.1 7.6 12 0 Z" />
    </svg>
  );
}

/** Mira: una cruz fina con un cuadrado al centro. */
export function Crosshair({ className = "", style }) {
  return (
    <svg className={`crosshair ${className}`} style={style} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M20 0v14M20 26v14M0 20h14M26 20h14" />
      <rect x="17" y="17" width="6" height="6" />
    </svg>
  );
}

/**
 * Encabezado de sección: numeral chico en rojo, título en tipo de afiche que
 * entra por una máscara al aparecer, una regla y una nota técnica. Detrás, el
 * mismo título gigante en contorno, en otra capa, que se desplaza más lento
 * que la página (parallax por scroll, solo donde el navegador lo soporta).
 *
 * @param {object} props
 * @param {string} props.num "01"
 * @param {string} props.title
 * @param {string} [props.note]
 * @param {string} [props.id] id del título, para `aria-labelledby`
 */
export function SectionHead({ num, title, note, id }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`sx-head${inView ? " is-in" : ""}`}>
      <span className="sx-ghost font-poster" aria-hidden="true">
        {title}
      </span>
      <span className="sx-num font-mono" aria-hidden="true">
        {num}
      </span>
      <h2 id={id} className="sx-title font-poster">
        <span className="sx-title-mask">
          <span className="sx-title-text">{title}</span>
        </span>
      </h2>
      <span className="sx-rule" aria-hidden="true" />
      {note ? (
        <span className="sx-note font-mono">
          <Scramble text={note} trigger="view" />
        </span>
      ) : null}
    </div>
  );
}
