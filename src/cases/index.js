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
  "andino-seguros": {
    category: "web",
    year: "2026",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "Zod", "Sanity", "Supabase", "Vercel"],
    site: "https://andino-seguros.vercel.app/",
    // El repo es de un cliente y es privado: sin botón de código.
    repo: null,
    figures: {
      home: { src: "/images/casos/andino-seguros/home.webp", w: 1600, h: 1000 },
      formulario: { src: "/images/casos/andino-seguros/formulario.webp", w: 739, h: 1600 },
      consulta: { src: "/images/casos/andino-seguros/consulta.webp", w: 739, h: 1600 },
      panel: { src: "/images/casos/andino-seguros/panel.webp", w: 1600, h: 1000 },
    },
  },
  // Una serie: cuatro sitios en vez de uno. `sites` dibuja un botón por sitio y
  // `repo` apunta a la plantilla. Reemplaza al caso de CTRL.Z, que pasó a ser
  // un capítulo de este; /web/ctrl-z redirige acá desde vercel.json, por si
  // ese link quedó compartido.
  "press-kits": {
    category: "web",
    year: "2025–2026",
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    site: null,
    sites: [
      { label: "Kexxy", url: "https://presskit-digital.vercel.app/" },
      { label: "CTRL.Z", url: "https://ctrlz-presskit.vercel.app/" },
      { label: "Gabi Raíz", url: "https://gabiraiz-presskit.vercel.app/" },
      { label: "Martina Høbelar", url: "https://martinahobelar-presskit.vercel.app/" },
    ],
    repo: "https://github.com/Enzodiazzingaretti/presskit_digital",
    figures: {
      portadas: { src: "/images/casos/press-kits/portadas.webp", w: 1600, h: 1000 },
      gabiMobile: { src: "/images/casos/press-kits/gabi-mobile.webp", w: 739, h: 1600 },
      martinaMobile: { src: "/images/casos/press-kits/martina-mobile.webp", w: 739, h: 1600 },
      gabiBooking: { src: "/images/casos/press-kits/gabi-booking.webp", w: 714, h: 835 },
      martinaBooking: { src: "/images/casos/press-kits/martina-booking.webp", w: 1000, h: 760 },
      martinaSets: { src: "/images/casos/press-kits/martina-sets.webp", w: 1600, h: 1000 },
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
