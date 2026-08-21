import { useEffect, useMemo, useRef } from "react";

/**
 * GenerativeCanvas - Lienzo para las obras de Liturgia Máquina
 * Maneja el ciclo de vida del algoritmo: RAF con dt clampeado, pausa fuera
 * de viewport y con pestaña oculta, y modo estático (reduced motion) que
 * corre un warmup una sola vez para dejar un frame compuesto.
 * @param {Object} props
 * @param {Function} props.createPiece - Factory de la obra ({w,h,seed,params}) => {frame, warmupFrames}
 * @param {number} props.seed - Semilla: misma semilla, misma obra
 * @param {number} props.width - Resolución interna horizontal
 * @param {number} props.height - Resolución interna vertical
 * @param {Object} props.params - Valores de los sliders; se leen en vivo
 * @param {boolean} props.staticMode - true = un solo frame compuesto (reduced motion)
 */
export default function GenerativeCanvas({ createPiece, seed, width, height, params, staticMode = false, className = "" }) {
  const canvasRef = useRef(null);
  // Espejo de identidad estable: la obra guarda ESTE objeto y lee el valor
  // nuevo en el frame siguiente. Mover un slider no reconstruye la escena —
  // reconstruirla vaciaría el lienzo, y en estas obras la imagen es memoria
  // acumulada de miles de frames.
  const liveParams = useRef({});
  Object.assign(liveParams.current, params);

  // Sin animación no hay frame siguiente donde leer: el modo estático sí
  // tiene que recomponer la obra cuando cambia un parámetro.
  const staticKey = useMemo(
    () => (staticMode ? JSON.stringify(params ?? {}) : ""),
    [staticMode, params],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    // Reduced motion: recomponer es correr el warmup entero de una (en
    // comunión son ~40M de actualizaciones de celda). Sin el debounce, cada
    // paso de un slider arrastrado dispara uno y la pestaña se traba.
    if (staticMode) {
      const timer = setTimeout(() => {
        const piece = createPiece({ w: width, h: height, seed, params: liveParams.current });
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, width, height);
        const steps = piece.warmupFrames ?? 240;
        for (let i = 0; i < steps; i += 1) piece.frame(ctx, i / 30, 1 / 30);
      }, 220);
      return () => clearTimeout(timer);
    }

    const piece = createPiece({ w: width, h: height, seed, params: liveParams.current });
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    let raf = 0;
    let last = 0;
    let lastDraw = 0;
    let destroyed = false;
    let visible = true;
    let pieceTime = 0; // reloj propio: las pausas no saltean el pulso
    // 30fps en compact, como el resto de los canvas del sitio
    const compact = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const frameInterval = compact ? 1000 / 30 : 0;

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.12 },
    );
    observer.observe(canvas);

    const tick = (timestamp) => {
      if (destroyed) return;
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) {
        last = timestamp;
        return;
      }
      if (frameInterval && timestamp - lastDraw < frameInterval) return;
      lastDraw = timestamp;
      const dt = last ? Math.min((timestamp - last) / 1000, 0.05) : 1 / 60;
      last = timestamp;
      pieceTime += dt;
      piece.frame(ctx, pieceTime, dt);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
    // `params` no está en deps a propósito: la obra lo lee por referencia
    // viva, y en modo estático entra por `staticKey`.
  }, [createPiece, seed, width, height, staticMode, staticKey]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
