import { Volume2, VolumeX } from "lucide-react";
import { loopAudio } from "../audio/loopAudio";
import { useLoopAudio } from "../hooks/useLoopAudio";

/**
 * El parlante de una pieza con audio.
 *
 * Va siempre como *hermano* de la card, nunca adentro: tanto el tile de
 * /motion como la card del showcase ya son un elemento interactivo entero
 * (`<button>` y `<Link>`), y anidar un botón dentro de otro es HTML inválido
 * —además de dejar al teclado sin forma de llegar al de adentro—. Se posiciona
 * encima por CSS.
 *
 * @param {string} src - ruta del .m4a de la pieza
 * @param {{listen: string, mute: string}} labels
 */
export default function LoopAudioButton({ src, labels, className = "" }) {
  const { sonando } = useLoopAudio();
  const activo = sonando === src;
  const Icono = activo ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      className={`loop-audio-btn${activo ? " is-playing" : ""} ${className}`}
      aria-label={activo ? labels?.mute : labels?.listen}
      aria-pressed={activo}
      onClick={(event) => {
        // La card de abajo navega; este click es solo para el sonido.
        event.preventDefault();
        event.stopPropagation();
        loopAudio.alternar(src);
      }}
    >
      <Icono size={15} strokeWidth={1.75} aria-hidden="true" />
      <span className="loop-audio-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
