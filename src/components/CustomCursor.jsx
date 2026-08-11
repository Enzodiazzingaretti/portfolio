import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef(null);

  // La clase que esconde el cursor del sistema la pone el componente que
  // dibuja el reemplazo, no la hoja global: asi las rutas que no montan el
  // Shell (/admin) conservan el cursor nativo en vez de quedarse sin ninguno.
  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, []);

  useEffect(() => {
    const el = dot.current;
    if (!el) return;

    const onMove = (e) => {
      // transform en vez de left/top: evita recalcular layout en cada frame
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    const onOver = (e) => {
      const hoverable = e.target.closest("a, button, [role='button']");
      el.classList.toggle("hovering", !!hoverable);
    };
    const onDown = () => el.classList.add("clicking");
    const onUp   = () => el.classList.remove("clicking");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  return <div ref={dot} className="cursor-dot" aria-hidden />;
}
