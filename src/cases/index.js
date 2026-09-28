import es from "./es.js";
import en from "./en.js";
import pt from "./pt.js";

/**
 * Casos de estudio de /web. Este módulo entra solo con la página de caso
 * (lazy): el home y las categorías no cargan estos textos.
 *
 * El título, la bajada y el orden de cada caso viven en `siteContent.i18n.js`
 * (`cases`), porque el home y las tarjetas de /web también los muestran. Acá va
 * el cuerpo. Los textos no se editan desde /admin: son código, como
 * `about.facts`.
 *
 * `w` y `h` son las medidas reales de cada imagen: van al <img> para que el
 * navegador reserve el lugar antes de que cargue (sin saltos de layout), y un
 * test los compara con el archivo.
 */
export const CASE_ASSETS = {
  portfolio: {
    category: "web",
    year: "2025–2026",
    stack: ["React 19", "Vite", "Three.js", "GLSL", "Tailwind CSS", "Vercel Functions", "Vitest"],
    site: null, // es este sitio
    repo: "https://github.com/Enzodiazzingaretti/portfolio",
    figures: {
      hero: { src: "/images/casos/portfolio/hero.webp", w: 1600, h: 1000 },
      ascii: { src: "/images/casos/portfolio/ascii.webp", w: 1040, h: 650 },
      mobile: { src: "/images/casos/portfolio/mobile.webp", w: 739, h: 1600 },
      lab: { src: "/images/casos/portfolio/lab-comunion.webp", w: 1000, h: 750 },
      lab2: { src: "/images/casos/portfolio/lab-salmo.webp", w: 1000, h: 750 },
    },
  },
  "tamara-gonzalez": {
    category: "web",
    year: "2026",
    stack: ["React 19", "Vite", "Tailwind CSS", "Framer Motion", "Vercel Functions", "GitHub API", "Vitest"],
    site: "https://tamara-portfolio-xi.vercel.app/",
    repo: "https://github.com/Enzodiazzingaretti/tamara-portfolio",
    figures: {
      home: { src: "/images/casos/tamara-gonzalez/home.webp", w: 1600, h: 1000 },
      panel: { src: "/images/casos/tamara-gonzalez/panel.webp", w: 1600, h: 1000 },
      gallery: { src: "/images/casos/tamara-gonzalez/galeria.webp", w: 1100, h: 480 },
      mobile: { src: "/images/casos/tamara-gonzalez/mobile.webp", w: 739, h: 1600 },
    },
  },
  "ctrl-z": {
    category: "web",
    year: "2026",
    stack: ["HTML", "CSS", "JavaScript", "Vercel Functions", "GitHub API"],
    site: "https://ctrlz-presskit.vercel.app/",
    repo: "https://github.com/Enzodiazzingaretti/ctrlz-presskit",
    figures: {
      cover: { src: "/images/casos/ctrl-z/portada.webp", w: 1600, h: 1000 },
      rider: { src: "/images/casos/ctrl-z/rider.webp", w: 1200, h: 935 },
      mobile: { src: "/images/casos/ctrl-z/mobile.webp", w: 739, h: 1600 },
      photos: { src: "/images/casos/ctrl-z/fotos.webp", w: 1600, h: 780 },
    },
  },
};

export const CASE_UI = {
  es: {
    label: "Caso",
    back: "Proyectos web",
    role: "Rol",
    year: "Año",
    stack: "Stack",
    site: "Abrir sitio",
    code: "Ver código",
    discarded: "Descartado",
    next: "Siguiente caso",
    all: "Todos los proyectos web",
  },
  en: {
    label: "Case study",
    back: "Web projects",
    role: "Role",
    year: "Year",
    stack: "Stack",
    site: "Visit site",
    code: "View code",
    discarded: "Ruled out",
    next: "Next case study",
    all: "All web projects",
  },
  pt: {
    label: "Case",
    back: "Projetos web",
    role: "Papel",
    year: "Ano",
    stack: "Stack",
    site: "Abrir site",
    code: "Ver código",
    discarded: "Descartado",
    next: "Próximo case",
    all: "Todos os projetos web",
  },
};

export const CASE_BODIES = { es, en, pt };
