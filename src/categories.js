import { resolvePublicAsset } from "./utils/helpers";

/**
 * Las 9 secciones del scroll viejo colapsadas en 4 categorías por disciplina.
 * Cada categoría es una ruta propia; adentro puede tener varios grupos.
 *
 * MOTION    → Reels + TouchDesigner + Lab generativo
 * 3D        → Blender + Arquitectura
 * GRÁFICA   → Campañas + Flyers + Logos
 * WEB       → Proyectos web
 *
 * `source` nombra el array de siteContent del que sale cada grupo, así el
 * panel de admin sigue editando exactamente las mismas claves de siempre.
 */
export const CATEGORIES = [
  {
    id: "motion",
    slug: "motion",
    num: "01",
    accent: "motion",
    groups: [
      // Los reels van primero: son las piezas de motion para clientes (press
      // kits, campañas, marcas). Los loops y el lab vienen después.
      { id: "reels", source: "motionReels", kind: "reel", layout: "reels" },
      { id: "touchdesigner", source: "touchDesignerLoops", kind: "loop", layout: "video" },
      { id: "lab", source: "labPieces", kind: "lab", layout: "lab" },
    ],
  },
  {
    id: "tresd",
    slug: "3d",
    num: "02",
    accent: "tresd",
    groups: [
      { id: "blender", source: "blenderWorks", kind: "render", layout: "gallery" },
      { id: "arquitectura", source: "espacios", kind: "space", layout: "gallery" },
    ],
  },
  {
    id: "grafica",
    slug: "grafica",
    num: "03",
    accent: "grafica",
    groups: [
      // Una campaña es un cliente con varias piezas (key visual, motion,
      // placas, manual): va primero y aparte para que no se diluya entre
      // flyers sueltos.
      { id: "campanas", source: "campaigns", kind: "graphic", layout: "gallery" },
      { id: "flyers", source: "flyers", kind: "graphic", layout: "gallery" },
      { id: "logos", source: "logos", kind: "graphic", layout: "gallery" },
    ],
  },
  {
    id: "web",
    slug: "web",
    num: "04",
    accent: "web",
    groups: [{ id: "proyectos", source: "webProjects", kind: "web", layout: "wide" }],
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/* ---------------------------------------------------------------------- */
/* Normalizadores: cada fuente tiene su forma; el modal espera una sola.   */
/* ---------------------------------------------------------------------- */

const asset = (p) => (p ? resolvePublicAsset(p) : null);

/**
 * Herramientas que vienen mezcladas en `tags` («Photoshop» al lado de
 * «Dirección de arte»). La ficha del visor las muestra aparte y los tags
 * quedan para disciplinas y formatos. Se reconocen por nombre, sin distinguir
 * mayúsculas; `base` suma las que da el grupo (un render es de Blender).
 */
const HERRAMIENTAS = new Map(
  [
    "Blender", "After Effects", "Photoshop", "Illustrator", "Premiere", "DaVinci Resolve", "Cinema 4D", "Figma",
    "TouchDesigner", "Python", "ffmpeg", "Playwright", "GSAP", "Canvas", "GLSL", "Three.js", "React",
  ].map((tool) => [tool.toLowerCase(), tool]),
);

export function separarHerramientas(tags = [], base = []) {
  const tools = [...base];
  const resto = [];
  for (const tag of tags ?? []) {
    const tool = HERRAMIENTAS.get(String(tag).trim().toLowerCase());
    if (!tool) resto.push(tag);
    else if (!tools.includes(tool)) tools.push(tool);
  }
  return { tools, tags: resto };
}

/** Lo que la ficha muestra si la pieza lo tiene cargado (desde /admin o el bundle). */
const ficha = (entry) => ({
  client: entry.client || null,
  year: entry.year || null,
  role: entry.role || null,
});
const slides = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).map(resolvePublicAsset) : []);

