import { useEffect, useRef } from "react";
import AboutContent from "./AboutContent";
import ContactContent from "./ContactContent";

/**
 * About y Contacto como panel lateral. En el home los dos son secciones de la
 * página; el panel es para las rutas de categoría, donde no hay ninguna de las
 * dos a la vista. El contenido sale de los mismos componentes que usa el home.
 */
export default function InfoPanel({ open, kind, content, labels, onClose }) {
  const panelRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastFocused.current = document.activeElement;
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const about = content.about;
  const contact = content.contact;
  const isAbout = kind === "about";

  return (
    <div className="info-panel-root" role="dialog" aria-modal="true" aria-label={isAbout ? labels.about : labels.contact}>
      <button type="button" className="info-panel-scrim" onClick={onClose} aria-label={labels.close} />

      <div ref={panelRef} tabIndex={-1} className="info-panel">
        <header className="info-panel-head">
          <span className="font-mono text-label uppercase tracking-[0.36em] text-raveRedBright">
            {isAbout ? labels.about : labels.contact}
          </span>
          <button type="button" onClick={onClose} className="info-panel-close font-mono" aria-label={labels.close}>
            {labels.close} ✕
          </button>
        </header>

        <div className="info-panel-body">
          {isAbout ? (
            <AboutContent about={about} variant="panel" />
          ) : (
            <ContactContent contact={contact} labels={labels.contactLabels} variant="panel" />
          )}
        </div>
      </div>
    </div>
  );
}
