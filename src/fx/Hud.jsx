import Scramble from "./Scramble";
import { useInView } from "./useInView";

// El encabezado de sección. El reloj, los destellos y las miras que vivían
// acá se sacaron el 2026-11-08 (a pedido: fuera los elementos genéricos).

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
