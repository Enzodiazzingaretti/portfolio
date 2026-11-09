import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import MediaAsset from "../components/MediaAsset";
import SelectedWorkCard from "../components/SelectedWorkCard";
import DetailModal from "../components/DetailModal";
import { ReelCard } from "../components/ReelsRail";
import Sala from "../components/Sala";
import Scramble from "../fx/Scramble";
import { useInView } from "../fx/useInView";
import NotFound from "./NotFound";
import { abrirObra, cerrarObra } from "../transicionObra";

const LabGrid = lazy(() => import("../components/LabGrid"));

function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

/**
 * Cabecera de categoría como afiche: el título enorme, el numeral en gótica
 * con un círculo a mano y, detrás, la primera pieza impresa en trama.
 */
function TitleCard({ category, content }) {
  const [ref, inView] = useInView({ rootMargin: "0px" });
  const fondo = category.groups
    .flatMap((g) => g.items)
    .map((item) => item.thumbnail)
    .find((src) => src && !/\.(mp4|webm|mov)$/i.test(src));
  const navLabels = content.ui.nav;

  return (
    <header ref={ref} className={`cat-header tc${inView ? " is-in" : ""}`}>
      {fondo ? (
        <span className="tc-print" aria-hidden="true">
          <MediaAsset src={fondo} alt="" className="h-full w-full object-cover" />
        </span>
      ) : null}
      <span className="tc-shade" aria-hidden="true" />

      <Link to="/" className="cat-back font-mono">
        <span aria-hidden="true">←</span> {navLabels.back}
      </Link>

      <div className="tc-main">
        <span className="tc-num font-mono" aria-hidden="true">
          {category.num}
        </span>
        <h1 className="tc-title font-poster">
          <Scramble text={category.title} trigger="mount" duration={620} />
        </h1>
      </div>

      <div className="tc-meta">
        <p className="tc-kicker font-mono">{category.kicker}</p>
        <p className="tc-sub">{category.subtitle}</p>
        <p className="tc-count font-mono">
          <span>{pad(category.count, 3)}</span> {content.ui.worksLabel}
          <span className="tc-sep" aria-hidden="true">
            /
          </span>
          {category.groups.map((g) => g.title).filter(Boolean).join(" · ")}
        </p>
      </div>
    </header>
  );
}

