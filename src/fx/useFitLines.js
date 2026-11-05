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
      // la banda y la escultura se centran en el hueco entre los dos.
      const stage = root.querySelector(".vx-stage");
      const top = root.querySelector(".vx-name-row--top");
      const bottom = root.querySelector(".vx-name-row--bottom");
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
