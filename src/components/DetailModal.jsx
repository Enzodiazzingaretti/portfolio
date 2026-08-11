import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import MediaAsset from "./MediaAsset";

/**
 * El modal tiene dos layouts muy distintos y antes los renderizaba a los dos,
 * escondiendo uno con `md:hidden`. Como cada uno monta su propio <video>, cada
 * pieza abierta descargaba y decodificaba el media dos veces —verificado: dos
 * elementos con readyState 4 del mismo archivo—. Elegir el arbol en JS deja uno
 * solo. El breakpoint es el mismo `md` de Tailwind.
 */
function useEsDesktop() {
  const [esDesktop, setEsDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEsDesktop(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return esDesktop;
}

/**
 * DetailModal - Modal de detalle con navegación de slides
 * @param {Object} props
 * @param {Object|null} props.viewer - Estado del viewer con items, index, slideIndex
 * @param {Function} props.setViewer - Setter para actualizar el estado del viewer
 * @param {Function} props.onClose - Callback al cerrar el modal
 * @param {Object} [props.labels] - Labels traducidos para el UI
 */
export default function DetailModal({ viewer, setViewer, onClose, labels }) {
  const esDesktop = useEsDesktop();
  const [infoOpen, setInfoOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const isOpen = Boolean(viewer);

  useEffect(() => {
    if (!viewer) return;
    setInfoOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [viewer]);

  // Al abrir: guarda el elemento con foco y mueve el foco al diálogo;
  // al cerrar lo devuelve para no perder la posición de teclado
  useEffect(() => {
    if (!isOpen) return undefined;
    lastFocusedRef.current = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (lastFocusedRef.current instanceof HTMLElement) lastFocusedRef.current.focus();
    };
  }, [isOpen]);

  // Focus trap: Tab cicla solo entre los controles visibles del diálogo
  const handleTrapKeyDown = useCallback((event) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusables = Array.from(
      dialogRef.current.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])"),
    ).filter((el) => el.offsetParent !== null && el.tabIndex !== -1);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const modalLabels = useMemo(() => ({
    close: "Close",
    previous: "Previous",
    next: "Next",
    navigateHint: "← → to navigate · ",
    closeHint: "ESC to close",
    year: "Year",
    role: "Role",
    status: "Status",
    visitSite: "Visit Site",
    ...labels,
  }), [labels]);

  const item = viewer?.items?.[viewer?.index];
  const total = item?.slides?.length ?? 0;
  const currentSlide = total > 0 ? item.slides[viewer.slideIndex] : null;

  const navigate = useCallback((direction) => {
    setViewer((current) => {
      if (!current) return current;
      const itemTotal = current.items[current.index].slides?.length ?? 0;
      if (itemTotal <= 1) return current;
      const delta = direction === "next" ? 1 : -1;
      return {
        ...current,
        slideIndex: (current.slideIndex + delta + itemTotal) % itemTotal,
      };
    });
  }, [setViewer]);

  const handlePrev = useCallback(() => navigate("prev"), [navigate]);
  const handleNext = useCallback(() => navigate("next"), [navigate]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [handleNext, handlePrev]);

  if (!viewer || !item) return null;

  const slideIndicators = total > 1 && (
    <div className="flex gap-[5px]">
      {item.slides.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setViewer((c) => ({ ...c, slideIndex: i }))}
          aria-label={`${modalLabels.slide} ${i + 1} / ${total}`}
          aria-current={i === viewer.slideIndex}
          className="flex h-11 min-w-[24px] items-center justify-center"
        >
          <span
            className={`block h-[2px] rounded-full transition-all duration-300 ${
              i === viewer.slideIndex ? "w-5 bg-white" : "w-2 bg-white/30"
            }`}
          />
        </button>
      ))}
    </div>
  );

  const mediaCore = (
    <>
      {!currentSlide && item.previewImage ? (
        <div className="h-full w-full overflow-hidden">
          <MediaAsset src={item.previewImage} alt={item.title} className="preview-scroll-modal" />
        </div>
      ) : currentSlide ? (
        <MediaAsset
          key={currentSlide}
          src={currentSlide}
          alt={`${item.title} — slide ${viewer.slideIndex + 1}`}
          className="block max-h-full w-auto max-w-full object-contain"
          controls
          eager
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-white/46">{item.title}</span>
        </div>
      )}

      {/* Zonas de tap invisibles: fuera del tab order y del árbol de accesibilidad;
          teclado ya navega con ← → y en desktop hay flechas visibles */}
      {total > 1 && (
        <>
          <button type="button" onClick={handlePrev} tabIndex={-1} aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1/3 opacity-0"
          />
          <button type="button" onClick={handleNext} tabIndex={-1} aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1/3 opacity-0"
          />
        </>
      )}
    </>
  );

  // Portal a <body>: el modal vive dentro de .cat-page, que tiene animacion de
  // entrada y z-index propio. Eso hacia dos cosas: el transform retenido de la
  // animacion convertia a .cat-page en bloque contenedor y el `fixed` del
  // modal se resolvia contra la pagina entera (1871px de alto en vez del
  // viewport, con el contenido centrado fuera de pantalla), y su contexto de
  // apilado dejaba al modal por debajo de la barra pase lo que pase con el
  // z-index. Colgando de <body> las dos desaparecen, y queda inmune a
  // cualquier transform que se agregue mas adelante.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      tabIndex={-1}
      onKeyDown={handleTrapKeyDown}
      className="modal-scrim fixed inset-0 z-[120] outline-none"
      onClick={onClose}
    >

      {/* ══════════════════════════════════════
          MOBILE — fullscreen cinematic viewer
      ══════════════════════════════════════ */}
      {!esDesktop && (
      <div
        className="flex h-full flex-col"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Media — fills everything */}
        <div className="modal-media relative flex flex-1 items-center justify-center overflow-hidden">
          {mediaCore}

          {/* Top chrome */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-raveRed" />
              <span className="font-mono text-micro uppercase tracking-[0.3em] text-white/60">{viewer.sectionLabel}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={modalLabels.close}
              className="flex h-11 w-11 items-center justify-center text-white/60 transition-colors active:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Bottom overlay — always visible info strip */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-6 pt-16">
            {item.subtitle && (
              <p className="mb-2 font-mono text-micro uppercase tracking-[0.35em] text-raveRedBright/80">{item.subtitle}</p>
            )}
            <h3 className="font-display text-[2rem] font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
              {item.title}
            </h3>

            <div className="mt-4 flex items-center justify-between">
              {slideIndicators || <span />}
              {total > 1 && (
                <span className="font-mono text-label text-white/52">{viewer.slideIndex + 1} / {total}</span>
              )}
            </div>

            {/* Info expand handle */}
            <button
              type="button"
              onClick={() => setInfoOpen((o) => !o)}
              aria-expanded={infoOpen}
              className="mt-4 flex w-full items-center justify-between border-t border-white/[0.08] pt-4"
            >
              <span className="font-mono text-label uppercase tracking-[0.25em] text-white/60">
                {infoOpen ? modalLabels.infoClose : modalLabels.infoShow}
              </span>
              <span className={`text-white/52 transition-transform duration-300 ${infoOpen ? "rotate-180" : ""}`}>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Info sheet — slides up */}
        <div
          className={`modal-sheet shrink-0 overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            infoOpen ? "max-h-[52vh]" : "max-h-0"
          }`}
        >
          <div className="px-5 pb-8 pt-6">
            {item.description && (
              <p className="text-[0.82rem] leading-[1.7] text-white/60">{item.description}</p>
            )}

            {item.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="border border-white/[0.08] px-3 py-1 font-mono text-micro uppercase tracking-[0.18em] text-white/56">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {(item.year || item.role || item.status) && (
              <div className="mt-6 flex gap-8 border-t border-white/[0.06] pt-5">
                {item.year && (
                  <div>
                    <p className="font-mono text-nano uppercase tracking-[0.35em] text-white/46">{modalLabels.year}</p>
                    <p className="mt-1.5 font-mono text-meta text-white/55">{item.year}</p>
                  </div>
                )}
                {item.role && (
                  <div>
                    <p className="font-mono text-nano uppercase tracking-[0.35em] text-white/46">{modalLabels.role}</p>
                    <p className="mt-1.5 font-mono text-meta text-white/55">{item.role}</p>
                  </div>
                )}
                {item.status && (
                  <div>
                    <p className="font-mono text-nano uppercase tracking-[0.35em] text-white/46">{modalLabels.status}</p>
                    <p className="mt-1.5 font-mono text-meta text-raveRed/70">{item.status}</p>
                  </div>
                )}
              </div>
            )}

            {item.previewUrl && (
              <a
                href={item.previewUrl}
                target={item.previewUrl.startsWith("#") ? undefined : "_blank"}
                rel={item.previewUrl.startsWith("#") ? undefined : "noreferrer"}
                className="mt-6 flex items-center justify-center gap-2 border border-raveRed/40 bg-raveRed/10 py-3.5 font-mono text-label uppercase tracking-[0.28em] text-white/80 transition-colors active:bg-raveRed/20"
              >
                {modalLabels.visitSite} ↗
              </a>
            )}
          </div>
        </div>
      </div>
      )}

      {/* ══════════════════════════════════════
          DESKTOP — side by side
      ══════════════════════════════════════ */}
      {esDesktop && (
      <div
        className="flex h-full items-center justify-center p-8 lg:p-12"
        onClick={onClose}
      >
        <div
          className="modal-cinematic relative flex h-full max-h-[90vh] w-full max-w-7xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Media */}
          <div className="modal-media relative flex flex-1 items-center justify-center overflow-hidden">
            {mediaCore}
            {total > 1 && (
              <>
                <button type="button" onClick={handlePrev} aria-label={modalLabels.previous}
                  className="modal-ctrl absolute left-4 top-1/2 z-[4] flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/60"
                >←</button>
                <button type="button" onClick={handleNext} aria-label={modalLabels.next}
                  className="modal-ctrl absolute right-4 top-1/2 z-[4] flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/60"
                >→</button>
                <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-[5px]">
                  {item.slides.map((_, i) => (
                    <button key={i} type="button" onClick={() => setViewer((c) => ({ ...c, slideIndex: i }))}
                      aria-label={`${modalLabels.slide} ${i + 1} / ${total}`}
                      aria-current={i === viewer.slideIndex}
                      className="flex h-11 min-w-[24px] items-center justify-center"
                    >
                      <span className={`block h-[2px] rounded-full transition-all duration-300 ${i === viewer.slideIndex ? "w-5 bg-white" : "w-2 bg-white/25"}`} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info panel */}
          <div className="modal-aside relative z-[2] flex w-72 shrink-0 flex-col justify-between overflow-y-auto p-8 lg:w-80">
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-raveRed" />
                  <p className="font-mono text-micro uppercase tracking-[0.32em] text-white/52">{viewer.sectionLabel}</p>
                </div>
                <button type="button" onClick={onClose} aria-label={modalLabels.close}
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-white/48 transition hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.8rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-paper">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-2.5 font-mono text-label uppercase tracking-[0.28em] text-raveRedBright/75">{item.subtitle}</p>
                )}
              </div>

              {item.description && (
                <p className="text-[0.8rem] leading-[1.75] text-white/60">{item.description}</p>
              )}

              {item.tags?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="border border-white/[0.08] px-2.5 py-1 font-mono text-micro uppercase tracking-[0.15em] text-white/56">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {(item.year || item.role || item.status) && (
                <div className="grid gap-4 border-t border-white/[0.06] pt-5">
                  {item.year && (
                    <div>
                      <p className="font-mono text-nano uppercase tracking-[0.35em] text-white/46">{modalLabels.year}</p>
                      <p className="mt-1 font-mono text-caption text-white/50">{item.year}</p>
                    </div>
                  )}
                  {item.role && (
                    <div>
                      <p className="font-mono text-nano uppercase tracking-[0.35em] text-white/46">{modalLabels.role}</p>
                      <p className="mt-1 font-mono text-caption text-white/50">{item.role}</p>
                    </div>
                  )}
                  {item.status && (
                    <div>
                      <p className="font-mono text-nano uppercase tracking-[0.35em] text-white/46">{modalLabels.status}</p>
                      <p className="mt-1 font-mono text-caption text-raveRed/70">{item.status}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5">
              {item.previewUrl && (
                <a
                  href={item.previewUrl}
                  target={item.previewUrl.startsWith("#") ? undefined : "_blank"}
                  rel={item.previewUrl.startsWith("#") ? undefined : "noreferrer"}
                  className="premium-button premium-button-accent flex items-center justify-center gap-2 py-3 font-mono text-label uppercase tracking-[0.24em]"
                >
                  {modalLabels.visitSite} ↗
                </a>
              )}
              <div className="flex items-center justify-between">
                {total > 1
                  ? <p className="font-mono text-micro text-white/46">{viewer.slideIndex + 1} / {total}</p>
                  : <span />
                }
                <p className="font-mono text-nano text-white/46">{modalLabels.closeHint}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>,
    document.body,
  );
}
