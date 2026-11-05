import { useEffect } from "react";

/**
 * La atmósfera del sitio: grafito con dos luces difusas (roja cálida arriba,
 * humo frío abajo), una retícula editorial casi invisible y el grano. Es una
 * capa fija debajo de todo; las luces se corren despacio con el scroll.
 *
 * Además maneja, una sola vez para todo el sitio:
 * - `--scroll-k` en <html> (0 a 1, cuánto se bajó), que usan las luces;
 * - la inclinación de los elementos con `data-tilt`: con el mouse encima se
 *   les escriben `--rx`/`--ry` (grados) y `--mx`/`--my` (dónde está el
 *   puntero, para el reflejo). Un solo listener delegado, con rAF.
 * Sin mouse fino o con movimiento reducido no se inclina nada.
 */
export default function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let rafScroll = 0;
    const onScroll = () => {
      if (rafScroll) return;
      rafScroll = requestAnimationFrame(() => {
        rafScroll = 0;
        const max = Math.max(1, root.scrollHeight - window.innerHeight);
        root.style.setProperty("--scroll-k", (window.scrollY / max).toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = null;
    let ev = null;
    let rafTilt = 0;

    const soltar = (el) => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    const aplicar = () => {
      rafTilt = 0;
      if (!ev) return;
      const el = ev.target instanceof Element ? ev.target.closest("[data-tilt]") : null;
      if (current && current !== el) soltar(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
      const k = Number(el.dataset.tilt) || 1;
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--rx", `${((0.5 - y) * 7 * k).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * 9 * k).toFixed(2)}deg`);
      el.classList.add("is-tilting");
    };

    const onMove = (e) => {
      ev = e;
      if (!rafTilt) rafTilt = requestAnimationFrame(aplicar);
    };
    const onLeave = () => {
      if (current) soltar(current);
      current = null;
    };

    if (fino && !quieto) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(rafScroll);
      cancelAnimationFrame(rafTilt);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="atmo" aria-hidden="true">
      <span className="atmo-light atmo-light--red" />
      <span className="atmo-light atmo-light--smoke" />
      <span className="atmo-light atmo-light--ember" />
      <span className="atmo-grid" />
    </div>
  );
}
