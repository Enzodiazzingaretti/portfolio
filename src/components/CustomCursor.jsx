import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef(null);

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
