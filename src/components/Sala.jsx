import MediaAsset from "./MediaAsset";
import { FORMATOS_LOOP, formatoPropio, orientacion, planificarSala } from "../salaPlan";
import LoopAudioButton from "./LoopAudioButton";
import { loopAudio } from "../audio/loopAudio";

/**
 * «Sala»: las piezas que se mueven (renders y animaciones de 3D, loops de
 * TouchDesigner, comerciales) colgadas como en una muestra, no en una grilla
 * pareja de cajas. Cada pieza va grande, con su número en contorno detrás,
 * un marco con forma según su formato (arco las verticales, hoja las
 * apaisadas, lente o cuadrado blando las cuadradas) y un segundo marco
 * corrido, como un registro de imprenta que se acomoda al pasar el mouse.
 *
 * En desktop las piezas van de a pares, una grande y una chica, alternando
 * de lado y con la chica desfasada hacia abajo; las panorámicas van solas.
 * Tres verticales solas forman un tríptico de arcos. En el celular van de a
 * una, alternando el lado, con las apaisadas de borde a borde.
 */

function pad(n) {
  return String(n).padStart(2, "0");
}

/** Forma del marco: arco las verticales, hoja las apaisadas (alternando la diagonal). */
function forma(o, index, loop) {
  if (o === "P") return "arco";
  if (o === "S") return loop ? "lente" : "blanda";
  return index % 2 ? "hoja-b" : "hoja-a";
}

function Pieza({ item, index, lugar, formato, loop, labels, onOpen }) {
  const o = orientacion(formato);
  const [w, h] = formato.split("/").map(Number);
  const extra = (item.slides?.length ?? 0) - 1;
  const lado = lugar.col + lugar.span / 2 > 6.5 ? "der" : "izq";
  const meta = loop ? `${labels.loop} ${pad(index + 1)}` : item.subtitle;

  return (
    <article
      className={`sala-pieza sala-pieza--${o} sala-pieza--${lado}${loop && item.audio ? " sala-pieza--audio" : ""} reveal-on-scroll`}
      style={{ "--col": lugar.col, "--span": lugar.span, "--desfase": lugar.desfase, "--hw": h / w }}
      onMouseEnter={loop && item.audio ? () => loopAudio.alEntrar(item.audio) : undefined}
      onMouseLeave={loop && item.audio ? () => loopAudio.alSalir(item.audio) : undefined}
    >
      <span className="sala-num font-poster" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <button type="button" className="sala-boton" onClick={onOpen} data-cursor={labels.cursor} data-tilt="0.35">
        <span className={`sala-cuadro sala-cuadro--${forma(o, index, loop)}`} style={{ aspectRatio: formato.replace("/", " / ") }}>
          {/* El eco: el mismo marco corrido, como un registro de imprenta */}
          <span className="sala-eco" aria-hidden="true" />
          <span className="sala-marco">
            <span className="sala-deriva">
              <span className="sala-zoom">
                <MediaAsset src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
              </span>
            </span>
          </span>
          {extra > 0 ? (
            <span className="sala-vistas font-mono" aria-hidden="true">
              +{extra}
            </span>
          ) : null}
        </span>
        <span className="sala-pie">
          {meta ? <span className="sala-meta font-mono">{meta}</span> : null}
          <span className="sala-titulo font-poster">{item.title}</span>
          {item.description ? <span className="sala-desc">{item.description}</span> : null}
        </span>
      </button>
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
