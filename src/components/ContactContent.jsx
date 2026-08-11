import { Mail, Instagram, Linkedin, FileText } from "lucide-react";

const CONTACT_ORDER = ["email", "instagram", "linkedin", "presskit"];

// lucide ya viaja en el bundle por el ícono del footer, así que estos cuatro
// no agregan dependencia; el tree-shaking los trae de a uno.
const CONTACT_ICON = {
  email: Mail,
  instagram: Instagram,
  linkedin: Linkedin,
  presskit: FileText,
};

function contactHref(key, value) {
  if (key === "email") return `mailto:${value}`;
  return value;
}

/**
 * El cuerpo de Contacto, compartido por la sección del home y el panel
 * lateral. Mismo criterio que [AboutContent]: una sola copia del contenido.
 *
 * @param {"panel"|"page"} variant
 */
export default function ContactContent({ contact, labels, variant = "panel" }) {
  const enPagina = variant === "page";

  return (
    <>
      <p
        className={
          enPagina
            ? "font-display text-[clamp(2.8rem,8vw,6rem)] font-bold uppercase leading-[0.85] tracking-[-0.05em] text-paper"
            : "font-display text-[clamp(2.6rem,7vw,5rem)] font-bold uppercase leading-[0.85] tracking-[-0.05em] text-paper"
        }
      >
        {contact.headline}
      </p>

      {contact.note ? (
        <p className="mt-5 font-mono text-caption uppercase tracking-[0.28em] text-white/56">{contact.note}</p>
      ) : null}

      <ul className="info-contact-list">
        {CONTACT_ORDER.filter((key) => contact[key]).map((key) => {
          const Icono = CONTACT_ICON[key];
          return (
            <li key={key}>
              <a
                href={contactHref(key, contact[key])}
                target={key === "email" ? undefined : "_blank"}
                rel={key === "email" ? undefined : "noreferrer"}
                className="info-contact-link"
              >
                <span className="info-contact-icon" aria-hidden="true">
                  {Icono ? <Icono size={17} strokeWidth={1.5} /> : null}
                </span>
                <span className="info-contact-key font-mono text-label uppercase tracking-[0.3em] text-white/60">
                  {labels?.[key] ?? key}
                </span>
                <span className="info-contact-value font-display">
                  {key === "email" ? contact[key] : contact[key].replace(/^https?:\/\/(www\.)?/, "")}
                </span>
                <span className="info-contact-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {contact.availableFor?.length ? (
        <div className="mt-12">
          <p className="font-mono text-label uppercase tracking-[0.32em] text-white/56">
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
    </>
  );
}
