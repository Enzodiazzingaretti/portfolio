import { useState } from "react";
import LanguageSelector from "./LanguageSelector";

/**
 * Navbar - Barra de navegación fija con selector de idioma
 * @param {Object} props
 * @param {Array<{label: string, href: string, external?: boolean}>} props.nav - Items de navegación
 * @param {Array<{code: string, label: string, name: string}>} props.languages - Idiomas disponibles
 * @param {string} props.currentLanguage - Código del idioma actual
 * @param {Function} props.onLanguageChange - Callback al cambiar idioma
 * @param {boolean} props.scrolled - Si se ha scrolleado (para estilos)
 * @param {boolean} props.navVisible - Si la navbar debe ser visible
 */
export default function Navbar({ nav, languages, currentLanguage, onLanguageChange, scrolled, navVisible }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  const internalLinks = nav.filter((i) => !i.external);
  const externalLinks = nav.filter((i) => i.external);

  return (
    <header className={`fixed left-0 top-0 z-50 w-full px-4 pt-4 transition-all duration-500 md:px-8 ${navVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>

      {/* Desktop — centered pill */}
      <nav className={`mx-auto hidden max-w-fit items-center border border-white/[0.07] backdrop-blur-xl transition-all duration-500 md:flex ${scrolled ? "bg-ink/85 shadow-xl shadow-black/40" : "bg-ink/25"}`}>
        {internalLinks.map((item, idx) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-link relative px-5 py-[11px] font-mono text-label uppercase tracking-[0.26em] text-white/60 transition-colors duration-200 hover:text-white"
          >
            {item.label}
            {idx < internalLinks.length - 1 && (
              <span className="absolute right-0 top-1/2 h-3 w-px -translate-y-1/2 bg-white/[0.07]" />
            )}
          </a>
        ))}
        <span className="h-3 w-px bg-white/[0.07]" />
        <div className="px-4 py-[11px]">
          <LanguageSelector languages={languages} currentLanguage={currentLanguage} onChange={onLanguageChange} />
        </div>
        {externalLinks.map((item) => (
          <span key={item.href} className="flex items-center">
            <span className="h-3 w-px bg-white/[0.07]" />
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-[11px] font-mono text-label uppercase tracking-[0.26em] text-raveRed/80 transition-colors duration-200 hover:text-raveRed"
            >
              {item.label} ↗
            </a>
          </span>
        ))}
      </nav>

      {/* Mobile */}
      <nav className={`mx-auto flex items-center justify-between border border-white/[0.07] px-4 py-3 backdrop-blur-xl transition-all duration-500 md:hidden ${scrolled ? "bg-ink/85" : "bg-ink/25"}`}>
        <LanguageSelector languages={languages} currentLanguage={currentLanguage} onChange={onLanguageChange} />
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="-my-2 -mr-1 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
        >
          <span className={`block h-px w-5 bg-white/60 transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-white/60 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-white/60 transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mx-auto mt-px overflow-hidden border border-white/[0.06] backdrop-blur-xl transition-all duration-300 md:hidden ${menuOpen ? "max-h-96 bg-ink/95" : "max-h-0 border-transparent"}`}>
        <div className="flex flex-col px-5 py-3">
          {internalLinks.map((item) => (
            <a
              key={`mob-${item.href}`}
              href={item.href}
              onClick={handleNavClick}
              className="border-b border-white/[0.05] py-3 font-mono text-caption uppercase tracking-[0.28em] text-white/65 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
          {externalLinks.map((item) => (
            <a
              key={`mob-ext-${item.href}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={handleNavClick}
              className="pt-3 font-mono text-caption uppercase tracking-[0.28em] text-raveRed/60 transition hover:text-raveRed"
            >
              {item.label} ↗
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
