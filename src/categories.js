import { resolvePublicAsset } from "./utils/helpers";

/**
 * Las 9 secciones del scroll viejo colapsadas en 4 categorías por disciplina.
 * Cada categoría es una ruta propia; adentro puede tener varios grupos.
 *
 * MOTION    → TouchDesigner + Lab generativo
 * 3D        → Blender + Arquitectura
 * GRÁFICA   → Flyers + Logos
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
const slides = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).map(resolvePublicAsset) : []);

const NORMALIZERS = {
  loop: (loop, ui) => ({
    title: loop.name,
    subtitle: ui.touchDesignerLoop,
    description: loop.notes,
    tags: ["touchdesigner", "generative", "live visuals"],
    thumbnail: asset(loop.thumbnail) ?? asset(loop.slides?.[0]),
    slides: slides(loop.slides),
  }),
  render: (work, ui) => ({
    title: work.title,
    subtitle: ui.blenderRender,
    description: work.description,
    tags: ui.renderTags,
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
    tags: space.tags ?? [],
    portrait: space.portrait ?? false,
    square: space.square ?? false,
    thumbnail: asset(space.imageUrl) ?? asset(space.slides?.[0]),
    slides: slides(space.slides),
  }),
  graphic: (piece) => ({
    title: piece.title,
    subtitle: piece.type,
    description: piece.description,
    tags: piece.tags ?? [],
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
    year: project.year,
    role: project.role,
    previewUrl: project.previewUrl,
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
