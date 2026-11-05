import { Link } from "react-router-dom";
import { useInView } from "../fx/useInView";
import { CASE_COVERS, caseHref } from "../cases/covers";

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * Un caso como tarjeta en capas: el número gigante en contorno al fondo, la
 * captura en un marco que se inclina hacia el cursor (data-tilt, lo maneja el
 * Shell) con un reflejo que lo sigue, y la leyenda en vidrio que pisa el borde
 * de la captura. La captura queda nítida: el vidrio la rotula, no la tapa.
 */
function CaseCard({ item, index, labels }) {
  const [ref, inView] = useInView();
  const cover = CASE_COVERS[item.slug];

  return (
    <li ref={ref} className={`cc${inView ? " is-in" : ""}`} style={{ "--k": index }}>
      <Link to={caseHref(item.slug)} className="cc-link" data-cursor={labels.read} data-tilt>
        <span className="cc-num font-poster" aria-hidden="true">
          {pad(index + 1)}
        </span>
        <span className="cc-frame visor">
          {cover ? <img className="cc-img" src={cover.src} alt="" loading="lazy" decoding="async" /> : null}
          <span className="cc-sheen" aria-hidden="true" />
          <span className="cc-label font-mono" aria-hidden="true">
            {labels.label} {pad(index + 1)}
            {cover?.year ? <span className="cc-year">{cover.year}</span> : null}
          </span>
        </span>
        <span className="cc-body">
          <span className="cc-title font-poster">{item.title}</span>
          <span className="cc-summary">{item.summary}</span>
          <span className="cc-foot font-mono">
            <span className="cc-tags">{item.tags}</span>
            <span className="cc-cta">
              {labels.read} <span aria-hidden="true">→</span>
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

/** Los casos de estudio en el home. Cada uno lleva a su página (/tech/<slug>). */
export default function CasePosters({ cases, labels }) {
  if (!cases?.length) return null;
  return (
    <ol className="ccs">
      {cases.map((item, i) => (
        <CaseCard key={item.slug} item={item} index={i} labels={labels} />
      ))}
    </ol>
  );
}
