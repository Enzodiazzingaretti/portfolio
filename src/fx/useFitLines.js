import { useEffect } from "react";

/**
 * Ajusta el cuerpo de cada renglón `[data-fit]` para que ocupe justo el ancho
 * de su contenedor, como un titular de afiche compuesto a mano. El alto lo
 * limita `data-fit-max` (en vh). Al terminar avisa con `hero-layout`: la
 * escena de vidrio vuelve a medir el nombre para dibujarlo detrás del vidrio.
 */
export function useFitLines(ref, deps = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    let raf = 0;

    const fit = () => {
      raf = 0;
      root.querySelectorAll("[data-fit]").forEach((el) => {
        const box = el.parentElement?.getBoundingClientRect().width ?? 0;
        if (!box) return;
        el.style.fontSize = "100px";
        const w = el.getBoundingClientRect().width;
        if (!w) return;
        const maxVh = Number(el.dataset.fitMax || 0);
        let size = (100 * box) / w;
        if (maxVh) size = Math.min(size, (window.innerHeight * maxVh) / 100);
        el.style.fontSize = `${Math.floor(size * 100) / 100}px`;
      });
      // Composición del hero: la fila editorial va pegada al primer renglón y
      // la banda y la escultura se centran en el hueco entre los dos. En
      // pantallas bajas (1280×720, 1024×768) los renglones a todo el ancho
      // dejan un hueco más chico que la banda: se achican hasta que entre.
      const stage = root.querySelector(".vx-stage");
      const top = root.querySelector(".vx-name-row--top");
      const bottom = root.querySelector(".vx-name-row--bottom");
      const band = root.querySelector(".vx-band");
      if (stage && top && bottom && band && getComputedStyle(band).position === "absolute") {
        const lines = root.querySelectorAll("[data-fit]");
        for (let i = 0; i < 8; i++) {
          const hueco = bottom.getBoundingClientRect().top - top.getBoundingClientRect().bottom;
          if (hueco >= band.offsetHeight + 72) break;
          lines.forEach((el) => {
            el.style.fontSize = `${Math.floor(parseFloat(el.style.fontSize) * 0.9 * 100) / 100}px`;
          });
        }
      }
      if (stage && top) {
        const s = stage.getBoundingClientRect();
        const a = top.getBoundingClientRect().bottom - s.top;
        const b = bottom ? bottom.getBoundingClientRect().top - s.top : s.height;
        stage.style.setProperty("--rule-top", `${Math.round(a)}px`);
        stage.style.setProperty("--gap-mid", `${Math.round((a + b) / 2)}px`);
      }
      window.dispatchEvent(new Event("hero-layout"));
    };

    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(fit);
    };

    pedir();
    document.fonts?.ready?.then(pedir);
    const ro = new ResizeObserver(pedir);
    ro.observe(root);
    window.addEventListener("resize", pedir);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", pedir);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
