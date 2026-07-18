import SectionHeading from "./SectionHeading";

export default function ContactSection({ section, contact, labels }) {
  return (
    <section id="contact" className="mb-6 min-h-[75vh]">
      <SectionHeading index={section.index} title={section.title} subtitle={section.subtitle} />
      <div className="reveal-on-scroll grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <div>
          <p className="font-display text-[clamp(4rem,10vw,11rem)] font-bold uppercase leading-[0.76] tracking-[-0.07em] text-paper">
            {contact.headline}
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="premium-button premium-button-accent mt-10 inline-flex px-10 py-5 font-mono text-xs uppercase tracking-[0.28em]"
          >
            {contact.cta} →
          </a>
          {contact.note ? (
            <p className="mt-5 font-mono text-caption uppercase tracking-[0.24em] text-white/50">{contact.note}</p>
          ) : null}
        </div>
        <div>
          <div className="mb-10">
            <p className="mb-4 font-mono text-caption uppercase tracking-[0.32em] text-raveRed/70">{contact.availableForLabel}</p>
            <div className="grid gap-3">
              {contact.availableFor.map((item) => (
                <p key={item} className="border-b border-white/10 pb-3 text-sm text-white/70">{item}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <a href={`mailto:${contact.email}`} className="contact-link group border-t border-white/[0.08] py-4">
              <span>{labels.email}</span>
              <span>{contact.email}</span>
            </a>
            <a href={contact.instagram} target="_blank" rel="noreferrer" className="contact-link group border-t border-white/[0.08] py-4">
              <span>{labels.instagram}</span>
              <span>@{contact.instagram.split("/").filter(Boolean).pop()} ↗</span>
            </a>
            {contact.linkedin ? (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-link group border-t border-white/[0.08] py-4">
                <span>{labels.linkedin}</span>
                <span>{labels.profile} ↗</span>
              </a>
            ) : null}
            <a href={contact.presskit} target="_blank" rel="noreferrer" className="contact-link group border-t border-white/[0.08] border-b border-b-white/[0.08] py-4">
              <span>{labels.presskit}</span>
              <span>KEXXY ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