function GroupHead({ group, index }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`cat-group-head${inView ? " is-in" : ""}`}>
      <span className="cat-group-num font-mono" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <h2 className="cat-group-title font-poster">
        {group.title}
      </h2>
      <span className="cat-group-rule" aria-hidden="true" />
      <p className="cat-group-note font-mono">
        {group.note} <span className="cat-group-count">· {pad(group.items.length)}</span>
      </p>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const { content, categories, preloaded } = useOutletContext();
  const [viewer, setViewer] = useState(null);

  const category = useMemo(() => categories.find((c) => c.slug === slug), [categories, slug]);

  const siblings = useMemo(() => {
    if (!category) return { prev: null, next: null };
    const i = categories.findIndex((c) => c.id === category.id);
    return {
      prev: categories[(i - 1 + categories.length) % categories.length],
      next: categories[(i + 1) % categories.length],
    };
  }, [categories, category]);

  // Reveal on scroll: se re-arma en cada categoría porque el DOM cambia entero
  useEffect(() => {
    let io;
    let mo;

    const observarDentroDe = (raiz) => {
      if (raiz.nodeType !== 1 && raiz !== document) return;
      if (raiz.nodeType === 1 && raiz.classList.contains("reveal-on-scroll") && !raiz.classList.contains("is-visible")) {
        io.observe(raiz);
      }
      raiz.querySelectorAll?.(".reveal-on-scroll:not(.is-visible)").forEach((n) => io.observe(n));
    };

    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -2% 0px" },
      );

      observarDentroDe(document);

      /**
       * El lab entra por `lazy()`, asi que sus tarjetas montan despues de este
       * rAF y no estaban en la lista inicial: nadie las observaba y se
       * quedaban en `opacity: 0` para siempre. Era una carrera —con el chunk
       * ya en cache montaba a tiempo y no se notaba—, por eso solo aparecia en
       * carga fria. El MutationObserver toma cualquier nodo que llegue tarde,
       * no solo el lab.
       */
      mo = new MutationObserver((mutaciones) => {
        mutaciones.forEach((m) => m.addedNodes.forEach(observarDentroDe));
      });
      mo.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      mo?.disconnect();
    };
  }, [slug, preloaded]);

  // Slug inventado: 404 de verdad, no un desvio silencioso al home
  if (!category) return <NotFound />;

  const navLabels = content.ui.nav;
  const ink = content.ui.ink;
  // sectionLabel alimenta el rotulo del modal, al lado del punto rojo. Sin el
  // el punto quedaba solo, sin texto.
  const open = (items, index, sectionLabel) => abrirObra(() => setViewer({ items, index, slideIndex: 0, sectionLabel, inicio: index }), items[index]);

  return (
    <div className={`cat-page cat-page--${category.slug}`}>
      <TitleCard category={category} content={content} />

      {category.groups.map((group, gi) => (
        <section key={group.id} className={`cat-group cat-group--${group.layout}`} aria-label={group.title} id={group.id}>
          {category.groups.length > 1 ? <GroupHead group={group} index={gi} /> : null}

          {group.layout === "lab" ? (
            <Suspense fallback={<div className="cat-lab-fallback" />}>
              <LabGrid pieces={group.items} labels={content.ui.lab} />
            </Suspense>
          ) : group.layout === "reels" ? (
            <div className="reel-grid">
              {group.items.map((item, index) => (
                <ReelCard
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  labels={ink.reels}
                  numerado
                  onOpen={() => open(group.items, index, group.title ?? category.title)}
                />
              ))}
            </div>
          ) : group.layout === "sala" || group.layout === "sala-loops" || group.layout === "gallery" ? (
            <Sala
              items={group.items}
              loop={group.layout === "sala-loops"}
              labels={{
                loop: content.ui.loopLabel,
                cursor: group.layout === "sala-loops" ? ink.cursor.play : ink.cursor.view,
                audio: content.ui.showcase?.audio,
                pieces: content.ui.worksLabel,
                readCase: content.ui.readCase,
              }}
              onOpen={(index) => open(group.items, index, group.title ?? category.title)}
            />
          ) : group.layout === "wide" ? (
            <div className="wide-grid">
              {group.items.map((item, index) => (
                <SelectedWorkCard
                  key={`${item.title}-${index}`}
                  project={item}
                  index={index}
                  labels={content.ui}
                  onOpen={() => open(group.items, index, group.title ?? category.title)}
                />
              ))}
            </div>
          ) : null}
        </section>
      ))}

      <nav className="cat-pager" aria-label={navLabels.index}>
        <Link to={`/${siblings.prev.slug}`} className="cat-pager-link cat-pager-link--prev">
          <span className="cat-pager-dir font-mono">← {siblings.prev.num}</span>
          <span className="cat-pager-title font-poster">{siblings.prev.title}</span>
        </Link>
        <Link to="/" className="cat-pager-home font-mono">
          {navLabels.index}
        </Link>
        <Link to={`/${siblings.next.slug}`} className="cat-pager-link cat-pager-link--next">
          <span className="cat-pager-dir font-mono">{siblings.next.num} →</span>
          <span className="cat-pager-title font-poster">{siblings.next.title}</span>
        </Link>
      </nav>

      <DetailModal viewer={viewer} setViewer={setViewer} onClose={() => cerrarObra(() => setViewer(null), viewer?.index === viewer?.inicio)} labels={{ ...content.ui.modal, ...ink.modal }} />
    </div>
  );
}
