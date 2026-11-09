/**
 * Pregenera cada página del sitio en los tres idiomas (2026-11-08): el HTML
 * real de cada ruta, con su título, descripción, canonical y las versiones en
 * los otros idiomas (hreflang). Google lee todas las obras sin ejecutar
 * JavaScript, y el visitante ve la página antes de que cargue el JS (React la
 * reemplaza por la misma al montar).
 *
 * Corre después de `vite build` y de `vite build --ssr src/entry-prerender.jsx`
 * (ver "build" en package.json). Escribe dist/<ruta>/index.html, dist/en/… y
 * dist/pt/…, y deja dist/app.html como página vacía para el resto de las rutas
 * (el /admin, un 404), que es a donde apunta el rewrite de vercel.json.
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(raiz, "dist");
const SITIO = "https://enzo-diaz-zingaretti.vercel.app";
const IDIOMAS = ["es", "en", "pt"];
const LOCALE = { es: "es_AR", en: "en_US", pt: "pt_BR" };

const ssr = await import(pathToFileURL(join(raiz, "dist-ssr", "entry-prerender.js")).href);
const plantilla = await readFile(join(dist, "index.html"), "utf8");
const editable = JSON.parse(await readFile(join(raiz, "public", "content.json"), "utf8"));

const esc = (t = "") => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const url = (idioma, ruta) => `${SITIO}${idioma === "es" ? "" : `/${idioma}`}${ruta === "/" ? (idioma === "es" ? "/" : "") : ruta}`;

// El contenido de cada idioma, como lo arma useSiteContent
function contenido(idioma) {
  const base = ssr.siteContent.locales[idioma];
  if (idioma !== "es") return base;
  const out = { ...base };
  for (const k of ["hero", "about", "contact"]) if (editable[k]) out[k] = ssr.mergeContent(base[k], editable[k]);
  for (const [k, v] of Object.entries(editable)) if (Array.isArray(v)) out[k] = v;
  return out;
}

// Las rutas: el home, las categorías y los casos
function rutas() {
  const c = contenido("es");
  const cats = ssr.buildCategories(c);
  const lista = [{ ruta: "/", tipo: "home" }];
  for (const cat of cats) lista.push({ ruta: `/${cat.slug}`, tipo: "categoria", slug: cat.slug });
  for (const caso of c.cases ?? []) lista.push({ ruta: ssr.caseHref(caso.slug), tipo: "caso", slug: caso.slug });
  return lista;
}

function meta(idioma, pagina) {
  const c = contenido(idioma);
  const marca = c.brand ?? "Enzo Zingaretti";
  const titular = c.hero?.headline ?? "Motion & 3D Designer";
  if (pagina.tipo === "categoria") {
    const cat = ssr.buildCategories(c).find((x) => x.slug === pagina.slug);
    return { titulo: `${cat.title} — ${marca} · ${titular}`, desc: cat.subtitle || cat.kicker || c.hero?.description };
  }
  if (pagina.tipo === "caso") {
    const caso = (c.cases ?? []).find((x) => x.slug === pagina.slug);
    return { titulo: `${caso?.title ?? pagina.slug} — ${marca}`, desc: caso?.summary ?? c.hero?.description };
  }
  return { titulo: `Enzo Diaz Zingaretti — ${titular}`, desc: c.hero?.description };
}

function cabecera(html, idioma, pagina) {
  const { titulo, desc } = meta(idioma, pagina);
  const propia = url(idioma, pagina.ruta);
  const alternas = [
    ...IDIOMAS.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l, pagina.ruta)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${url("es", pagina.ruta)}" />`,
  ].join("\n    ");
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${idioma}" data-pre="${idioma}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(titulo)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${propia}" />\n    ${alternas}`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${propia}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(titulo)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${LOCALE[idioma]}" />`);
}

// La página vacía para lo que no se pregenera (admin, 404): la plantilla tal cual
await writeFile(join(dist, "app.html"), plantilla);

const paginas = rutas();
let n = 0;
for (const idioma of IDIOMAS) {
  for (const pagina of paginas) {
    const cuerpo = await ssr.render(idioma === "es" ? pagina.ruta : `/${idioma}${pagina.ruta === "/" ? "" : pagina.ruta}`, idioma, editable);
    const html = cabecera(plantilla, idioma, pagina).replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);
    const destino = join(dist, idioma === "es" ? "" : idioma, pagina.ruta === "/" ? "" : pagina.ruta, "index.html");
    await mkdir(dirname(destino), { recursive: true });
    await writeFile(destino, html);
    n += 1;
  }
}
// El sitemap sale de las mismas rutas: cada página con sus tres idiomas
const hoy = new Date().toISOString().slice(0, 10);
const entradas = paginas.flatMap((pagina) =>
  IDIOMAS.map((idioma) => {
    const alternas = [...IDIOMAS.map((l) => [l, url(l, pagina.ruta)]), ["x-default", url("es", pagina.ruta)]]
      .map(([l, h]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${h}" />`)
      .join("\n");
    const prioridad = pagina.tipo === "home" ? "1.0" : pagina.tipo === "categoria" ? "0.8" : "0.7";
    return `  <url>\n    <loc>${url(idioma, pagina.ruta)}</loc>\n${alternas}\n    <lastmod>${hoy}</lastmod>\n    <priority>${prioridad}</priority>\n  </url>`;
  }),
);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entradas.join("\n")}\n</urlset>\n`,
);

await rm(join(raiz, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: ${n} páginas (${paginas.length} rutas × ${IDIOMAS.length} idiomas)`);
