/**
 * Portada y año de cada caso para las tarjetas-afiche del home.
 *
 * No se importa `CASE_ASSETS` porque ese módulo trae los textos de los tres
 * idiomas y entra lazy con la página del caso: el home no tiene por qué
 * bajarlos. Un test compara estas rutas con las de `CASE_ASSETS`, así que si
 * una portada cambia allá y no acá, falla.
 */
export const CASE_COVERS = {
  portfolio: { category: "tech", src: "/images/casos/portfolio/hero.webp", figure: "hero", year: "2025–2026" },
  "andino-seguros": { category: "tech", src: "/images/casos/andino-seguros/home.webp", figure: "home", year: "2026" },
  "tamara-gonzalez": { category: "tech", src: "/images/casos/tamara-gonzalez/home.webp", figure: "home", year: "2026" },
  "press-kits": { category: "tech", src: "/images/casos/press-kits/portadas.webp", figure: "portadas", year: "2025–2026" },
};

/**
 * Ruta de un caso: cuelga de la categoría de su trabajo (/tech/<slug> para
 * los sitios). Un test la compara con la `category` de `CASE_ASSETS`.
 */
export const caseHref = (slug) => `/${CASE_COVERS[slug]?.category ?? "tech"}/${slug}`;
