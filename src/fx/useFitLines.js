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
      const lines = Array.from(root.querySelectorAll("[data-fit]"));
      // 1) Cada renglón al ancho de su caja.
      const sizes = lines.map((el) => {
        const box = el.parentElement?.getBoundingClientRect().width ?? 0;
        el.style.fontSize = "100px";
        const w = el.getBoundingClientRect().width;
        return box && w ? (100 * box) / w : 0;
      });
      // 2) Un mismo factor para todos si alguno pasa su alto máximo (vh): así
      //    los renglones siguen justificados al mismo ancho, como un bloque.
      let k = 1;
      lines.forEach((el, i) => {
        const maxVh = Number(el.dataset.fitMax || 0);
        if (maxVh && sizes[i]) k = Math.min(k, (window.innerHeight * maxVh) / 100 / sizes[i]);
      });
      const aplicar = () =>
        lines.forEach((el, i) => {
          if (sizes[i]) el.style.fontSize = `${Math.floor(sizes[i] * k * 100) / 100}px`;
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
      // Ancho real del bloque: la escultura se monta sobre su borde derecho.
      const ancho = Math.max(0, ...lines.map((el) => el.getBoundingClientRect().width));
      root.style.setProperty("--name-w", `${Math.round(ancho)}px`);
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
