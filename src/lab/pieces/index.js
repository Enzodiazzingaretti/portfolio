import createCongregacion from "./congregacion";
import createHimno from "./himno";
import createComunion from "./comunion";
import createEnjambre from "./enjambre";
import createLiturgia from "./liturgia";

/**
 * Registro de obras de Liturgia Máquina.
 * Semillas por defecto curadas (y con guiño): 145 = BPM del sitio,
 * 808/909 = cajas de ritmo, 1312 = el render del patrullero.
 */
export const LAB_PIECES = [
  { id: "congregacion", create: createCongregacion, defaultSeed: 145, w: 1120, h: 630, featured: true },
  { id: "himno", create: createHimno, defaultSeed: 808, w: 800, h: 600 },
  { id: "comunion", create: createComunion, defaultSeed: 909, w: 800, h: 600 },
  { id: "enjambre", create: createEnjambre, defaultSeed: 1312, w: 800, h: 600 },
  { id: "liturgia", create: createLiturgia, defaultSeed: 303, w: 800, h: 600 },
];
