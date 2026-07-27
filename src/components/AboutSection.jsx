import { useState } from "react";
import { resolvePublicAsset } from "../utils/helpers";
import SectionHeading from "./SectionHeading";

function PortraitImage({ src, alt }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="about-portrait-placeholder relative h-full w-full overflow-hidden border border-white/10">
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
          <span className="font-mono text-label uppercase tracking-[0.3em] text-raveRed/80">PORTRAIT</span>
          <span className="font-mono text-label uppercase tracking-[0.3em] text-white/40">EST. 2024</span>
        </div>
        <div className="absolute left-5 top-5 h-8 w-8 border-l border-t border-raveRed/50" />
        <div className="absolute right-5 top-5 h-8 w-8 border-r border-t border-white/15" />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setError(true)} className="h-full w-full object-cover grayscale" loading="lazy" decoding="async" />;
}

export default function AboutSection({ section, about, brand, cta }) {
  return (
    <section id="about" className="mb-32 md:mb-44">
      <SectionHeading index={section.index} title={section.title} subtitle={section.subtitle} />
      <div className="reveal-on-scroll grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div className="premium-media aspect-[4/5] overflow-hidden bg-surface md:max-w-md">
          <PortraitImage src={resolvePublicAsset(about.portrait)} alt={brand} />
        </div>
        <div>
          <p className="font-display text-[clamp(2.4rem,5vw,5.7rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em] text-paper">
            {about.headline}
          </p>
          <p className="mt-8 max-w-2xl text-[0.95rem] leading-relaxed text-dim md:text-base">
            {about.paragraph}
          </p>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {about.specializations.map((skill) => (
              <p key={skill} className="border-t border-white/10 pt-3 font-mono text-caption uppercase tracking-[0.28em] text-white/65">
                {skill}
              </p>
            ))}
          </div>
          {cta && (
            <a href="#contact" className="premium-button premium-button-accent mt-10 inline-flex px-6 py-3 font-mono text-caption uppercase tracking-[0.28em]">
              {cta} ↓
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
