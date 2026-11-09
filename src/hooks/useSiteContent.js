import { useEffect, useMemo, useState } from "react";
import { siteContent } from "../siteContent.i18n.js";
import { getStoredLanguage, setStoredLanguage } from "../utils/helpers";
import { contenidoDeInicio, esBuscador, idiomaForzado, prefijoDe, rutaEn } from "../idiomaRuta";

// Merge profundo; los arrays se reemplazan enteros. Superpone el content.json
// editable (solo español) sobre los defaults embebidos del bundle.
function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

export function mergeContent(defaults, incoming) {
  if (incoming == null) return defaults;
  if (!isObject(defaults) || !isObject(incoming)) return incoming;
  const out = { ...defaults };
  for (const k of Object.keys(incoming)) out[k] = mergeContent(defaults[k], incoming[k]);
  return out;
}

/**
 * Sin una elección guardada, el idioma sale del navegador. El portfolio apunta
 * a trabajo remoto: un reclutador de afuera no tiene por qué aterrizar en
 * español y buscar el selector. Si ninguna preferencia del navegador es un
 * idioma del sitio, inglés.
 */
export function idiomaDelNavegador(locales) {
  try {
    const preferencias = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const etiqueta of preferencias) {
      const base = String(etiqueta || "").slice(0, 2).toLowerCase();
      if (locales[base]) return base;
    }
  } catch {
    /* sin navigator: se usa el default */
  }
  return locales.en ? "en" : null;
}

/**
 * Idioma + contenido editable resueltos en un solo lugar.
 * Antes vivía dentro de App.jsx; ahora lo consume el Shell y baja por contexto.
 */
export function useSiteContent() {
  const [language, setLanguage] = useState(() => {
    if (idiomaForzado()) return idiomaForzado();
    if (typeof window !== "undefined") {
      const prefijo = prefijoDe(window.location.pathname);
      if (prefijo) return prefijo;
      if (esBuscador()) return "es";
    }
    const saved = getStoredLanguage();
    if (siteContent.locales[saved]) return saved;
    return idiomaDelNavegador(siteContent.locales) ?? siteContent.defaultLanguage;
  });

  const [override, setOverride] = useState(contenidoDeInicio);
  useEffect(() => {
    fetch("/content.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setOverride(d);
      })
      .catch(() => {});
  }, []);

  const content = useMemo(() => {
    const editable = override || {};
    const base = siteContent.locales[language] ?? siteContent.locales[siteContent.defaultLanguage];
    const isEs = language === "es";
    const localized = isEs
      ? {
          ...base,
          hero: mergeContent(base.hero, editable.hero),
          about: mergeContent(base.about, editable.about),
          contact: mergeContent(base.contact, editable.contact),
          webProjects: editable.webProjects ?? base.webProjects,
          motionReels: editable.motionReels ?? base.motionReels,
          aiCommercials: editable.aiCommercials ?? base.aiCommercials,
          touchDesignerLoops: editable.touchDesignerLoops ?? base.touchDesignerLoops,
          blenderWorks: editable.blenderWorks ?? base.blenderWorks,
          campaigns: editable.campaigns ?? base.campaigns,
          flyers: editable.flyers ?? base.flyers,
          logos: editable.logos ?? base.logos,
          espacios: editable.espacios ?? base.espacios,
          labPieces: editable.labPieces ?? base.labPieces,
        }
      : base;

    const enabled = (arr) => (Array.isArray(arr) ? arr.filter((x) => x && x.enabled !== false) : arr);
    const mergedLinks = { ...siteContent.contactLinks, ...(editable.contactLinks || {}) };

    return {
      ...localized,
      webProjects: enabled(localized.webProjects),
      motionReels: enabled(localized.motionReels),
      aiCommercials: enabled(localized.aiCommercials),
      touchDesignerLoops: enabled(localized.touchDesignerLoops),
      blenderWorks: enabled(localized.blenderWorks),
      campaigns: enabled(localized.campaigns),
      flyers: enabled(localized.flyers),
      logos: enabled(localized.logos),
      espacios: enabled(localized.espacios),
      brand: siteContent.brand,
      heroImage: siteContent.heroImage,
      languages: siteContent.languages,
      contact: { ...localized.contact, ...mergedLinks },
    };
  }, [language, override]);

  const changeLanguage = (next) => {
    if (!siteContent.locales[next]) return;
    setStoredLanguage(next);
    // En una URL con idioma (/en/…, /pt/…) el idioma es la URL: se va a la
    // misma página en el otro. Sin prefijo, cambia en el lugar, como siempre.
    if (prefijoDe(window.location.pathname)) {
      window.location.assign(rutaEn(next, window.location.pathname) + window.location.search);
      return;
    }
    setLanguage(next);
  };

  return { content, language, changeLanguage };
}
