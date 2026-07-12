export const HERO_VARIANTS = [
  { id: "sculpture", scene: "sculpture" },
  { id: "particles", scene: "particles" },
  { id: "organic", scene: "organic" },
];

export const HERO_VARIANT_IDS = HERO_VARIANTS.map((variant) => variant.id);

export function getVariant(id) {
  return HERO_VARIANTS.find((variant) => variant.id === id) ?? HERO_VARIANTS[0];
}

export function randomVariantId() {
  return HERO_VARIANT_IDS[Math.floor(Math.random() * HERO_VARIANT_IDS.length)];
}
