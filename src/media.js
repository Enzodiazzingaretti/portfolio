/**
 * Videos en alta: viven en el proyecto aparte `portfolio-media` (su propio repo y
 * su propio deploy en Vercel), así el repo del sitio no carga cientos de MB de
 * video. Cada uno en dos tamaños, con el mismo camino que su versión liviana:
 *
 *   <MEDIA_BASE>/1080/images/reels/kook.mp4   (lado corto hasta 1080)
 *   <MEDIA_BASE>/720/images/reels/kook.mp4    (celular)
 *   <MEDIA_BASE>/1080/images/reels/kook-poster.jpg
 *
 * Salen de los originales del Drive (ver CLAUDE.md, «Videos en alta»). Si un
 * video no está en esta lista, o la versión en alta no carga, se usa el
 * archivo liviano de `public/`, que sigue en el repo como respaldo. Con la base
 * vacía (mientras el proyecto de medios no está publicado) se usan los livianos.
 */
export const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE ?? "https://enzo-zingaretti-media.vercel.app").replace(/\/$/, "");

export const VIDEOS_HQ = new Set([
  "/images/blender/240KM-H/semaforo-preview.mp4",
  "/images/blender/abstract/blackgoo.mp4",
  "/images/blender/cristales/cristales-preview.mp4",
  "/images/blender/patrullero/patrullero-2.mp4",
  "/images/blender/rather-modular/rathermodular-1.mp4",
  "/images/campanas/sonar/cuenta-regresiva-reel.mp4",
  "/images/campanas/sonar/line-up-reel.mp4",
  "/images/espacios/rec-underclub/underclub-rec-videos-1.mp4",
  "/images/espacios/rec-underclub/underclub-rec-videos-2.mp4",
  "/images/espacios/rec-underclub/underclubprueba1.mp4",
  "/images/espacios/underberlin/underberlin-1.mp4",
  "/images/espacios/underberlin/underberlin-2.mp4",
  "/images/espacios/underberlin/underberlin-3.mp4",
  "/images/flyers/aguantadero_bass/aguantaderobass-preview.mp4",
  "/images/flyers/blastkick/blastkick-reel.mp4",
  "/images/flyers/maccari/maccari1-2.mp4",
  "/images/loops/240kmh.mp4",
  "/images/loops/biology.mp4",
  "/images/loops/cristales.mp4",
  "/images/loops/eyes.mp4",
  "/images/loops/feedback-ritual.mp4",
  "/images/loops/ghost-tunnel.mp4",
  "/images/loops/iron-lattice.mp4",
  "/images/loops/pulse-vandal.mp4",
  "/images/loops/reel-ctrlz.mp4",
  "/images/loops/reel-gabi-raiz.mp4",
  "/images/loops/reel-kexxy.mp4",
  "/images/loops/reel-kook.mp4",
  "/images/loops/reel-martina-hobelar.mp4",
  "/images/loops/reel-shodnan-ref.mp4",
  "/images/loops/reel-sonar-caso.mp4",
  "/images/loops/reel-sonar-cuenta-regresiva.mp4",
  "/images/loops/reel-sonar-line-up.mp4",
  "/images/loops/static-veil.mp4",
  "/images/reels/ctrlz.mp4",
  "/images/reels/gabi-raiz.mp4",
  "/images/reels/kexxy.mp4",
  "/images/reels/kook.mp4",
  "/images/reels/martina-hobelar.mp4",
  "/images/reels/shodnan-ref.mp4",
  "/images/reels/sonar-caso.mp4",
  "/images/touchdesigner/Eyes/ojos-visuales.mp4",
  "/images/touchdesigner/biology/biology1.mp4",
  "/images/touchdesigner/biology/biology10.mp4",
  "/images/touchdesigner/biology/biology11.mp4",
  "/images/touchdesigner/biology/biology12.mp4",
  "/images/touchdesigner/biology/biology13.mp4",
  "/images/touchdesigner/biology/biology14.mp4",
  "/images/touchdesigner/biology/biology2.mp4",
  "/images/touchdesigner/biology/biology3.mp4",
  "/images/touchdesigner/biology/biology4.mp4",
  "/images/touchdesigner/biology/biology5.mp4",
  "/images/touchdesigner/biology/biology7.mp4",
  "/images/touchdesigner/biology/biology8.mp4",
  "/images/touchdesigner/feedback-ritual/audioreactive-vol2-test.mp4",
  "/images/touchdesigner/feedback-ritual/audioreactive-vol3-test-1-1.mp4",
  "/images/touchdesigner/feedback-ritual/audioreactive-vol5-test-1.mp4",
  "/images/touchdesigner/feedback-ritual/audioreactive-vol6-test-1.mp4",
  "/images/touchdesigner/feedback-ritual/audioreactive-vol7-test-1.mp4",
  "/images/touchdesigner/ghost-tunnel/c4-animacion-1.mp4",
  "/images/touchdesigner/iron-lattice/visuales4.mp4",
  "/images/touchdesigner/kinetic-sand/kinetic-sand-1.mp4",
  "/images/touchdesigner/pulse-vandal/visuales1.mp4",
  "/images/touchdesigner/static-veil/humo-mod.mp4",
  "/images/touchdesigner/static-veil/humo.mp4",
  "/images/visual/Logos/Grandgroove/grandgroove-records-logo-1.mp4",
]);

const ANGOSTA = "(max-width: 900px)";

/** La versión en alta de un video del sitio, o null si no tiene. */
export function videoHQ(src) {
  if (!MEDIA_BASE || !src || !VIDEOS_HQ.has(src)) return null;
  const angosta = typeof window !== "undefined" && window.matchMedia?.(ANGOSTA).matches;
  return {
    src: `${MEDIA_BASE}/${angosta ? "720" : "1080"}${encodeURI(src)}`,
    poster: `${MEDIA_BASE}/1080${encodeURI(src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg"))}`,
  };
}

/**
 * Una imagen fija de la pieza, para usar de fondo: el poster en alta de un
 * video (o el de su loop liviano), o la imagen misma.
 */
export function imagenFija(src) {
  if (!src) return null;
  if (/\.(mp4|webm|mov)$/i.test(src)) {
    const hq = videoHQ(src);
    if (hq) return hq.poster;
    return /\/images\/loops\//i.test(src) ? src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg") : null;
  }
  return /\.(png|jpe?g)$/i.test(src) ? encodeURI(src.replace(/\.(png|jpe?g)$/i, ".webp")) : src;
}
