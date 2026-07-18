import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { siteContent } from "./siteContent.i18n.js";
import { getStoredLanguage, setStoredLanguage } from "./utils/helpers";
import { useProjectDetails } from "./hooks/useProjectDetails";
import { useScrollBehavior } from "./hooks/useScrollBehavior";
import { useScrollFocus } from "./hooks/useScrollFocus";
import { useLenis } from "./hooks/useLenis";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import SelectedWorkCard from "./components/SelectedWorkCard";
import MotionCard from "./components/MotionCard";
import RenderCarousel from "./components/RenderCarousel";
import DetailModal from "./components/DetailModal";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Preloader from "./components/Preloader";
import GrainOverlay from "./components/GrainOverlay";
import HudOverlay from "./components/HudOverlay";
import SideNav from "./components/SideNav";

const HeroSection = lazy(() => import("./components/HeroSection"));
const KonsoleEasterEgg = lazy(() => import("./components/KonsoleEasterEgg"));
// Lazy como el hero: saca three.js del bundle inicial (~840kB → mitad)
const GlobalFX = lazy(() => import("./components/GlobalFX"));

export default function App() {
  const [language, setLanguage] = useState(() => {
    const fallback = siteContent.defaultLanguage;
    const saved = getStoredLanguage();
    return siteContent.locales[saved] ? saved : fallback;
  });
  const localizedContent = siteContent.locales[language] ?? siteContent.locales[siteContent.defaultLanguage];
  const content = {
    ...localizedContent,
    brand: siteContent.brand,
    heroImage: siteContent.heroImage,
    languages: siteContent.languages,
    contact: {
      ...localizedContent.contact,
      ...siteContent.contactLinks,
    },
  };
  const s = content.sections;
  const [viewer, setViewer] = useState(null);
  const [preloaded, setPreloaded] = useState(false);
  const [glitching, setGlitching] = useState(false);

  const handleGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 10000);
  };
  const { scrolled, navVisible, heroPassed, scrollProgress } = useScrollBehavior();
  useScrollFocus("#renders .scroll-focus-item");
  useLenis(Boolean(viewer) || !preloaded);

  const pageTitle = `${content.brand} | ${content.ui.pageTitle ?? "Portfolio"}`;

  useEffect(() => {
    document.title = pageTitle;
    document.documentElement.lang = language;
  }, [pageTitle, language]);

  /**
   * Cambia el idioma actual y guarda en localStorage
   * @param {string} nextLanguage - Código del idioma (es, en, pt)
   */
  const handleLanguageChange = (nextLanguage) => {
    if (!siteContent.locales[nextLanguage]) return;
    setLanguage(nextLanguage);
    setViewer(null);
    setStoredLanguage(nextLanguage);
  };

  const { webProjectDetails, loopDetails, blenderDetails } = useProjectDetails(content);

  const criticalAssets = useMemo(() => [
    ...webProjectDetails.map((p) => p.thumbnail),
    ...loopDetails.slice(0, 6).map((p) => p.thumbnail),
    ...blenderDetails.slice(0, 4).map((p) => p.thumbnail),
  ].filter(Boolean)
    .filter((src) => !src.endsWith(".mp4") && !src.endsWith(".webm"))
    .map((src) => src.replace(/\.(png|jpe?g)$/i, ".webp")),
  [webProjectDetails, loopDetails, blenderDetails]);

  useEffect(() => {
    let observer;
    const raf = requestAnimationFrame(() => {
      const nodes = document.querySelectorAll(".reveal-on-scroll:not(.is-visible)");
      if (!nodes.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -2% 0px" },
      );

      nodes.forEach((node) => observer.observe(node));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [language]);

  useEffect(() => {
    if (!viewer) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setViewer(null);
      if (event.key === "ArrowLeft") {
        setViewer((current) => {
          if (!current) return current;
          const total = current.items[current.index].slides?.length ?? 0;
          if (total <= 1) return current;
          return { ...current, slideIndex: (current.slideIndex - 1 + total) % total };
        });
      }
      if (event.key === "ArrowRight") {
        setViewer((current) => {
          if (!current) return current;
          const total = current.items[current.index].slides?.length ?? 0;
          if (total <= 1) return current;
          return { ...current, slideIndex: (current.slideIndex + 1) % total };
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer]);

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-progress", scrollProgress.toFixed(4));
  }, [scrollProgress]);

  return (
    <div className={`tribal-fluid relative min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-raveRed/40${glitching ? " glitch-overdrive" : ""}`}>
      <a href="#main" className="skip-link">{content.ui.skipToContent ?? "Saltar al contenido"}</a>
      <Analytics />
      {!preloaded && <Preloader onDone={() => setPreloaded(true)} criticalAssets={criticalAssets} />}
      {preloaded && <Suspense fallback={null}><GlobalFX scrollProgress={scrollProgress} /></Suspense>}
      <GrainOverlay />
      <HudOverlay language={language} />
      <Suspense fallback={null}><KonsoleEasterEgg onGlitch={handleGlitch} /></Suspense>
      <CustomCursor />
      <SideNav nav={content.nav} />

      <Navbar
        nav={content.nav}
        languages={content.languages}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        scrolled={scrolled}
        navVisible={navVisible}
      />

      <Suspense fallback={<div className="relative min-h-screen bg-ink" />}>
        <HeroSection
          hero={content.hero}
          heroImage={content.heroImage}
          heroPassed={heroPassed}
          preloaded={preloaded}
        />
      </Suspense>

      <main id="main" className="relative z-10 mx-auto max-w-7xl px-6 pb-44 pt-32 md:px-12 md:pt-44">
        <AboutSection
          section={s.about}
          about={content.about}
          brand={content.brand}
          cta={content.ui.aboutCta}
        />

        <section id="work" aria-label={s.webReleases.title} className="mb-32 md:mb-44">
          <SectionHeading
            index={s.webReleases.index}
            title={s.webReleases.title}
            subtitle={s.webReleases.subtitle}
          />
          <div className="grid gap-20 md:gap-28">
            {webProjectDetails.map((project, index) => (
              <SelectedWorkCard
                key={project.title}
                project={project}
                index={index}
                labels={content.ui}
                onOpen={() => setViewer({ sectionLabel: s.webReleases.index, items: webProjectDetails, index, slideIndex: 0 })}
              />
            ))}
          </div>
        </section>

        <section
          id="motion"
          aria-label={s.touchDesigner.title}
          className="motion-section relative mb-32 overflow-hidden md:mb-44"
          style={{ marginLeft: "calc(-1 * var(--page-px))", marginRight: "calc(-1 * var(--page-px))" }}
        >
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          <div className="relative z-10 py-16 md:py-20" style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}>
            <SectionHeading
              index={s.touchDesigner.index}
              title={s.touchDesigner.title}
              subtitle={s.touchDesigner.subtitle}
            />
            <div className="motion-grid grid gap-5 md:grid-cols-3 md:gap-6">
              {loopDetails.map((loop, index) => (
                <MotionCard
                  key={loop.title}
                  loop={loop}
                  index={index}
                  loopLabel={content.ui.loopLabel}
                  onOpen={() => setViewer({ sectionLabel: s.touchDesigner.index, items: loopDetails, index, slideIndex: 0 })}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="renders" aria-label={s.blender.title} className="mb-32 md:mb-44">
          <SectionHeading
            index={s.blender.index}
            title={s.blender.title}
            subtitle={s.blender.subtitle}
          />
          <RenderCarousel
            works={blenderDetails}
            sectionLabel={s.blender.index}
            navLabels={content.ui.modal}
            onOpen={(index) => setViewer({ sectionLabel: s.blender.index, items: blenderDetails, index, slideIndex: 0 })}
          />
        </section>

        <section
          id="flyers"
          aria-label={s.flyers.title}
          className="section-band relative mb-32 md:mb-44"
          style={{ marginLeft: "calc(-1 * var(--page-px))", marginRight: "calc(-1 * var(--page-px))" }}
        >
          <div className="py-16 md:py-20" style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}>
            <SectionHeading
              index={s.flyers.index}
              title={s.flyers.title}
              subtitle={s.flyers.subtitle}
            />
            <RenderCarousel
              works={content.flyers}
              sectionLabel={s.flyers.index}
              navLabels={content.ui.modal}
              onOpen={(index) => setViewer({ sectionLabel: s.flyers.index, items: content.flyers.map((f) => ({ ...f, thumbnail: f.imageUrl, subtitle: f.type, slides: f.slides ?? [] })), index, slideIndex: 0 })}
            />
          </div>
        </section>

        <section id="logos" aria-label={s.logos.title} className="mb-32 md:mb-44">
          <SectionHeading
            index={s.logos.index}
            title={s.logos.title}
            subtitle={s.logos.subtitle}
          />
          <RenderCarousel
            works={content.logos}
            sectionLabel={s.logos.index}
            cardHeight={340}
            navLabels={content.ui.modal}
            onOpen={(index) => setViewer({ sectionLabel: s.logos.index, items: content.logos.map((l) => ({ ...l, thumbnail: l.imageUrl, subtitle: l.type, slides: l.slides ?? [] })), index, slideIndex: 0 })}
          />
        </section>

        <section
          id="espacios"
          aria-label={s.espacios.title}
          className="section-band relative mb-32 md:mb-44"
          style={{ marginLeft: "calc(-1 * var(--page-px))", marginRight: "calc(-1 * var(--page-px))" }}
        >
          <div className="py-16 md:py-20" style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}>
            <SectionHeading
              index={s.espacios.index}
              title={s.espacios.title}
              subtitle={s.espacios.subtitle}
            />
            <RenderCarousel
              works={content.espacios}
              sectionLabel={s.espacios.index}
              navLabels={content.ui.modal}
              onOpen={(index) => setViewer({ sectionLabel: s.espacios.index, items: content.espacios.map((e) => ({ ...e, thumbnail: e.imageUrl, subtitle: e.type, slides: e.slides ?? [] })), index, slideIndex: 0 })}
            />
          </div>
        </section>

        <ContactSection
          section={s.contact}
          contact={content.contact}
          labels={content.ui.contactLabels}
        />
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-caption uppercase tracking-[0.25em] text-white/50">© {new Date().getFullYear()} Enzo Diaz Zingaretti</p>
          <p className="hidden font-mono text-caption uppercase tracking-[0.25em] text-white/40 sm:block">{content.ui.footerLocation}</p>
          <a
            href="#hero"
            className="group flex items-center gap-2 font-mono text-caption uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            {content.ui.backToTop ?? "Inicio"}
          </a>
        </div>
      </footer>

      <DetailModal
        viewer={viewer}
        setViewer={setViewer}
        onClose={() => setViewer(null)}
        labels={content.ui.modal}
      />
    </div>
  );
}
