import { useOutletContext } from "react-router-dom";
import CategoryIndex from "../components/CategoryIndex";

/**
 * Home: solo hero + índice. Nada de obra apilada. Todo el peso de los medios
 * vive detrás de una ruta, no en la primera pantalla.
 */
export default function Home() {
  const { content, categories, openPanel } = useOutletContext();
  const { hero, ui } = content;
  const navLabels = ui.nav;

  return (
    <div className="home-root">
      <section className="home-hero" aria-label={hero.title}>
        <div className="home-hero-top">
          <p className="font-mono text-meta uppercase tracking-[0.42em] text-white/60">{hero.tagline}</p>
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

        <a href="#index" className="home-scroll font-mono" aria-label={navLabels.index}>
          <span className="home-scroll-rule" aria-hidden="true" />
          {hero.scrollLabel}
        </a>
      </section>

      <section id="index" className="home-index" aria-label={navLabels.index}>
        <div className="home-index-head">
          <span className="font-mono text-label uppercase tracking-[0.4em] text-raveRedBright">
            {navLabels.index}
          </span>
          <span className="home-index-rule" aria-hidden="true" />
          <span className="font-mono text-label uppercase tracking-[0.3em] text-white/52">
            {String(categories.length).padStart(2, "0")}
          </span>
        </div>

        <CategoryIndex
          categories={categories}
          labels={{ index: navLabels.index, plural: ui.worksLabel, singular: ui.workLabelSingular }}
        />

        <div className="home-index-foot">
          <button type="button" onClick={() => openPanel("about")} className="home-foot-link font-mono">
            {navLabels.about}
          </button>
          <button type="button" onClick={() => openPanel("contact")} className="home-foot-link font-mono">
            {navLabels.contact}
          </button>
        </div>
      </section>
    </div>
  );
}
