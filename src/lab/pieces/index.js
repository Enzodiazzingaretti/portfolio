import createCongregacion, { controls as congregacionControls } from "./congregacion";
import createHimno, { controls as himnoControls } from "./himno";
import createComunion, { controls as comunionControls } from "./comunion";
import createEnjambre, { controls as enjambreControls } from "./enjambre";
import createLiturgia, { controls as liturgiaControls } from "./liturgia";

/**
 * Registro de obras de Liturgia Máquina.
 * Semillas por defecto curadas (y con guiño): 145 = BPM del sitio,
 * 808/909 = cajas de ritmo, 1312 = el render del patrullero.
 *
 * `controls` es el tablero de cada obra: con todos los valores en su `def`,
 * lo que se ve es exactamente la obra que fija la semilla.
 */
export const LAB_PIECES = [
  { id: "congregacion", create: createCongregacion, controls: congregacionControls, defaultSeed: 145, w: 1120, h: 630, featured: true },
  { id: "himno", create: createHimno, controls: himnoControls, defaultSeed: 808, w: 800, h: 600 },
  { id: "comunion", create: createComunion, controls: comunionControls, defaultSeed: 909, w: 800, h: 600 },
  { id: "enjambre", create: createEnjambre, controls: enjambreControls, defaultSeed: 1312, w: 800, h: 600 },
  { id: "liturgia", create: createLiturgia, controls: liturgiaControls, defaultSeed: 303, w: 800, h: 600 },
];
