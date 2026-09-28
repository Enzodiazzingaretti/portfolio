import { Fragment, useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { CASE_ASSETS, CASE_BODIES, CASE_UI } from "../cases";

/**
 * Caso de estudio de un proyecto web: /web/<slug>.
 *
 * Título, bajada y orden salen de `content.cases` (el bundle, así el home y las
 * tarjetas muestran lo mismo). El cuerpo sale de src/cases/, que entra con esta
 * página y no con el resto del sitio.
 */

/** Texto con `código` entre backticks. Nada de HTML: todo entra como texto. */
function Inline({ text }) {
  return text.split("`").map((part, i) =>
    i % 2 ? (
      <code key={i} className="case-code">
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function SectionHead({ num, title }) {
  return (
    <div className="case-section-head">
      <span className="case-section-num font-mono">{num}</span>
      <h2 className="case-section-title font-display">{title}</h2>
    </div>
  );
}

function Figure({ block, figures, eager }) {
  const items = block.figures.map((f) => ({ ...figures[f.key], alt: f.alt, key: f.key }));
  const pair = items.length > 1;
  // Columnas proporcionales a la relación de aspecto: las dos imágenes del par
  // quedan a la misma altura sin recortar ninguna.
  const columns = pair ? items.map((f) => `${(f.w / f.h).toFixed(3)}fr`).join(" ") : undefined;

  return (
    <figure className={`case-figure${pair ? " case-figure--pair" : ""}`}>
      <div className="case-figure-media" style={pair ? { "--case-cols": columns } : undefined}>
        {items.map((f) => (
          <img
            key={f.key}
            src={f.src}
            width={f.w}
            height={f.h}
            alt={f.alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={f.h > f.w ? "is-portrait" : undefined}
          />
        ))}
      </div>
      {block.caption ? <figcaption className="case-caption">{block.caption}</figcaption> : null}
    </figure>
  );
}

function Block({ block, num, figures, ui, eager }) {
  if (block.type === "figure") return <Figure block={block} figures={figures} eager={eager} />;

  let body = null;
  if (block.type === "text") {
    body = (
      <div className="case-prose">
        {block.paragraphs.map((p, i) => (
          <p key={i}>
            <Inline text={p} />
          </p>
        ))}
      </div>
    );
  } else if (block.type === "decisions") {
    body = (
      <ol className="case-decisions">
        {block.items.map((item) => (
          <li key={item.title} className="case-decision">
            <h3 className="case-decision-title font-display">{item.title}</h3>
            <p className="case-decision-text">
              <Inline text={item.text} />
            </p>
            {item.discarded ? (
              <p className="case-discarded">
                <span className="case-discarded-label font-mono">{ui.discarded}</span>
                <span>
                  <Inline text={item.discarded} />
                </span>
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    );
  } else if (block.type === "list") {
    body = (
      <div className="case-prose">
        {block.intro ? (
          <p>
            <Inline text={block.intro} />
          </p>
        ) : null}
        <ul className="case-list">
          {block.items.map((item, i) => (
            <li key={i}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (block.type === "stats") {
    body = (
      <dl className="case-stats">
        {block.items.map((item) => (
          <div key={item.value} className="case-stat">
            <dt className="case-stat-value font-display">{item.value}</dt>
            <dd className="case-stat-label">{item.label}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (!body) return null;
  return (
    <section className={`case-section case-section--${block.type}`}>
      <SectionHead num={num} title={block.title} />
      {body}
    </section>
  );
}

export default function CasePage() {
  const { slug, caso } = useParams();
  const { content, language } = useOutletContext();

  const cases = content.cases ?? [];
  const index = cases.findIndex((c) => c.slug === caso);
  const teaser = cases[index];
  const assets = CASE_ASSETS[caso];
  const body = CASE_BODIES[language]?.[caso] ?? CASE_BODIES.es[caso];
  const ui = CASE_UI[language] ?? CASE_UI.es;
  const valid = Boolean(teaser && assets && body && assets.category === slug);

  /**
   * El Shell pone el título de las rutas de un nivel; el de un caso lo pone
   * esta página. La descripción sirve para quien comparte el link en un chat
   * que sí ejecuta JavaScript, y para Google, que renderiza la SPA.
   */
  useEffect(() => {
    if (!valid) return undefined;
    const previousTitle = document.title;
    document.title = `${teaser.title} — ${ui.label} | ${content.brand}`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    meta?.setAttribute("content", teaser.summary);
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription != null) meta.setAttribute("content", previousDescription);
    };
  }, [valid, teaser, ui.label, content.brand]);

  if (!valid) return <NotFound />;

  const next = cases[(index + 1) % cases.length];
  // Las secciones con título van numeradas (01, 02…); las figuras no cuentan.
  // La primera figura carga sin lazy: en desktop queda casi en el primer pantallazo.
  const firstFigure = body.blocks.findIndex((b) => b.type === "figure");
  let count = 0;
  const blocks = body.blocks.map((block, i) => ({
    block,
    num: block.type === "figure" ? null : String(++count).padStart(2, "0"),
    eager: i === firstFigure,
  }));

  return (
    <article className="case-page">
      <header className="case-header">
        <Link to={`/${slug}`} className="cat-back font-mono">
          <span aria-hidden="true">←</span> {ui.back}
        </Link>

        <p className="case-kicker font-mono">
          {ui.label} {String(index + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
          <span className="case-kicker-tags"> · {teaser.tags}</span>
        </p>
        <h1 className="case-title font-display">{teaser.title}</h1>
        <p className="case-lead">{teaser.summary}</p>

        <div className="case-meta-row">
          <dl className="case-meta">
            <div className="case-meta-item">
              <dt className="font-mono">{ui.role}</dt>
              <dd>{body.role}</dd>
            </div>
            <div className="case-meta-item">
              <dt className="font-mono">{ui.year}</dt>
              <dd>{assets.year}</dd>
            </div>
            <div className="case-meta-item case-meta-item--wide">
              <dt className="font-mono">{ui.stack}</dt>
              <dd>{assets.stack.join(" · ")}</dd>
            </div>
          </dl>

          <div className="case-links">
            {assets.site ? (
              <a
                href={assets.site}
                target="_blank"
                rel="noreferrer"
                className="premium-button premium-button-accent case-link font-mono"
              >
                {ui.site} ↗
              </a>
            ) : null}
            {assets.repo ? (
              <a href={assets.repo} target="_blank" rel="noreferrer" className="premium-button case-link font-mono">
                {ui.code} ↗
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="case-body">
        {blocks.map(({ block, num, eager }, i) => (
          <Block key={i} block={block} num={num} figures={assets.figures} ui={ui} eager={eager} />
        ))}
      </div>

      <nav className="case-pager" aria-label={ui.label}>
        {next && next.slug !== caso ? (
          <Link to={`/${slug}/${next.slug}`} className="case-pager-next">
            <span className="case-pager-dir font-mono">{ui.next} →</span>
            <span className="case-pager-title font-display">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link to={`/${slug}`} className="cat-pager-home font-mono">
          {ui.all}
        </Link>
      </nav>
    </article>
  );
}
