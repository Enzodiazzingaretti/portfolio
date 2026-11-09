import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import AppRutas from "./AppRutas.jsx";
import { fijarContenidoInicial, forzarIdioma } from "./idiomaRuta";

export { siteContent } from "./siteContent.i18n.js";
export { buildCategories } from "./categories.js";
export { mergeContent } from "./hooks/useSiteContent.js";
export { caseHref } from "./cases/covers.js";

/**
 * Pregenera una página (scripts/prerender.mjs): el árbol real del sitio, con
 * el idioma fijo y, en español, lo editado en /admin. Espera a lo que entra
 * diferido (los casos), así el HTML trae la página entera.
 */
export async function render(url, idioma, contenidoEditable) {
  forzarIdioma(idioma);
  fijarContenidoInicial(idioma === "es" ? contenidoEditable : null);
  const basename = idioma === "es" ? undefined : `/${idioma}`;
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter basename={basename} location={url}>
      <AppRutas />
    </StaticRouter>,
  );
  let html = "";
  for await (const parte of prelude) html += parte;
  return html;
}
