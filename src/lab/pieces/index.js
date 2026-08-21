import createCongregacion, { controls as congregacionControls } from "./congregacion";
import createHimno, { controls as himnoControls } from "./himno";
import createComunion, { controls as comunionControls } from "./comunion";
import createEnjambre, { controls as enjambreControls } from "./enjambre";
import createLiturgia, { controls as liturgiaControls } from "./liturgia";
import createSudario, { controls as sudarioControls } from "./sudario";
import createSalmo, { controls as salmoControls } from "./salmo";
import createVelo, { controls as veloControls } from "./velo";

/**
 * Registro de obras de Liturgia Máquina.
 * Semillas por defecto curadas (y con guiño): 145 = BPM del sitio,
 * 808/909/707 = cajas de ritmo, 303 y 101 = sintetizadores, 1312 = el render
 * del patrullero, 150 = el salmo de los instrumentos, 2751 = Mateo 27:51,
 * el versículo donde el velo del templo se rasga en dos.
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
  { id: "sudario", create: createSudario, controls: sudarioControls, defaultSeed: 707, w: 1120, h: 630, featured: true },
  { id: "salmo", create: createSalmo, controls: salmoControls, defaultSeed: 150, w: 800, h: 600 },
  { id: "velo", create: createVelo, controls: veloControls, defaultSeed: 2751, w: 800, h: 600 },
];
