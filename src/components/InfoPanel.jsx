import { useEffect, useRef } from "react";

const CONTACT_ORDER = ["email", "instagram", "linkedin", "presskit"];

function contactHref(key, value) {
  if (key === "email") return `mailto:${value}`;
  return value;
}

/**
 * About y Contacto: antes eran las secciones 01 y 09 del scroll. Ahora son un
 * panel lateral que se abre desde cualquier ruta y no ocupa página.
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

        {isAbout ? (
          <div className="info-panel-body">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-paper">
              {about.headline}
            </h2>
            <p className="mt-7 max-w-prose text-[0.92rem] leading-[1.75] text-dim">{about.paragraph}</p>

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
          </div>
        ) : (
          <div className="info-panel-body">
            <h2 className="font-display text-[clamp(2.6rem,7vw,5rem)] font-bold uppercase leading-[0.85] tracking-[-0.05em] text-paper">
              {contact.headline}
            </h2>
            {contact.note ? (
              <p className="mt-5 font-mono text-caption uppercase tracking-[0.28em] text-white/45">{contact.note}</p>
            ) : null}

            <ul className="info-contact-list">
              {CONTACT_ORDER.filter((key) => contact[key]).map((key) => (
                <li key={key}>
                  <a
                    href={contactHref(key, contact[key])}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noreferrer"}
                    className="info-contact-link"
                  >
                    <span className="font-mono text-label uppercase tracking-[0.3em] text-white/40">
                      {labels.contactLabels?.[key] ?? key}
                    </span>
                    <span className="info-contact-value font-display">
                      {key === "email" ? contact[key] : contact[key].replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                    <span className="info-contact-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {contact.availableFor?.length ? (
              <div className="mt-12">
                <p className="font-mono text-label uppercase tracking-[0.32em] text-white/35">
                  {contact.availableForLabel}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.availableFor.map((item) => (
                    <span key={item} className="info-tag font-mono">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
