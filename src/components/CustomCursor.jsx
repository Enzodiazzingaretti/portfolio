import { useEffect, useRef } from "react";

/**
 * Cursor de mira. Un punto rojo sigue al puntero sin retraso y un marco de
 * cuatro esquinas lo persigue con inercia; sobre algo clickeable el marco se
 * «engancha» al elemento y lo encuadra, como un HUD que fija un blanco. Si el
 * elemento declara `data-cursor`, el marco muestra ese rótulo («VER», «LEER»).
 *
 * Elementos enormes (una fila del índice a todo el ancho) no se encuadran:
 * el marco quedaría en los bordes de la pantalla y no diría nada. Ahí solo se
 * agranda alrededor del puntero.
 *
 * Solo con mouse: en táctil no hay cursor que reemplazar.
 */
export default function CustomCursor() {
  const dot = useRef(null);
  const box = useRef(null);
  const label = useRef(null);

  // La clase que esconde el cursor del sistema la pone el componente que
  // dibuja el reemplazo, no la hoja global: asi las rutas que no montan el
  // Shell (/admin) conservan el cursor nativo en vez de quedarse sin ninguno.
  useEffect(() => {
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fino.matches) return undefined;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, []);

  useEffect(() => {
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fino.matches) return undefined;
    const elDot = dot.current;
    const elBox = box.current;
    const elLabel = label.current;
    if (!elDot || !elBox) return undefined;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -100, y: -100 };
    // Marco actual (x, y, w, h) y objetivo.
    const cur = { x: -100, y: -100, w: 34, h: 34 };
    let target = null;
    let visible = false;
    let raf = 0;

    const objetivo = () => {
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        const area = r.width * r.height;
        const pantalla = window.innerWidth * window.innerHeight;
        if (area > 0 && area < pantalla * 0.42 && r.width < window.innerWidth * 0.82) {
          const pad = 8;
          return { x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2, lock: true };
        }
        return { x: mouse.x - 28, y: mouse.y - 28, w: 56, h: 56, lock: false };
      }
      return { x: mouse.x - 17, y: mouse.y - 17, w: 34, h: 34, lock: false };
    };

    let locked = null;
    const frame = () => {
      const t = objetivo();
      const k = quieto ? 1 : 0.22;
      const dx = t.x - cur.x;
      const dy = t.y - cur.y;
      const dw = t.w - cur.w;
      const dh = t.h - cur.h;
      // Quieto y en su lugar: no se toca el DOM en ese cuadro.
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(dw) + Math.abs(dh) > 0.2) {
        cur.x += dx * k;
        cur.y += dy * k;
        cur.w += dw * k;
        cur.h += dh * k;
        elBox.style.transform = `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0)`;
        elBox.style.width = `${cur.w.toFixed(1)}px`;
        elBox.style.height = `${cur.h.toFixed(1)}px`;
      }
      if (locked !== t.lock) {
        locked = t.lock;
        elBox.classList.toggle("is-locked", t.lock);
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // transform en vez de left/top: evita recalcular layout en cada frame
      elDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        cur.x = mouse.x - 17;
        cur.y = mouse.y - 17;
        elDot.classList.add("is-visible");
        elBox.classList.add("is-visible");
      }
    };
    const onOver = (e) => {
      let hit = e.target.closest?.("[data-cursor], a, button, [role='button'], input[type='range'], label");
      // Las zonas de toque invisibles del visor (botones con aria-hidden) no
      // se encuadran: el marco dibujaría un rectángulo que no se ve en la
      // página y parecería un error.
      if (hit?.getAttribute?.("aria-hidden") === "true") hit = null;
      target = hit;
      const texto = hit?.getAttribute?.("data-cursor") ?? "";
      if (elLabel) elLabel.textContent = texto;
      elBox.classList.toggle("has-label", Boolean(texto));
      elDot.classList.toggle("hovering", Boolean(hit));
    };
    const onLeaveWindow = () => {
      visible = false;
      elDot.classList.remove("is-visible");
      elBox.classList.remove("is-visible");
    };
    const onDown = () => elBox.classList.add("clicking");
    const onUp = () => elBox.classList.remove("clicking");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={box} className="cursor-box" aria-hidden="true">
        <span className="cursor-corner cursor-corner--tl" />
        <span className="cursor-corner cursor-corner--tr" />
        <span className="cursor-corner cursor-corner--bl" />
        <span className="cursor-corner cursor-corner--br" />
        <span ref={label} className="cursor-label font-mono" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
