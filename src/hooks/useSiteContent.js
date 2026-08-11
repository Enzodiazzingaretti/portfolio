import { useEffect, useMemo, useState } from "react";
import { siteContent } from "../siteContent.i18n.js";
import { getStoredLanguage, setStoredLanguage } from "../utils/helpers";

// Merge profundo; los arrays se reemplazan enteros. Superpone el content.json
// editable (solo español) sobre los defaults embebidos del bundle.
function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function mergeContent(defaults, incoming) {
  if (incoming == null) return defaults;
  if (!isObject(defaults) || !isObject(incoming)) return incoming;
  const out = { ...defaults };
  for (const k of Object.keys(incoming)) out[k] = mergeContent(defaults[k], incoming[k]);
  return out;
}

/**
 * Idioma + contenido editable resueltos en un solo lugar.
 * Antes vivía dentro de App.jsx; ahora lo consume el Shell y baja por contexto.
 */
export function useSiteContent() {
  const [language, setLanguage] = useState(() => {
    const fallback = siteContent.defaultLanguage;
    const saved = getStoredLanguage();
    return siteContent.locales[saved] ? saved : fallback;
  });

  const [override, setOverride] = useState(null);
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
          touchDesignerLoops: editable.touchDesignerLoops ?? base.touchDesignerLoops,
          blenderWorks: editable.blenderWorks ?? base.blenderWorks,
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
      touchDesignerLoops: enabled(localized.touchDesignerLoops),
      blenderWorks: enabled(localized.blenderWorks),
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
    setLanguage(next);
    setStoredLanguage(next);
  };

  return { content, language, changeLanguage };
}