const NORMALIZERS = {
  loop: (loop, ui) => ({
    title: loop.name,
    subtitle: ui.touchDesignerLoop,
    description: loop.notes,
    ...ficha(loop),
    ...separarHerramientas(["generative", "live visuals"], ["TouchDesigner"]),
    thumbnail: asset(loop.thumbnail) ?? asset(loop.slides?.[0]),
    // Solo las piezas que tienen pista real. Las otras cuatro traen un track
    // de silencio digital en el original, así que no declaran `audio` y no
    // muestran el parlante.
    audio: loop.audio ? asset(loop.audio) : null,
    slides: slides(loop.slides),
  }),
  reel: (reel) => ({
    title: reel.title,
    subtitle: reel.type,
    description: reel.description,
    ...ficha(reel),
    ...separarHerramientas(reel.tags),
    duration: reel.duration || null,
    portrait: true,
    // Portada liviana de /images/loops/ (8 s, sin audio, con poster); el reel
    // entero va primero en `slides`, para el visor.
    thumbnail: asset(reel.thumbnail) ?? asset(reel.slides?.[0]),
    slides: slides(reel.slides),
  }),
  render: (work, ui) => ({
    title: work.title,
    subtitle: ui.blenderRender,
    description: work.description,
    ...ficha(work),
    ...separarHerramientas(ui.renderTags, ["Blender"]),
    portrait: work.portrait ?? false,
    square: work.square ?? false,
    // Igual que en `loop`: si la pieza tiene portada propia se usa esa. Los
    // tres renders cuya primera slide es un video la tienen, para no bajar el
    // original entero en la grilla.
    thumbnail: asset(work.thumbnail) ?? asset(work.slides?.[0]),
    slides: slides(work.slides),
  }),
  space: (space) => ({
    title: space.title,
    subtitle: space.type,
    description: space.description,
    ...ficha(space),
    ...separarHerramientas(space.tags, ["Blender"]),
    portrait: space.portrait ?? false,
    square: space.square ?? false,
    thumbnail: asset(space.imageUrl) ?? asset(space.slides?.[0]),
    slides: slides(space.slides),
  }),
  graphic: (piece) => ({
    title: piece.title,
    subtitle: piece.type,
    description: piece.description,
    ...ficha(piece),
    ...separarHerramientas(piece.tags),
    portrait: piece.portrait ?? false,
    square: piece.square ?? false,
    thumbnail: asset(piece.imageUrl) ?? asset(piece.slides?.[0]),
    slides: slides(piece.slides),
  }),
  web: (project) => ({
    title: project.title,
    subtitle: project.type,
    description: project.description,
    tags: project.tags ?? [],
    features: project.features ?? [],
    status: project.status,
    ...ficha(project),
    previewUrl: project.previewUrl,
    // Repo público en GitHub: quien evalúa un perfil técnico quiere ver el
    // código, no solo la captura.
    repoUrl: project.repoUrl || null,
    // Slug del caso de estudio (/web/<slug>), si el proyecto tiene uno escrito
    caseSlug: project.caseSlug || null,
    thumbnail: asset(project.imageUrl) ?? asset(project.previewImage),
    previewImage: asset(project.previewImage),
    slides: slides(project.slides),
  }),
  // El lab no abre modal: cada pieza se dibuja en vivo sobre canvas.
  lab: (piece) => ({
    id: piece.id,
    title: piece.title,
    description: piece.description,
  }),
};

/**
 * Arma una categoría lista para render: títulos traducidos + items normalizados.
 * @param {object} category - entrada de CATEGORIES
 * @param {object} content - contenido ya resuelto por useSiteContent
 */
export function buildCategory(category, content) {
  const copy = content.categories?.[category.id];
  if (!copy) return null;

  const groups = category.groups
    .map((group) => {
      const raw = content[group.source];
      if (!Array.isArray(raw) || raw.length === 0) return null;
      const normalize = NORMALIZERS[group.kind];
      return {
        ...group,
        ...(copy.groups?.[group.id] ?? {}),
        items: raw.map((entry) => normalize(entry, content.ui)),
      };
    })
    .filter(Boolean);

  const count = groups.reduce((total, group) => total + group.items.length, 0);

  return { ...category, ...copy, groups, count };
}

export function buildCategories(content) {
  return CATEGORIES.map((c) => buildCategory(c, content)).filter((c) => c && c.count > 0);
}
