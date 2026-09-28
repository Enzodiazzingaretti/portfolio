import { Link } from "react-router-dom";

/**
 * Los casos de estudio en el home: una fila por caso, con la misma lógica que
 * el índice de categorías (número, título, bajada y flecha). Cada fila lleva a
 * /web/<slug>. Sin miniaturas a propósito: el home ya tiene el showcase, y
 * acá lo que se ofrece es leer.
 */
export default function CaseList({ cases, label }) {
  if (!cases?.length) return null;

  return (
    <ol className="case-rows" aria-label={label}>
      {cases.map((item, i) => (
        <li key={item.slug}>
          <Link to={`/web/${item.slug}`} className="case-row">
            <span className="case-row-rule" aria-hidden="true" />
            <span className="case-row-num font-mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="case-row-main">
              <span className="case-row-title font-display">{item.title}</span>
              <span className="case-row-summary">{item.summary}</span>
            </span>
            <span className="case-row-meta font-mono">
              <span className="case-row-tags">{item.tags}</span>
              <span className="case-row-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
