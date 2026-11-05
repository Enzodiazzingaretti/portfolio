import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MediaAsset from "./MediaAsset";
import GenerativeCanvas from "./GenerativeCanvas";
import LoopAudioButton from "./LoopAudioButton";
import createEnjambre from "../lab/pieces/enjambre";
import { loopAudio } from "../audio/loopAudio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { isVideoAsset } from "../utils/helpers";
import { Crosshair } from "../fx/Hud";
import { useInView } from "../fx/useInView";

/**
 * Se importa la pieza suelta y no el registro `LAB_PIECES`: ese índice trae
 * todos los algoritmos al bundle del home. Los valores replican la entrada
 * `enjambre` de `src/lab/pieces/index.js` para que la obra sea idéntica a la
 * de /motion.
 */
const ENJAMBRE = { create: createEnjambre, seed: 1312, w: 800, h: 600 };
const DURACION = 7000;

function pad(n) {
  return String(n).padStart(2, "0");
}

/** Contador de tiempo de la pieza en pantalla, como el de un monitor. */
function Timecode({ running, resetKey }) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    setMs(0);
    if (!running) return undefined;
    const t0 = performance.now();
    const id = window.setInterval(() => setMs(performance.now() - t0), 1000 / 25);
    return () => window.clearInterval(id);
  }, [running, resetKey]);
  const s = Math.floor(ms / 1000);
  const f = Math.floor((ms % 1000) / 40);
  return (
    <span className="reel-tc font-mono" aria-hidden="true">
      00:{pad(Math.floor(s / 60))}:{pad(s % 60)}:{pad(f)}
    </span>
  );
}

function StageMedia({ item, reduced }) {
  if (item.generative) {
    return (
      <GenerativeCanvas
        createPiece={ENJAMBRE.create}
        seed={ENJAMBRE.seed}
        width={ENJAMBRE.w}
        height={ENJAMBRE.h}
        staticMode={reduced}
      />
    );
  }
  return <MediaAsset src={item.thumbnail} alt="" className="h-full w-full object-cover" eager />;
}

/**
 * Showreel del home: la obra destacada pasa sola por una pantalla grande,
 * con cortes de señal entre pieza y pieza, y a la derecha la lista para
 * saltar a cualquiera. Reemplaza al carrusel: las mismas cinco piezas
 * (`buildShowcase`), pero vistas de a una y en grande.
 *
 * Avanza cada 7 s mientras está en pantalla y nadie la toca; con el mouse
 * encima o con foco adentro se queda quieta, y hay un botón de pausa (una
 * animación que se mueve sola más de 5 s tiene que poder frenarse). Con
 * movimiento reducido no avanza sola.
 */
export default function Showreel({ items, labels }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [cut, setCut] = useState(0);
  const [ref, inView] = useInView({ once: false, threshold: 0.35, rootMargin: "0px" });
  const timer = useRef(0);

  const total = items.length;
  const corriendo = inView && !paused && !hover && !reduced && total > 1;

  const ir = useCallback(
    (i) => {
      setActive(((i % total) + total) % total);
      setCut((c) => c + 1);
    },
    [total],
  );

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!corriendo) return undefined;
    timer.current = window.setTimeout(() => ir(active + 1), DURACION);
    return () => window.clearTimeout(timer.current);
  }, [corriendo, active, ir]);

  if (!total) return null;
  const item = items[active];
  const proxima = items[(active + 1) % total];

  return (
    <div
      ref={ref}
      className="reel"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHover(false);
      }}
    >
      <div
        className="reel-stage"
        onMouseEnter={() => loopAudio.alEntrar(item.audio)}
        onMouseLeave={() => loopAudio.alSalir(item.audio)}
      >
        <Link to={item.href} className="reel-stage-link visor" data-cursor={labels.open} data-tilt="0.35" aria-label={`${item.title} — ${labels.open}`}>
          <span className={`reel-media${cut ? " is-cutting" : ""}`} key={`${item.id}-${cut}`}>
            <StageMedia item={item} reduced={reduced} />
            {/* Copia desplazada en rojo: el "registro" corrido de la impresión
                en el instante del corte. */}
            {!item.generative && !isVideoAsset(item.thumbnail) ? (
              <span className="reel-media-ghost" aria-hidden="true">
                <MediaAsset src={item.thumbnail} alt="" className="h-full w-full object-cover" />
              </span>
            ) : null}
          </span>
          <span className="reel-scan" aria-hidden="true" />
          <span className="reel-vignette" aria-hidden="true" />
        </Link>

        {/* Precarga la próxima imagen para que el corte no caiga en negro. Un
            video no: montarlo lo pondría a reproducir fuera de cuadro, y su
            poster ya alcanza para que el corte no quede vacío. */}
        {proxima && proxima !== item && !proxima.generative && !isVideoAsset(proxima.thumbnail) ? (
          <span className="reel-preload" aria-hidden="true">
            <MediaAsset src={proxima.thumbnail} alt="" className="h-full w-full object-cover" />
          </span>
        ) : null}

        <span className="reel-corner reel-corner--tl" aria-hidden="true" />
        <span className="reel-corner reel-corner--tr" aria-hidden="true" />
        <span className="reel-corner reel-corner--bl" aria-hidden="true" />
        <span className="reel-corner reel-corner--br" aria-hidden="true" />
        <Crosshair className="reel-cross" />

        <div className="reel-hud reel-hud--top font-mono" aria-hidden="true">
          <span className="reel-rec">
            <span className={`reel-rec-dot${corriendo ? " is-on" : ""}`} />
            SIG {pad(active + 1)}/{pad(total)}
          </span>
          <Timecode running={corriendo} resetKey={cut} />
        </div>

        <div className="reel-hud reel-hud--bottom">
          <p className="reel-tag font-mono">{item.tag}</p>
          <p className="reel-title font-poster">{item.title}</p>
          <div className="reel-progress" aria-hidden="true">
            <span
              className={`reel-progress-bar${corriendo ? " is-running" : ""}`}
              key={`${active}-${cut}-${corriendo}`}
              style={{ "--reel-dur": `${DURACION}ms` }}
            />
          </div>
        </div>

        <div className="reel-controls">
          <button
            type="button"
            className="reel-btn font-mono"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? labels.play : labels.pause}
          >
            {paused ? "▶" : "❚❚"}
          </button>
          {item.audio ? <LoopAudioButton src={item.audio} labels={labels.audio} /> : null}
        </div>
      </div>

      <ol className="reel-list" aria-label={labels.list}>
        {items.map((it, i) => (
          <li key={it.id}>
            <button
              type="button"
              className={`reel-item${i === active ? " is-active" : ""}`}
              onClick={() => ir(i)}
              aria-current={i === active}
            >
              <span className="reel-item-num font-mono" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="reel-item-main">
                <span className="reel-item-title font-poster">{it.title}</span>
                <span className="reel-item-tag font-mono">{it.tag}</span>
              </span>
              <span className="reel-item-state font-mono" aria-hidden="true">
                {i === active ? "● ON AIR" : "→"}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
