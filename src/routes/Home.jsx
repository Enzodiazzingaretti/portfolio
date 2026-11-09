import { useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryIndex from "../components/CategoryIndex";
import Showreel from "../components/Showreel";
import ReelsRail from "../components/ReelsRail";
import AboutContent from "../components/AboutContent";
import ContactContent from "../components/ContactContent";
import CasePosters from "../components/CasePosters";
import DetailModal from "../components/DetailModal";
import { SectionHead } from "../fx/Hud";
import { useFitLines } from "../fx/useFitLines";
import { buildShowcase } from "../showcasePicks";

/** Dos renglones: todo menos la última palabra arriba, la última abajo. */
function partirNombre(title) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title, ""];
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
}

/**
 * Home: hero, showreel, índice, reels, casos, sobre mí y contacto.
 *
 * Dirección «vidrio ahumado»: el nombre se compone a todo el ancho en dos
 * renglones (metal arriba, rojo abajo) y entre los dos flota la escultura de
 * vidrio de `HeroGlass`, que lo refracta. El <h1> es texto real: la escena lo
 * mide y lo redibuja detrás del vidrio. El resto del hero va por delante,
 * legible: posicionamiento a la izquierda, bajada y llamados a la derecha y
 * una fila de datos abajo.
 */
export default function Home() {
  const { content, categories } = useOutletContext();
  const { hero, ui, about, contact, cases } = content;
  const ink = ui.ink;
  const navLabels = ui.nav;
  const destacados = useMemo(() => buildShowcase(categories), [categories]);
  const reels = useMemo(
    () => categories.find((c) => c.slug === "motion")?.groups.find((g) => g.id === "reels") ?? null,
    [categories],
  );
  const [viewer, setViewer] = useState(null);
  const heroRef = useRef(null);
  const [arriba, abajo] = partirNombre(hero.title);
  const titular = (hero.headline || hero.roles?.[0] || "").trim().split(/\s+/);
  useFitLines(heroRef, [hero.title]);

  const hayDestacados = destacados.length > 0;
  const hayReels = Boolean(reels?.items?.length);
  const hayCasos = Boolean(cases?.length);

  // Numeral correlativo según qué secciones están: el showreel, los reels y
  // los casos pueden faltar si se vacían desde /admin.
  const orden = [hayDestacados && "showcase", "index", hayReels && "reels", hayCasos && "cases", "about", "contact"].filter(Boolean);
  const numeral = (id) => String(orden.indexOf(id) + 1).padStart(2, "0");
  const primera = hayDestacados ? { id: "showcase", label: navLabels.showcase } : { id: "index", label: navLabels.index };

  const total = categories.reduce((n, c) => n + c.count, 0);
  const year = new Date().getFullYear();

  return (
    <div className="home-root">
      <section ref={heroRef} className="vx-hero" aria-labelledby="hero-title">
        <div className="vx-stage">
          {/* El nombre como un solo bloque: dos renglones justos al mismo
              ancho, pegados, y la escultura de vidrio montada sobre el borde
              derecho. Antes iban separados por toda la banda del medio y se
              leían como dos palabras sueltas. */}
          <h1 id="hero-title" className="vx-name font-poster" aria-label={hero.title}>
            <span className="vx-name-row" aria-hidden="true">
              <span className="vx-name-line vx-name-line--metal" data-fit data-fit-max="23" data-glass-type="metal">
                <i className="vx-baseline" data-glass-baseline />
                {arriba}
              </span>
            </span>
            {abajo ? (
              <span className="vx-name-row" aria-hidden="true">
                <span className="vx-name-line vx-name-line--red" data-fit data-fit-max="23" data-glass-type="red">
                  <i className="vx-baseline" data-glass-baseline />
                  {abajo}
                </span>
              </span>
            ) : null}
            <span className="vx-orb" data-glass-anchor aria-hidden="true" />
          </h1>

          {/* Fila editorial: dónde y año (sin coordenadas ni adornos de HUD
              desde el 2026-11-08, a pedido). */}
          <div className="vx-rule-row font-mono" aria-hidden="true">
            <span>{hero.location}</span>
            <span>©{year}</span>
          </div>

          <div className="vx-band">
            <div className="vx-band-left">
              {/* El puesto, en grande (la última palabra en rojo), y debajo las
                  disciplinas: lo primero que tiene que leer quien contrata. */}
              <p className="vx-roles font-poster">
                <span>{titular.slice(0, -1).join(" ")}</span>
                <span className="is-red">{titular[titular.length - 1]}</span>
              </p>
              <p className="vx-disciplines font-mono">
                {hero.roles.map((role, i) => (
                  <span key={role}>
                    {i ? <span className="vx-disciplines-sep" aria-hidden="true"> · </span> : null}
                    {role}
                  </span>
                ))}
              </p>
            </div>

            <div className="vx-band-right">
              <p className="vx-desc">{hero.description}</p>
              <div className="vx-ctas">
                <a href={`#${primera.id}`} className="vx-btn vx-btn--red font-mono">
                  <span>{hero.cta}</span> <span aria-hidden="true">↓</span>
                </a>
                {contact.cv ? (
                  <a href={contact.cv} target="_blank" rel="noreferrer" className="vx-btn font-mono" data-cursor="PDF">
                    <span>{ui.cvCta}</span> <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="vx-foot font-mono">
          <p className="vx-status">
            <span className="vx-live-dot" aria-hidden="true" />
            {hero.availability}
          </p>
          <a href={`#${primera.id}`} className="vx-scroll" aria-label={primera.label}>
            <span className="vx-scroll-line" aria-hidden="true" />
            {hero.scrollLabel}
          </a>
        </div>

      </section>

      {hayDestacados ? (
        <section id="showcase" className="home-section home-showreel home-lead" aria-labelledby="h-showcase">
          <SectionHead id="h-showcase" num={numeral("showcase")} title={ink.showreel.title} note={`${String(destacados.length).padStart(2, "0")} ${ui.worksLabel}`} />
          <Showreel items={destacados} labels={{ ...ink.showreel, audio: ui.showcase?.audio }} />
        </section>
      ) : null}

      <section id="index" className={`home-section home-index${hayDestacados ? "" : " home-lead"}`} aria-labelledby="h-index">
        <SectionHead id="h-index" num={numeral("index")} title={navLabels.index} note={`${String(total).padStart(3, "0")} ${ui.worksLabel}`} />
        <CategoryIndex
          categories={categories}
          labels={{ index: navLabels.index, plural: ui.worksLabel, singular: ui.workLabelSingular, enter: navLabels.enter }}
        />
      </section>

      {hayReels ? (
        <section id="reels" className="home-section home-reels" aria-labelledby="h-reels">
          <SectionHead id="h-reels" num={numeral("reels")} title={reels.title} note={reels.note} />
          <ReelsRail
            items={reels.items}
            labels={ink.reels}
            onOpen={(index) => setViewer({ items: reels.items, index, slideIndex: 0, sectionLabel: reels.title })}
          />
        </section>
      ) : null}

      {hayCasos ? (
        <section id="cases" className="home-section home-cases" aria-labelledby="h-cases">
          <SectionHead id="h-cases" num={numeral("cases")} title={navLabels.cases} note={`${String(cases.length).padStart(2, "0")} ${ink.cases.plural}`} />
          <CasePosters cases={cases} labels={{ ...ink.cases, read: ui.readCase }} />
        </section>
      ) : null}

      <section id="about" className="home-section home-about" aria-labelledby="h-about">
        <SectionHead id="h-about" num={numeral("about")} title={navLabels.about} />
        <AboutContent about={about} variant="page" />
      </section>

      <section id="contact" className="home-section home-contact" aria-labelledby="h-contact">
        <SectionHead id="h-contact" num={numeral("contact")} title={navLabels.contact} />
        <ContactContent contact={contact} labels={ui.contactLabels} variant="page" />
      </section>

      <DetailModal viewer={viewer} setViewer={setViewer} onClose={() => setViewer(null)} labels={ui.modal} />
    </div>
  );
}
