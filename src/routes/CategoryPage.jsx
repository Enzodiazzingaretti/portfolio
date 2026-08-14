import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import MediaAsset from "../components/MediaAsset";
import SelectedWorkCard from "../components/SelectedWorkCard";
import DetailModal from "../components/DetailModal";
import NotFound from "./NotFound";

const LabGrid = lazy(() => import("../components/LabGrid"));

/* Relación de aspecto: respeta el formato original de cada pieza */
function tileRatio(item) {
  if (item.portrait) return "portrait";
  if (item.square) return "square";
  return "landscape";
}

function WorkTile({ item, onOpen }) {
  return (
    <article className={`work-tile work-tile--${tileRatio(item)} reveal-on-scroll`}>
      <button type="button" onClick={onOpen} className="work-tile-button">
        <span className="work-tile-media">
          <MediaAsset src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
          <span className="work-tile-veil" aria-hidden="true" />
        </span>
        <span className="work-tile-caption">
          <span className="work-tile-index" aria-hidden="true" />
          <span className="work-tile-text">
            <span className="work-tile-title font-display">{item.title}</span>
            {item.description ? <span className="work-tile-desc">{item.description}</span> : null}
          </span>
        </span>
      </button>
    </article>
  );
}

function VideoTile({ item, index, onOpen, label }) {
  return (
    <article className="loop-tile reveal-on-scroll">
      <button type="button" onClick={onOpen} className="loop-tile-button">
        <span className="loop-tile-media">
          <MediaAsset src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
          <span className="loop-tile-veil" aria-hidden="true" />
          <span className="loop-tile-badge font-mono">
            <span className="loop-tile-dot" aria-hidden="true" />
            {label} {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <span className="loop-tile-caption">
          <span className="loop-tile-title font-display">{item.title}</span>
          {item.description ? <span className="loop-tile-desc">{item.description}</span> : null}
        </span>
      </button>
    </article>
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

  useEffect(() => {
    if (!viewer) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setViewer(null);
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const delta = event.key === "ArrowRight" ? 1 : -1;
      setViewer((current) => {
        if (!current) return current;
        const total = current.items[current.index].slides?.length ?? 0;
        if (total <= 1) return current;
        return { ...current, slideIndex: (current.slideIndex + delta + total) % total };
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer]);

  // Slug inventado: 404 de verdad, no un desvio silencioso al home
  if (!category) return <NotFound />;

  const navLabels = content.ui.nav;
  // sectionLabel alimenta el rotulo del modal, al lado del punto rojo. Sin el
  // el punto quedaba solo, sin texto.
  const open = (items, index, sectionLabel) => setViewer({ items, index, slideIndex: 0, sectionLabel });

  return (
    <div className="cat-page">
      <header className="cat-header">
        <Link to="/" className="cat-back font-mono">
          <span aria-hidden="true">←</span> {navLabels.back}
        </Link>

        <div className="cat-header-main">
          <span className="cat-header-num font-mono">{category.num}</span>
          <h1 className="cat-header-title font-display">{category.title}</h1>
        </div>

        <div className="cat-header-meta">
          <p className="font-mono text-label uppercase tracking-[0.32em] text-raveRedBright">{category.kicker}</p>
          <p className="cat-header-sub">{category.subtitle}</p>
          <p className="font-mono text-label uppercase tracking-[0.3em] text-white/52">
            {String(category.count).padStart(2, "0")} {content.ui.worksLabel}
          </p>
        </div>
      </header>

      {category.groups.map((group) => (
        <section key={group.id} className="cat-group" aria-label={group.title}>
          {category.groups.length > 1 ? (
            <div className="cat-group-head">
              <h2 className="cat-group-title font-display">{group.title}</h2>
              <span className="cat-group-rule" aria-hidden="true" />
              <p className="cat-group-note font-mono">{group.note}</p>
            </div>
          ) : null}

          {group.layout === "lab" ? (
            <Suspense fallback={<div className="cat-lab-fallback" />}>
              <LabGrid pieces={group.items} labels={content.ui.lab} />
            </Suspense>
          ) : group.layout === "video" ? (
            <div className="loop-grid">
              {group.items.map((item, index) => (
                <VideoTile
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  label={content.ui.loopLabel}
                  onOpen={() => open(group.items, index, group.title ?? category.title)}
                />
              ))}
            </div>
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
          ) : (
            <div className="work-grid">
              {group.items.map((item, index) => (
                <WorkTile
                  key={`${item.title}-${index}`}
                  item={item}
                  onOpen={() => open(group.items, index, group.title ?? category.title)}
                />
              ))}
            </div>
          )}
        </section>
      ))}

      <nav className="cat-pager" aria-label={navLabels.index}>
        <Link to={`/${siblings.prev.slug}`} className="cat-pager-link cat-pager-link--prev">
          <span className="cat-pager-dir font-mono">← {siblings.prev.num}</span>
          <span className="cat-pager-title font-display">{siblings.prev.title}</span>
        </Link>
        <Link to="/" className="cat-pager-home font-mono">
          {navLabels.index}
        </Link>
        <Link to={`/${siblings.next.slug}`} className="cat-pager-link cat-pager-link--next">
          <span className="cat-pager-dir font-mono">{siblings.next.num} →</span>
          <span className="cat-pager-title font-display">{siblings.next.title}</span>
        </Link>
      </nav>

      <DetailModal viewer={viewer} setViewer={setViewer} onClose={() => setViewer(null)} labels={content.ui.modal} />
    </div>
  );
}
