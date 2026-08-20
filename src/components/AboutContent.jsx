/**
 * El cuerpo de "Sobre mí", compartido por la sección del home y el panel
 * lateral que se abre desde las rutas de categoría. Vive aparte para que no
 * haya dos copias del mismo contenido: cuando se toca el texto, se toca acá.
 *
 * Deliberadamente sin retrato: el sitio ya es visualmente denso (shader
 * ASCII, piezas generativas) y una foto de perfil no aportaba nada que el
 * trabajo no dijera mejor. La cara ya vive en LinkedIn.
 *
 * @param {"panel"|"page"} variant - el panel es angosto y va en una columna;
 *   la sección del home tiene el ancho de la página.
 */
export default function AboutContent({ about, variant = "panel" }) {
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

  return <div className="about-page">{texto}</div>;
}
