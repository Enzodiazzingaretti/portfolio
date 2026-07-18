import { useEffect, useMemo, useRef, useState } from "react";
import { resolvePublicAsset } from "../utils/helpers";
import HeroThreeBackground from "./HeroThreeBackground";
import HeroVariantSelector from "./HeroVariantSelector";
import { HERO_VARIANTS, HERO_VARIANT_IDS, getVariant } from "./heroVariants";

const HERO_VARIANT_STORAGE_KEY = "kexxy-hero-variant";
const AUTO_CYCLE_MS = 7000;

function getInitialHeroVariant() {
  if (typeof window === "undefined") return HERO_VARIANTS[0].id;

  try {
    const saved = window.localStorage.getItem(HERO_VARIANT_STORAGE_KEY);
    return HERO_VARIANT_IDS.includes(saved) ? saved : HERO_VARIANTS[0].id;
  } catch {
    return HERO_VARIANTS[0].id;
  }
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener?.("change", syncPreference);
    return () => media.removeEventListener?.("change", syncPreference);
  }, []);

  return prefersReducedMotion;
}

/**
 * HeroSection - Sección principal con imagen de fondo y presentación
 * @param {Object} props
 * @param {Object} props.hero - Datos del hero (title, tagline, description, etc.)
 * @param {string|null} props.heroImage - URL de la imagen de fondo
 * @param {boolean} props.heroPassed - Si el scroll pasó el hero (para ocultar indicador)
 */
export default function HeroSection({ hero, heroImage, heroPassed, preloaded = true }) {
  const [imageError, setImageError] = useState(false);
  const [variantId, setVariantId] = useState(getInitialHeroVariant);
  const [autoCycle, setAutoCycle] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeVariant = useMemo(() => getVariant(variantId), [variantId]);
  const sectionRef = useRef(null);
  // Capas apiladas para el crossfade entre variantes
  const [layers, setLayers] = useState(() => [
    { key: 0, variant: getVariant(getInitialHeroVariant()), instant: false },
  ]);
  const layerCounter = useRef(0);

  const selectVariant = (nextVariantId) => {
    const nextId = getVariant(nextVariantId).id;
    setVariantId(nextId);
    // Un click manual detiene el ciclado automático y recuerda la elección
    setAutoCycle(false);
    try {
      window.localStorage.setItem(HERO_VARIANT_STORAGE_KEY, nextId);
    } catch {
      // Local storage can be unavailable in private browsing contexts.
    }
  };

  // Cicla entre las 3 animaciones para mostrarlas; pausa fuera de viewport
  // o si la pestaña no está visible, y se detiene ante interacción manual
  useEffect(() => {
    if (!autoCycle || prefersReducedMotion || !preloaded) return undefined;
    let visible = true;
    const el = sectionRef.current;
    const io = el
      ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.3 })
      : null;
    if (io && el) io.observe(el);
    const id = setInterval(() => {
      if (document.hidden || !visible) return;
      setVariantId((cur) => {
        const idx = HERO_VARIANT_IDS.indexOf(cur);
        return HERO_VARIANT_IDS[(idx + 1) % HERO_VARIANT_IDS.length];
      });
    }, AUTO_CYCLE_MS);
    return () => {
      clearInterval(id);
      if (io) io.disconnect();
    };
  }, [autoCycle, prefersReducedMotion, preloaded]);

  // Al cambiar de variante, apila una capa nueva que entra por opacidad
  // sobre la anterior (crossfade), ya formada gracias a instantReveal
  useEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top.variant.id === activeVariant.id) return prev;
      layerCounter.current += 1;
      return [...prev, { key: layerCounter.current, variant: activeVariant, instant: true }];
    });
  }, [activeVariant]);

  // Descarta las capas viejas cuando el fundido terminó
  useEffect(() => {
    if (layers.length <= 1) return undefined;
    const timer = setTimeout(() => setLayers((prev) => prev.slice(-1)), 900);
    return () => clearTimeout(timer);
  }, [layers]);

  return (
    <section ref={sectionRef} id="hero" className="relative z-10 mb-0">
      <div className="hero-portrait relative min-h-screen overflow-hidden bg-transparent">
        {layers.map((layer) => (
          <div key={layer.key} className={`hero-bg-layer${layer.instant ? " hero-bg-layer--enter" : ""}`}>
            <HeroThreeBackground
              variant={layer.variant}
              staticMode={prefersReducedMotion}
              revealActive={preloaded}
              instantReveal={layer.instant}
            />
          </div>
        ))}
        {heroImage && !imageError ? (
          <img
            src={resolvePublicAsset(heroImage)}
            alt={hero.title}
            onError={() => setImageError(true)}
            fetchPriority="high"
            className="hero-parallax-image absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-65 grayscale"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_42%,rgba(139,0,0,0.22),transparent_32%),linear-gradient(to_top,rgba(5,5,5,1)_0%,rgba(5,5,5,0.56)_38%,rgba(5,5,5,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,5,0.86)_0%,rgba(5,5,5,0.42)_42%,rgba(5,5,5,0.72)_100%)]" />
        <div className="hero-vignette pointer-events-none absolute inset-0" />

        <div className="relative flex min-h-screen flex-col justify-between px-6 pb-10 pt-28 md:px-12 md:pb-14 md:pt-32">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
            <p className="max-w-xs font-mono text-meta uppercase tracking-[0.42em] text-white/70">{hero.tagline}</p>
            <p className="hidden font-mono text-label uppercase tracking-[0.36em] text-white/35 md:block">{hero.meta}</p>
            <div className="md:text-right">
              <p className="font-mono text-label uppercase tracking-[0.32em] text-white/45">{hero.location}</p>
              <p className="mt-2 font-mono text-label uppercase tracking-[0.32em] text-raveRedBright">{hero.availability}</p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(300px,360px)] lg:items-end">
            <div>
              <h1 className="hero-title font-display text-[clamp(5rem,17vw,17rem)] font-bold uppercase leading-[0.72] tracking-[-0.085em] text-paper">
                {hero.title.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              <div className="mt-6 flex items-center gap-4">
                <span className="font-display text-xl font-bold uppercase tracking-[0.18em] text-raveRed">KEXXY</span>
                <span className="h-px w-10 bg-raveRed/50" />
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-caption uppercase tracking-[0.32em] text-white/55">
                  {hero.roles.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <p className="max-w-sm text-base leading-relaxed text-dim">{hero.description}</p>
              <a href="#work" className="group flex items-center gap-4 font-mono text-caption uppercase tracking-[0.32em] text-white/60 transition hover:text-white">
                <span className="h-px w-12 bg-raveRed/70 transition-all duration-500 group-hover:w-20 group-hover:bg-raveRed" />
                {hero.cta}
              </a>
              {!prefersReducedMotion ? (
                <HeroVariantSelector
                  variants={HERO_VARIANTS}
                  activeId={activeVariant.id}
                  labels={hero.shaderSelector}
                  onSelect={selectVariant}
                />
              ) : null}
              <div className={`flex items-center gap-3 transition-opacity duration-700 ${heroPassed ? "opacity-0" : "opacity-100"}`}>
                <div className="scroll-indicator h-8 w-px bg-white/20" />
                <span className="font-mono text-label uppercase tracking-[0.3em] text-white/20">{hero.scrollLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

