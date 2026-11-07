import { Link } from "react-router-dom";
import MediaAsset from "./MediaAsset";
import { FORMATOS_LOOP, formatoPropio, orientacion, planificarSala } from "../salaPlan";
import LoopAudioButton from "./LoopAudioButton";
import { loopAudio } from "../audio/loopAudio";

/**
 * «Sala»: la obra de las categorías (3D, Gráfica, loops de TouchDesigner,
 * comerciales) colgada como en una muestra, no en una grilla pareja de cajas.
 * Cada pieza va grande, entera, en un rectángulo casi recto con el visor en
 * las esquinas (la regla del sitio: la obra va así; la interfaz, en vidrio
 * redondeado) y su número en contorno detrás. Hasta el 2026-11-05 los marcos
 * tenían forma (arco, hoja, lente): recortaban la pieza y competían con ella.
 *
 * En desktop las piezas van de a pares, una grande y una chica, alternando
 * de lado y con la chica desfasada hacia abajo; las panorámicas van solas y
 * tres del mismo formato forman un tríptico. En el celular van de a una,
 * alternando el lado, con las apaisadas de borde a borde.
 */

function pad(n) {
  return String(n).padStart(2, "0");
}

/** Una pieza abre el visor; la tarjeta de un caso (`href`) lleva al caso. */
function Boton({ item, onOpen, labels, children }) {
  if (item.href) {
    return (
      <Link to={item.href} className="sala-boton" data-cursor={labels.readCase} data-tilt="0.35">
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className="sala-boton" onClick={onOpen} data-cursor={labels.cursor} data-tilt="0.35">
      {children}
    </button>
  );
}

function Pieza({ item, index, lugar, formato, loop, labels, onOpen }) {
  const o = orientacion(formato);
  const extra = (item.slides?.length ?? 0) - 1;
  const lado = lugar.col + lugar.span / 2 > 6.5 ? "der" : "izq";
  const meta = loop ? `${labels.loop} ${pad(index + 1)}` : item.subtitle;

  return (
    <article
      className={`sala-pieza sala-pieza--${o} sala-pieza--${lado}${loop && item.audio ? " sala-pieza--audio" : ""} reveal-on-scroll`}
      style={{ "--col": lugar.col, "--span": lugar.span, "--desfase": lugar.desfase }}
      onMouseEnter={loop && item.audio ? () => loopAudio.alEntrar(item.audio) : undefined}
      onMouseLeave={loop && item.audio ? () => loopAudio.alSalir(item.audio) : undefined}
    >
      <span className="sala-num font-poster" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <Boton item={item} onOpen={onOpen} labels={labels}>
        <span className="sala-cuadro" style={{ aspectRatio: formato.replace("/", " / ") }}>
          <span className="sala-marco visor">
            <span className="sala-deriva">
              <span className="sala-zoom">
                <MediaAsset src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
              </span>
            </span>
          </span>
          {item.href ? (
            <span className="sala-vistas sala-vistas--caso font-mono" aria-hidden="true">
              {item.piezas} {labels.pieces}
            </span>
          ) : extra > 0 ? (
            <span className="sala-vistas font-mono" aria-hidden="true">
              +{extra}
            </span>
          ) : null}
        </span>
        <span className="sala-pie">
          {meta ? <span className="sala-meta font-mono">{meta}</span> : null}
          <span className="sala-titulo font-poster">{item.title}</span>
          {item.description ? <span className="sala-desc">{item.description}</span> : null}
          {item.href ? <span className="sala-caso font-mono">{labels.readCase} →</span> : null}
        </span>
      </Boton>
      {loop && item.audio ? <LoopAudioButton src={item.audio} labels={labels.audio} className="sala-audio" /> : null}
    </article>
  );
}

/**
 * @param {object[]} items - piezas normalizadas del grupo
 * @param {boolean} loop - loops de TouchDesigner (formato asignado, audio)
 * @param {{loop: string, cursor: string, audio: object}} labels
 * @param {(index: number) => void} onOpen
 */
export default function Sala({ items, loop = false, labels, onOpen }) {
  const formatos = items.map((item, i) => (loop ? FORMATOS_LOOP[i % FORMATOS_LOOP.length] : formatoPropio(item)));
  const plan = planificarSala(formatos);
  return (
    <div className={`sala${loop ? " sala--loops" : ""}`}>
      {items.map((item, index) => (
        <Pieza
          key={`${item.title}-${index}`}
          item={item}
          index={index}
          lugar={plan[index]}
          formato={formatos[index]}
          loop={loop}
          labels={labels}
          onOpen={() => onOpen(index)}
        />
      ))}
    </div>
  );
}
