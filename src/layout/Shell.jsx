import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Terminal } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import { useLenis } from "../hooks/useLenis";
import { buildCategories } from "../categories";
import GrainOverlay from "../components/GrainOverlay";
import CustomCursor from "../components/CustomCursor";
import LanguageSelector from "../components/LanguageSelector";
import InfoPanel from "../components/InfoPanel";
import Preloader from "../components/Preloader";

const KonsoleEasterEgg = lazy(() => import("../components/KonsoleEasterEgg"));
// three.js fuera del bundle inicial: entra recién cuando el preloader terminó
const HeroBackdrop = lazy(() => import("../components/HeroBackdrop"));

/**
 * Shell persistente: fondo three.js, barra, paneles y grano viven acá, fuera
 * de <Routes>. Al cambiar de categoría solo se reemplaza el <Outlet />, así el
 * contexto WebGL no se recrea en cada navegación.
 */
export default function Shell() {
  const { content, language, changeLanguage } = useSiteContent();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [preloaded, setPreloaded] = useState(false);
  const [panel, setPanel] = useState(null);
  const [glitching, setGlitching] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /**
   * En el home la barra se disuelve sobre el hero, pero el fondo WebGL es
   * fijo: al bajar a Sobre mí o al índice el campo ASCII sigue detrás y la
   * nav se pierde entre los caracteres. Recupera fondo apenas se scrollea.
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = useMemo(() => buildCategories(content), [content]);
  const navLabels = content.ui.nav;
  const a11y = content.ui.a11y;
  const konsole = content.ui.konsole;

  const { scrollToTop, scrollToSection } = useLenis(Boolean(panel) || !preloaded);

  /**
   * En el home, Sobre mí y Contacto son secciones de la página: la barra
   * scrollea hasta ellas en vez de abrir un panel que diría lo mismo. En las
   * rutas de categoría no están a la vista, así que ahí sí abre el panel.
   */
  const irASeccion = (kind) => {
    if (isHome) scrollToSection(kind);
    else setPanel(kind);
  };

  // Precarga solo las portadas del índice: 4 miniaturas, no la obra entera
  const criticalAssets = useMemo(
    () =>
      categories
        .map((category) => category.groups[0]?.items?.[0]?.thumbnail)
        .filter(Boolean)
        .filter((src) => !/\.(mp4|webm|mov)$/i.test(src))
        .map((src) => src.replace(/\.(png|jpe?g)$/i, ".webp")),
    [categories],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const active = categories.find((c) => location.pathname === `/${c.slug}`);
    const suffix = active ? ` — ${active.title}` : ` | ${content.ui.pageTitle ?? "Portfolio"}`;
    document.title = `${content.brand}${suffix}`;
  }, [location.pathname, categories, content.brand, content.ui.pageTitle]);

  // Cada ruta arranca arriba; sin esto se hereda el scroll de la anterior
  useEffect(() => {
    scrollToTop();
  }, [location.pathname, scrollToTop]);

  const handleGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 10000);
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-raveRed/40${glitching ? " glitch-overdrive" : ""}`}>
      <a href="#main" className="skip-link">
        {content.ui.skipToContent ?? "Saltar al contenido"}
      </a>
      <Analytics />

      {!preloaded && (
        <Preloader onDone={() => setPreloaded(true)} criticalAssets={criticalAssets} lines={content.ui.boot} />
      )}

      <Suspense fallback={null}>
        <HeroBackdrop active={isHome} revealActive={preloaded} />
      </Suspense>
      <GrainOverlay />
      <CustomCursor />
      <Suspense fallback={null}>
        <KonsoleEasterEgg onGlitch={handleGlitch} labels={konsole} />
      </Suspense>

      <header className={`shell-bar${isHome && !scrolled ? " shell-bar--home" : ""}`}>
        <Link to="/" className="shell-brand font-mono" aria-label={navLabels.home}>
          <span className="shell-brand-mark" aria-hidden="true" />
          <span className="shell-brand-text">{content.brand}</span>
        </Link>

        <nav className="shell-nav" aria-label={navLabels.index}>
          {categories.map((category) => (
            <NavLink
              key={category.id}
              to={`/${category.slug}`}
              className={({ isActive }) => `shell-nav-link font-mono${isActive ? " is-active" : ""}`}
            >
              {category.title}
            </NavLink>
          ))}
        </nav>

        <div className="shell-actions">
          <button type="button" onClick={() => irASeccion("about")} className="shell-nav-link font-mono">
            {navLabels.about}
          </button>
          <button type="button" onClick={() => irASeccion("contact")} className="shell-nav-link font-mono">
            {navLabels.contact}
          </button>
          <LanguageSelector
            languages={content.languages}
            currentLanguage={language}
            onChange={changeLanguage}
          />
        </div>
      </header>

      <main id="main">
        <Outlet context={{ content, categories, preloaded, openPanel: setPanel }} />
      </main>

      <footer className="shell-footer">
        <p className="font-mono text-caption uppercase tracking-[0.25em] text-white/60">
          © {new Date().getFullYear()} Enzo Diaz Zingaretti
        </p>
        <p className="hidden font-mono text-caption uppercase tracking-[0.25em] text-white/52 sm:block">
          {content.ui.footerLocation}
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-konsole"))}
          aria-label={a11y.openConsole}
          className="font-mono text-caption uppercase tracking-[0.25em] text-white/48 transition-colors hover:text-raveRedBright"
        >
          <span className="hidden sm:inline">// {konsole.hintLong}</span>
          <span className="sm:hidden">// {konsole.hintShort}</span>
        </button>
        <a href="/admin" aria-label={a11y.adminPanel} title={a11y.adminPanel} className="text-white/48 transition-colors hover:text-raveRedBright">
          <Terminal size={15} strokeWidth={1.5} />
        </a>
      </footer>

      <InfoPanel
        open={Boolean(panel)}
        kind={panel}
        content={content}
        labels={{ ...navLabels, contactLabels: content.ui.contactLabels }}
        onClose={() => setPanel(null)}
      />
    </div>
  );
}
