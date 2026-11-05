import { useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategoryIndex from "../components/CategoryIndex";
import Showreel from "../components/Showreel";
import ReelsRail from "../components/ReelsRail";
import AboutContent from "../components/AboutContent";
import ContactContent from "../components/ContactContent";
import CasePosters from "../components/CasePosters";
import DetailModal from "../components/DetailModal";
import { Crosshair, HudClock, SectionHead, Sparkle } from "../fx/Hud";
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
          <h1 id="hero-title" className="vx-name font-poster" aria-label={hero.title}>
            <span className="vx-name-row vx-name-row--top" aria-hidden="true">
              <span className="vx-name-line vx-name-line--metal" data-fit data-fit-max="31" data-glass-type="metal">
                <i className="vx-baseline" data-glass-baseline />
                {arriba}
              </span>
            </span>
            <span className="vx-orb" data-glass-anchor aria-hidden="true" />
            {abajo ? (
              <span className="vx-name-row vx-name-row--bottom" aria-hidden="true">
                <span className="vx-name-line vx-name-line--red" data-fit data-fit-max="27" data-glass-type="red">
                  <i className="vx-baseline" data-glass-baseline />
                  {abajo}
                </span>
              </span>
            ) : null}
          </h1>

          {/* Fila editorial entre los dos renglones: dónde, coordenadas y año. */}
          <div className="vx-rule-row font-mono" aria-hidden="true">
            <span>{hero.location}</span>
            <span className="vx-rule-row-mid">{ink.coords}</span>
            <span>©{year}</span>
          </div>

          <div className="vx-band">
            <div className="vx-band-left">
              <span className="vx-chip font-mono" aria-hidden="true">
                <span className="vx-live-dot" /> SIG.01 · {ink.live}
              </span>
              <p className="vx-roles font-poster">
                {hero.roles.map((role, i) => (
                  <span key={role} className={i === hero.roles.length - 1 ? "is-red" : undefined}>
                    {role}
                  </span>
                ))}
              </p>
            </div>

            <div className="vx-band-right">
              <p className="vx-desc">{hero.description}</p>
              <div className="vx-ctas">
                {contact.cv ? (
                  <a href={contact.cv} target="_blank" rel="noreferrer" className="vx-btn vx-btn--red font-mono" data-cursor="PDF">
                    <span>{ui.cvCta}</span> <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                <a href="#contact" className="vx-btn font-mono">
                  <span>{navLabels.contact}</span> <span aria-hidden="true">↓</span>
                </a>
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
          <p className="vx-foot-right" aria-hidden="true">
            <HudClock />
            <span className="vx-count">№ {String(total).padStart(3, "0")}</span>
          </p>
        </div>

        <span className="vx-deco" aria-hidden="true">
          <Crosshair className="vx-cross vx-cross--a" />
          <Crosshair className="vx-cross vx-cross--b" />
          <Sparkle className="vx-spark vx-spark--a" />
          <Sparkle className="vx-spark vx-spark--b" />
        </span>
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
