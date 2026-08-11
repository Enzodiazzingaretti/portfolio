import { useState } from "react";
import { resolvePublicAsset } from "../utils/helpers";

/**
 * El retrato. `about.portrait` se carga desde /admin → Sobre mí → "Foto /
 * retrato"; mientras esté vacío —o si el archivo no está— se dibuja un marco
 * con las esquinas del sistema, para que el hueco se lea como pendiente y no
 * como imagen rota.
 */
function Portrait({ src, alt }) {
  const [falló, setFalló] = useState(false);
  const resuelto = resolvePublicAsset(src);

  if (!resuelto || falló) {
    return (
      <div className="about-portrait about-portrait--vacio" role="img" aria-label={alt}>
        <span className="about-portrait-corner about-portrait-corner--tl" aria-hidden="true" />
        <span className="about-portrait-corner about-portrait-corner--br" aria-hidden="true" />
        <span className="about-portrait-label font-mono">RETRATO</span>
      </div>
    );
  }

  return (
    <div className="about-portrait">
      <img
        src={resuelto}
        alt={alt}
        onError={() => setFalló(true)}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/**
 * El cuerpo de "Sobre mí", compartido por la sección del home y el panel
 * lateral que se abre desde las rutas de categoría. Vive aparte para que no
 * haya dos copias del mismo contenido: cuando se toca el texto, se toca acá.
 *
 * @param {"panel"|"page"} variant - el panel es angosto, va en una columna y
 *   sin retrato; la sección del home tiene el ancho de la página.
 */
export default function AboutContent({ about, variant = "panel", portraitAlt = "" }) {
  const enPagina = variant === "page";

  const texto = (
    <>
      <p
        className={
          enPagina
            ? "font-display text-[clamp(2rem,4.6vw,3.9rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em] text-paper"
            : "font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-paper"
        }
      >
        {about.headline}
      </p>

      <p className={`max-w-prose text-[0.92rem] leading-[1.75] text-dim ${enPagina ? "mt-7" : "mt-7"}`}>
        {about.paragraph}
      </p>

      {about.specializations?.length ? (
        <ul className="info-spec-list">
          {about.specializations.map((item) => (
            <li key={item} className="info-spec-item font-mono">
              <span className="info-spec-dot" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );

  if (!enPagina) return texto;

  return (
    <div className="about-layout">
      <Portrait src={about.portrait} alt={portraitAlt} />
      <div>{texto}</div>
    </div>
  );
}
