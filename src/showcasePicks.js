/**
 * «Trabajo seleccionado» del home: el reel del caso Sonar (que cuenta toda la
 * campaña; el key visual se sacó el 2026-11-07 para no repetir Sonar), un
 * render 3D y un spec publicitario. Los sitios web y el lab siguen en sus
 * categorías, como diferencial.
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
    id: "sonar-caso",
    slug: "motion",
    group: "reels",
    find: (item) => /reel-sonar-caso/.test(item.thumbnail ?? ""),
  },
  {
    id: "golden-faces",
    slug: "3d",
    group: "blender",
    find: (item) => /golden-faces/.test(item.thumbnail ?? ""),
  },
  {
    id: "240-kmh",
    slug: "3d",
    group: "blender",
    find: (item) => /240kmh/.test(item.thumbnail ?? ""),
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
      // Un proyecto con caso escrito lleva al caso: es lo que cuenta cómo se
      // hizo, y la categoría queda a un clic con «Proyectos web».
      href: item.caseSlug ? `/${category.slug}/${item.caseSlug}` : `/${category.slug}`,
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
