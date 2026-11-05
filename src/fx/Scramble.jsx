import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInView } from "./useInView";

const GLYPHS = "▓▒░█▚▞<>/\\|_=+*#%01ABCDEFGHJKLMNPRSTUVXYZ";

/**
 * Texto que llega como señal: los caracteres se decodifican de a uno hasta
 * quedar en el texto real. Es el lado «señal» del lenguaje visual, el de los
 * press kits de Shodnan y del reel de Sonar.
 *
 * El texto real está siempre en el DOM (transparente mientras dura el
 * efecto): reserva el ancho exacto, no hay saltos de layout y los lectores de
 * pantalla leen la palabra, no el ruido. El ruido va en una capa aparte con
 * `aria-hidden`.
 *
 * @param {object} props
 * @param {string} props.text
 * @param {"view"|"hover"|"mount"} [props.trigger]
 * @param {number} [props.duration] ms
 * @param {number} [props.delay] ms
 * @param {string} [props.as]
 * @param {string} [props.className]
 */
export default function Scramble({ text, trigger = "view", duration = 760, delay = 0, as: Tag = "span", className = "", ...rest }) {
  const [ref, inView] = useInView({ rootMargin: "0px 0px -6% 0px" });
  const [noise, setNoise] = useState(null);
  const frame = useRef(0);
  const ran = useRef(false);

  const run = () => {
    if (!text || prefersReducedMotion()) return;
    cancelAnimationFrame(frame.current);
    const chars = Array.from(text);
    // Cada caracter se resuelve en su propio momento, con un sesgo hacia la
    // izquierda para que la palabra se lea "entrando" en el sentido de lectura.
    const settle = chars.map((_, i) => (i / chars.length) * 0.55 + Math.random() * 0.45);
    let start = 0;
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = Math.max(0, (now - start) / duration);
      if (t >= 1) {
        setNoise(null);
        return;
      }
      setNoise(
        chars
          .map((c, i) => {
            if (c === " " || t >= settle[i]) return c;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger === "mount" && !ran.current) {
      ran.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (trigger === "view" && inView && !ran.current) {
      ran.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, inView]);

  // Si cambia el texto (cambio de idioma) se vuelve a decodificar.
  const previo = useRef(text);
  useEffect(() => {
    if (previo.current === text) return;
    previo.current = text;
    if (ran.current) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const hover = trigger === "hover" ? { onMouseEnter: run, onFocus: run } : {};

  return (
    <Tag ref={ref} className={`scramble${noise ? " is-scrambling" : ""} ${className}`} {...hover} {...rest}>
      <span className="scramble-text">{text}</span>
      {noise ? (
        <span className="scramble-noise" aria-hidden="true">
          {noise}
        </span>
      ) : null}
    </Tag>
  );
}
