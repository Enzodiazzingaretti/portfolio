/**
 * Una sola pista sonando en todo el sitio, compartida entre el showcase del
 * home y los tiles de /motion.
 *
 * Es un singleton a nivel de módulo y no un contexto de React porque los dos
 * consumidores viven en rutas distintas: pasarlo por contexto obligaría a
 * subirlo al Shell para dos componentes que no se ven entre sí. Con un solo
 * <audio> además queda garantizado por construcción que nunca suenan dos
 * piezas a la vez.
 *
 * > El navegador no deja sonar audio sin un gesto de activación del usuario, y
 * > `mouseenter` no cuenta como tal. Por eso hay un paso de "armado": el
 * > primer click en el parlante es a la vez el consentimiento del visitante y
 * > el gesto que el navegador exige. Recién después el hover puede sonar.
 */

const FADE_MS = 250;
const VOLUMEN = 0.85;
const CLAVE = "loop-audio:armado";

let audio = null;
let srcActual = null;
let fadeRaf = 0;
/**
 * Cada pedido de reproducir o callar se lleva un número. El fade-out termina
 * en un `pause()` diferido 250 ms, y moviendo el puntero rápido entre dos
 * piezas ese `pause()` caía sobre la pista que ya había arrancado: se cortaba
 * el sonido mientras la UI seguía diciendo que sonaba. Comparando el número
 * contra el actual, un pedido viejo no puede pisar a uno nuevo.
 */
let generacion = 0;
let snapshot = { armado: false, sonando: null };
const oyentes = new Set();

function leerArmadoGuardado() {
  try {
    return sessionStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

function guardarArmado(valor) {
  try {
    if (valor) sessionStorage.setItem(CLAVE, "1");
    else sessionStorage.removeItem(CLAVE);
  } catch {
    /* modo privado o storage bloqueado: se pierde entre rutas, nada más */
  }
}

/**
 * `useSyncExternalStore` compara el snapshot por identidad: si se devuelve un
 * objeto nuevo en cada llamada, React vuelve a renderizar para siempre. Por
 * eso solo se reemplaza cuando algo cambió de verdad.
 */
function emitir(cambios) {
  const proximo = { ...snapshot, ...cambios };
  if (proximo.armado === snapshot.armado && proximo.sonando === snapshot.sonando) return;
  snapshot = proximo;
  oyentes.forEach((fn) => fn());
}

function elemento() {
  if (audio) return audio;
  audio = new Audio();
  audio.loop = true;
  audio.preload = "none"; // no baja un byte hasta el primer hover real
  audio.volume = 0;
  return audio;
}

function fundir(destino, alTerminar) {
  cancelAnimationFrame(fadeRaf);
  const el = elemento();

  // `requestAnimationFrame` no corre con la pestaña oculta: el fade quedaría
  // congelado en su valor inicial y la pista sonando a volumen 0 para siempre.
  // Sin nadie escuchando tampoco hay nada que suavizar, así que va directo.
  if (typeof document !== "undefined" && document.hidden) {
    el.volume = destino;
    alTerminar?.();
    return;
  }

  const desde = el.volume;
  const inicio = performance.now();

  const paso = (ahora) => {
    const k = Math.min((ahora - inicio) / FADE_MS, 1);
    el.volume = Math.max(0, Math.min(1, desde + (destino - desde) * k));
    if (k < 1) {
      fadeRaf = requestAnimationFrame(paso);
      return;
    }
    alTerminar?.();
  };

  fadeRaf = requestAnimationFrame(paso);
}

async function sonar(src) {
  const el = elemento();
  const gen = ++generacion;

  if (srcActual !== src) {
    el.src = src;
    srcActual = src;
  }

  cancelAnimationFrame(fadeRaf);
  el.volume = 0;

  try {
    await el.play();
  } catch (error) {
    // Ya lo reemplazó otro pedido: cambiarle el `src` a un <audio> mientras
    // carga aborta el play anterior, y ese rechazo no es un fallo de nada.
    if (gen !== generacion) return false;

    if (error?.name === "NotAllowedError") {
      // Esto sí es el navegador negándose por falta de gesto de activación.
      // Se desarma para que el botón muestre la verdad.
      guardarArmado(false);
      emitir({ armado: false, sonando: null });
    } else {
      emitir({ sonando: null });
    }
    return false;
  }

  if (gen !== generacion) return false;

  emitir({ sonando: src });
  fundir(VOLUMEN);
  return true;
}

function callar() {
  emitir({ sonando: null });
  if (!audio) return;
  const el = audio;
  const gen = ++generacion;
  fundir(0, () => {
    if (gen === generacion) el.pause();
  });
}

/* El audio no puede seguir sonando con la pestaña en segundo plano. */
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) callar();
  });
}

export const loopAudio = {
  subscribe(fn) {
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  },

  getSnapshot() {
    return snapshot;
  },

  /** Snapshot del servidor: sin audio, para que no reviente un render en SSR. */
  getServerSnapshot() {
    return snapshot;
  },

  /** Lee el armado guardado. Se llama una vez, al montar el primer botón. */
  hidratar() {
    if (leerArmadoGuardado()) emitir({ armado: true });
  },

  /** Click del usuario: arma el audio y arranca esa pieza. */
  async alternar(src) {
    if (snapshot.sonando === src) {
      callar();
      return;
    }
    if (!snapshot.armado) {
      guardarArmado(true);
      emitir({ armado: true });
    }
    await sonar(src);
  },

  /** Apaga del todo: deja de sonar y desarma. */
  apagar() {
    guardarArmado(false);
    callar();
    emitir({ armado: false });
  },

  /** Hover sobre una pieza con audio. Solo suena si ya está armado. */
  alEntrar(src) {
    if (!snapshot.armado || !src) return;
    if (snapshot.sonando === src) return;
    sonar(src);
  },

  /** El puntero salió de la pieza. */
  alSalir(src) {
    if (!snapshot.armado) return;
    if (snapshot.sonando !== src) return;
    callar();
  },
};
