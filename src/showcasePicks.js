/**
 * La selección del showcase del home: cinco piezas, una por categoría más el
 * lab generativo.
 *
 * No repite ni un título ni una descripción. Cada entrada apunta a una pieza
 * que ya existe en `buildCategories()`, así que el texto sale del mismo lugar
 * que la página de categoría, ya traducido y ya editable desde /admin. Si
 * alguna vez se edita un texto, cambia en los dos lados solo.
 *
 * El match es por un fragmento del asset y no por índice: los arrays de obra
 * se reordenan desde el panel, y un índice fijo terminaría mostrando otra
 * pieza sin aviso.
 */
export const SHOWCASE_PICKS = [
  {
    id: "feedback-ritual",
    slug: "motion",
    group: "touchdesigner",
    find: (item) => /feedback-ritual/.test(item.thumbnail ?? ""),
  },
  {
    id: "golden-faces",
    slug: "3d",
    group: "blender",
    find: (item) => /golden-faces/.test(item.thumbnail ?? ""),
  },
  {
    id: "blastkick",
    slug: "grafica",
    group: "flyers",
    find: (item) => /blastkick\/blastkick_preview/.test(item.thumbnail ?? ""),
  },
  {
    id: "tamara",
    slug: "web",
    group: "proyectos",
    find: (item) => /tamaraportfolio/.test(item.thumbnail ?? ""),
  },
  {
    id: "enjambre",
    slug: "motion",
    group: "lab",
    find: (item) => item.id === "enjambre",
    generative: true,
  },
];

/**
 * Resuelve la selección contra las categorías ya construidas.
 *
 * Una pieza que no se encuentra se descarta en silencio en vez de romper el
 * render: desde /admin se puede borrar o deshabilitar cualquier obra, y el
 * home no tiene por qué caerse porque el showcase apunte a una que ya no está.
 */
export function buildShowcase(categories) {
  return SHOWCASE_PICKS.map((pick) => {
    const category = categories.find((c) => c.slug === pick.slug);
    const group = category?.groups.find((g) => g.id === pick.group);
    const item = group?.items.find(pick.find);
    if (!category || !item) return null;

    return {
      id: pick.id,
      href: `/${category.slug}`,
      // Sale del normalizador, no de la selección: así la pieza tiene audio en
      // el showcase exactamente cuando lo tiene en /motion, sin dos listas que
      // se puedan contradecir.
      audio: item.audio ?? null,
      generative: pick.generative ?? false,
      // El rótulo del grupo distingue "Lab generativo" de "TouchDesigner", que
      // si no serían dos cards diciendo MOTION.
      tag: group.title ?? category.title,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
    };
  }).filter(Boolean);
}
