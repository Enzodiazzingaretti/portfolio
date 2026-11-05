import { useEffect } from "react";

/**
 * Compone los renglones `[data-fit]` a un mismo cuerpo, el que hace que el
 * más largo ocupe justo el ancho de su contenedor, como un titular de afiche.
 * El alto lo limita `data-fit-max` (en vh). Al terminar avisa con `hero-layout`: la
 * escena de vidrio vuelve a medir el nombre para dibujarlo detrás del vidrio.
 */
export function useFitLines(ref, deps = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    let raf = 0;

    const fit = () => {
      raf = 0;
      const lines = Array.from(root.querySelectorAll("[data-fit]"));
      // 1) Cada renglón al ancho de su caja.
      const sizes = lines.map((el) => {
        const box = el.parentElement?.getBoundingClientRect().width ?? 0;
        el.style.fontSize = "100px";
        const w = el.getBoundingClientRect().width;
        return box && w ? (100 * box) / w : 0;
      });
      // 2) Todos los renglones al cuerpo del más largo (el que pide la letra
      //    más chica): comparten tamaño y el nombre se lee como un bloque
      //    aunque un renglón sea corto («ENZO» sobre «ZINGARETTI»). El alto
      //    lo topa `data-fit-max`, en vh.
      const comun = Math.min(...sizes.filter(Boolean), Infinity);
      let k = 1;
      lines.forEach((el) => {
        const maxVh = Number(el.dataset.fitMax || 0);
        if (maxVh && Number.isFinite(comun)) k = Math.min(k, (window.innerHeight * maxVh) / 100 / comun);
      });
      const aplicar = () =>
        lines.forEach((el, i) => {
          if (sizes[i] && Number.isFinite(comun)) el.style.fontSize = `${Math.floor(comun * k * 100) / 100}px`;
        });
      aplicar();
      // 3) En desktop el hero entra en una pantalla: si no entra (1280×720,
      //    1024×768), el bloque del nombre se achica hasta que entre.
      if (window.matchMedia("(min-width: 768px) and (orientation: landscape)").matches) {
        for (let i = 0; i < 8 && root.scrollHeight > window.innerHeight + 2; i++) {
          k *= 0.92;
          aplicar();
        }
      }
      // Ancho y alto reales del bloque: la escultura se monta sobre su borde
      // derecho y se mide contra su alto, así guarda la proporción con las
      // letras en cualquier pantalla.
      const cajas = lines.map((el) => el.getBoundingClientRect());
      const ancho = Math.max(0, ...cajas.map((r) => r.width));
      const alto = cajas.length ? Math.max(...cajas.map((r) => r.bottom)) - Math.min(...cajas.map((r) => r.top)) : 0;
      root.style.setProperty("--name-w", `${Math.round(ancho)}px`);
      root.style.setProperty("--name-h", `${Math.round(alto)}px`);
      window.dispatchEvent(new Event("hero-layout"));
    };

    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(fit);
    };

    pedir();
    document.fonts?.ready?.then(pedir);
    // La hoja de Google Fonts entra asíncrona (media="print" → "all"): cuando
    // `fonts.ready` se resuelve, Anton todavía no está registrada y el nombre
    // quedaba medido —y dibujado detrás del vidrio— con la fuente de
    // reemplazo. Cada tanda de fuentes que termina de cargar vuelve a ajustar
    // (y el `hero-layout` del final hace que la escena lo redibuje).
    document.fonts?.addEventListener?.("loadingdone", pedir);
    const ro = new ResizeObserver(pedir);
    ro.observe(root);
    window.addEventListener("resize", pedir);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", pedir);
      document.fonts?.removeEventListener?.("loadingdone", pedir);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
