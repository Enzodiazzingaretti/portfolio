import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Terminal } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import { useLenis } from "../hooks/useLenis";
import { buildCategories } from "../categories";
import GrainOverlay from "../components/GrainOverlay";
import ColorSelector from "../components/ColorSelector";
import SonidoToggle from "../components/SonidoToggle";
import CustomCursor from "../components/CustomCursor";
import LanguageSelector from "../components/LanguageSelector";
import InfoPanel from "../components/InfoPanel";
import SignalCut from "../fx/SignalCut";
import Atmosphere from "../fx/Atmosphere";

const KonsoleEasterEgg = lazy(() => import("../components/KonsoleEasterEgg"));
const SITE_URL = "https://enzo-diaz-zingaretti.vercel.app";
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

  // Sin preloader desde el 2026-11-08: con las páginas pregeneradas el sitio
  // se ve al instante, y una pantalla de carga encima (1,2 s como mínimo)
  // iba contra eso. El componente queda en components/Preloader.jsx.
  const preloaded = true;
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

  // El fondo WebGL (las animaciones ASCII y, en el home, el vidrio) va en
  // todas las rutas: entra en su propio chunk, después del primer pintado.
  // Solo en dev: `?sinfondo` no monta el WebGL del hero. Sirve para grabar o
  // capturar en máquinas sin GPU, donde el render por software deja la
  // página a 1 cuadro cada pocos segundos. No viaja al build.
  const sinFondo = import.meta.env.DEV && new URLSearchParams(location.search).has("sinfondo");

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

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // La página pregenerada ya se reemplazó: se muestra (si estaba oculta por
  // otro idioma) y, al navegar, las entradas vuelven a animarse
  const rutaInicial = useMemo(() => location.pathname, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.documentElement.classList.remove("pre-oculto");
  }, []);
  useEffect(() => {
    if (location.pathname !== rutaInicial) document.documentElement.classList.remove("pre-montado");
  }, [location.pathname, rutaInicial]);

  useEffect(() => {
    // Las rutas de dos niveles (un caso de /tech) ponen su propio título: este
    // efecto corre después que el de la página y lo pisaría.
    if (location.pathname.split("/").filter(Boolean).length > 1) return;
    const active = categories.find((c) => location.pathname === `/${c.slug}`);
    const suffix = active ? ` — ${active.title}` : ` | ${content.ui.pageTitle ?? "Portfolio"}`;
    document.title = `${content.brand}${suffix}`;
  }, [location.pathname, categories, content.brand, content.ui.pageTitle]);

  /**
   * El canonical de index.html apunta al home. Sin corregirlo por ruta, cada
   * categoría y cada caso le decían a Google "soy el home" y no se indexaban
   * como páginas propias.
   */
  useEffect(() => {
    const link = document.querySelector('link[rel="canonical"]');
    // Con el prefijo de idioma (/en, /pt): el pathname del router no lo trae
    if (link) link.setAttribute("href", `${SITE_URL}${window.location.pathname}`);
  }, [location.pathname]);

  // Cada ruta arranca arriba; sin esto se hereda el scroll de la anterior
  useEffect(() => {
    scrollToTop();
  }, [location.pathname, scrollToTop]);

  const handleGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 10000);
  };

  return (
    <div className={`shell-root relative min-h-screen bg-ink text-paper selection:bg-raveRed/40${glitching ? " glitch-overdrive" : ""}`}>
      <a href="#main" className="skip-link">
        {content.ui.skipToContent ?? "Saltar al contenido"}
      </a>
      <Analytics />


      <Atmosphere />
      {!sinFondo ? (
        <Suspense fallback={null}>
          <HeroBackdrop home={isHome} revealActive={preloaded} />
        </Suspense>
      ) : null}
      <GrainOverlay />
      <CustomCursor />
      <SignalCut labels={{ home: navLabels.home }} />
      <Suspense fallback={null}>
        <KonsoleEasterEgg onGlitch={handleGlitch} labels={konsole} contact={content.contact} />
      </Suspense>

      <header className={`shell-bar${isHome && !scrolled ? " shell-bar--home" : ""}`}>
        <Link to="/" className="shell-brand font-mono" aria-label={navLabels.home}>
          <span className="shell-brand-mark" data-pulso aria-hidden="true" />
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
          <SonidoToggle labels={content.ui.sonido} />
          <ColorSelector labels={content.ui.paleta} />
          <LanguageSelector
            languages={content.languages}
            currentLanguage={language}
            onChange={changeLanguage}
          />
        </div>
      </header>

      <main id="main">
        <Outlet context={{ content, language, categories, preloaded, openPanel: setPanel }} />
      </main>

      {/* Firma al pie: el nombre a todo el ancho, en contorno, como el
          sello de un afiche. Decorativa: el nombre ya está en la barra. */}
      <div className="shell-signature" aria-hidden="true">
        <span className="shell-signature-name font-poster">{content.brand}</span>
      </div>

      <footer className="shell-footer">
        <p className="font-mono text-caption uppercase tracking-[0.25em] text-white/60">
          © {new Date().getFullYear()} Enzo Zingaretti
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
