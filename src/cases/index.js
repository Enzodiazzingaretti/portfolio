import es from "./es.js";
import en from "./en.js";
import pt from "./pt.js";

/**
 * Casos de estudio (/<categoría>/<slug>; los sitios van en /tech). Este
 * módulo entra solo con la página de caso
 * (lazy): el home y las categorías no cargan estos textos.
 *
 * El título, la bajada y el orden de cada caso viven en `siteContent.i18n.js`
 * (`cases`), porque el home y las tarjetas de /tech también los muestran. Acá va
 * el cuerpo. Los textos no se editan desde /admin: son código, como
 * `about.facts`.
 *
 * `w` y `h` son las medidas reales de cada imagen: van al <img> para que el
 * navegador reserve el lugar antes de que cargue (sin saltos de layout), y un
 * test los compara con el archivo.
 */
export const CASE_ASSETS = {
  // Una campaña, no un sitio: cuelga de Gráfica (/grafica/sonar-produce) y
  // usa las mismas imágenes que las piezas de la campaña, sin duplicarlas.
  "sonar-produce": {
    category: "grafica",
    year: "2026",
    stack: ["Photoshop", "After Effects", "Python", "ffmpeg"],
    site: null,
    repo: null,
    figures: {
      kv: { src: "/images/campanas/sonar/key-visual-feed.webp", w: 1080, h: 1440 },
      kvHistoria: { src: "/images/campanas/sonar/key-visual-historia.webp", w: 900, h: 1600 },
      concepto: { src: "/images/campanas/sonar/manual-03.webp", w: 1600, h: 900 },
      color: { src: "/images/campanas/sonar/manual-06.webp", w: 1600, h: 900 },
      carrusel: { src: "/images/campanas/sonar/carrusel-01.webp", w: 1080, h: 1440 },
      horarios: { src: "/images/campanas/sonar/horarios-feed.webp", w: 1080, h: 1440 },
      entradas: { src: "/images/campanas/sonar/entradas-feed.webp", w: 1080, h: 1440 },
      sistema: { src: "/images/campanas/sonar/manual-13.webp", w: 1600, h: 900 },
      plantillas: { src: "/images/campanas/sonar/manual-14.webp", w: 1600, h: 900 },
    },
  },
  portfolio: {
    category: "tech",
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
    category: "tech",
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
    category: "tech",
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
  // Una serie: cinco sitios en vez de uno. `sites` dibuja un botón por sitio y
  // `repo` apunta a la plantilla. Reemplaza al caso de CTRL.Z, que pasó a ser
  // un capítulo de este; /web/ctrl-z redirige acá desde vercel.json, por si
  // ese link quedó compartido.
  "press-kits": {
    category: "tech",
    year: "2025–2026",
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    site: null,
    sites: [
      { label: "Kexxy", url: "https://presskit-digital.vercel.app/" },
      { label: "CTRL.Z", url: "https://ctrlz-presskit.vercel.app/" },
      { label: "Gabi Raíz", url: "https://gabiraiz-presskit.vercel.app/" },
      { label: "Martina Høbelar", url: "https://martinahobelar-presskit.vercel.app/" },
      { label: "Shodnan Ref", url: "https://shodnan-presskit.vercel.app/" },
    ],
    repo: null,
    figures: {
      portadas: { src: "/images/casos/press-kits/portadas.webp", w: 1600, h: 1000 },
      kexxyMobile: { src: "/images/casos/press-kits/kexxy-mobile.webp", w: 739, h: 1600 },
      gabiMobile: { src: "/images/casos/press-kits/gabi-mobile.webp", w: 739, h: 1600 },
      martinaMobile: { src: "/images/casos/press-kits/martina-mobile.webp", w: 739, h: 1600 },
      gabiBooking: { src: "/images/casos/press-kits/gabi-booking.webp", w: 714, h: 835 },
      martinaBooking: { src: "/images/casos/press-kits/martina-booking.webp", w: 1000, h: 760 },
      martinaSets: { src: "/images/casos/press-kits/martina-sets.webp", w: 1600, h: 1000 },
      shodnanMobile: { src: "/images/casos/press-kits/shodnan-mobile.webp", w: 739, h: 1600 },
      shodnanFechas: { src: "/images/casos/press-kits/shodnan-fechas.webp", w: 1600, h: 1000 },
    },
  },
};

export const CASE_UI = {
  es: {
    label: "Caso",
    backTo: "Volver a",
    role: "Rol",
    year: "Año",
    stack: "Stack",
    tools: "Herramientas",
    site: "Abrir sitio",
    code: "Ver código",
    discarded: "Descartado",
    next: "Siguiente caso",
    pieces: "Todas las piezas",
  },
  en: {
    label: "Case study",
    backTo: "Back to",
    role: "Role",
    year: "Year",
    stack: "Stack",
    tools: "Tools",
    site: "Visit site",
    code: "View code",
    discarded: "Ruled out",
    next: "Next case study",
    pieces: "All the pieces",
  },
  pt: {
    label: "Case",
    backTo: "Voltar para",
    role: "Função",
    year: "Ano",
    stack: "Stack",
    tools: "Ferramentas",
    site: "Abrir site",
    code: "Ver código",
    discarded: "Descartado",
    next: "Próximo case",
    pieces: "Todas as peças",
  },
};

export const CASE_BODIES = { es, en, pt };
