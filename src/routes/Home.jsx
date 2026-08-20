import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryIndex from "../components/CategoryIndex";
import ShowcaseCarousel from "../components/ShowcaseCarousel";
import AboutContent from "../components/AboutContent";
import ContactContent from "../components/ContactContent";
import { buildShowcase } from "../showcasePicks";

/** Rótulo de sección: label rojo, regla al medio y numeral a la derecha. */
function SectionHead({ label, numeral }) {
  return (
    <div className="home-index-head">
      <span className="font-mono text-label uppercase tracking-[0.4em] text-raveRedBright">{label}</span>
      <span className="home-index-rule" aria-hidden="true" />
      <span className="font-mono text-label uppercase tracking-[0.3em] text-white/52">{numeral}</span>
    </div>
  );
}

/**
 * Home: hero, sobre mí, índice de categorías y contacto. La obra en sí no se
 * apila acá — cada disciplina vive detrás de su ruta, y esta página es el
 * recorrido corto: quién es, qué hay, cómo escribirle.
 */
export default function Home() {
  const { content, categories } = useOutletContext();
  const { hero, ui, about, contact } = content;
  const navLabels = ui.nav;
  const destacados = useMemo(() => buildShowcase(categories), [categories]);

  return (
    <div className="home-root">
      <section className="home-hero" aria-label={hero.title}>
        {/* La linea de disciplinas que iba acá decia lo mismo que la nav
            ("3D / Motion / Branding / Web") dos renglones mas arriba. */}
        <div className="home-hero-top">
          <p className="home-hero-status font-mono">
            <span className="home-status-dot" aria-hidden="true" />
            {hero.availability} — {hero.location}
          </p>
        </div>

        <div className="home-hero-main">
          <h1 className="home-title font-display">
            {hero.title.split(" ").map((word) => (
              <span key={word} className="home-title-line">
                {word}
              </span>
            ))}
          </h1>

          <div className="home-hero-side">
            <p className="max-w-sm text-[0.92rem] leading-[1.75] text-dim">{hero.description}</p>
            <div className="home-roles font-mono">
              {hero.roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
          </div>
        </div>

        <a href="#about" className="home-scroll font-mono" aria-label={navLabels.about}>
          <span className="home-scroll-rule" aria-hidden="true" />
          {hero.scrollLabel}
        </a>
      </section>

      <section id="about" className="home-about" aria-label={navLabels.about}>
        <SectionHead label={navLabels.about} numeral="01" />
        <AboutContent about={about} variant="page" />
      </section>

      {destacados.length ? (
        <section id="showcase" className="home-showcase" aria-label={navLabels.showcase}>
          <SectionHead label={navLabels.showcase} numeral="02" />
          <ShowcaseCarousel items={destacados} labels={ui.showcase} />
        </section>
      ) : null}

      {/* Numeral correlativo de sección, no el conteo de categorías que iba
          antes: en la misma posición visual que el 01 de Sobre mí, un 04 se
          leía como "sección 4". El conteo de piezas ya está en cada fila. */}
      <section id="index" className="home-index" aria-label={navLabels.index}>
        <SectionHead label={navLabels.index} numeral="03" />

        <CategoryIndex
          categories={categories}
          labels={{ index: navLabels.index, plural: ui.worksLabel, singular: ui.workLabelSingular }}
        />
      </section>

      <section id="contact" className="home-contact" aria-label={navLabels.contact}>
        <SectionHead label={navLabels.contact} numeral="04" />
        <ContactContent contact={contact} labels={ui.contactLabels} variant="page" />
      </section>
    </div>
  );
}
