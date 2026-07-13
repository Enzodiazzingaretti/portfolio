import { useMemo, useRef, useEffect, useState, useId } from "react";
import { generateCells } from "../utils/voronoi";

const VB_W = 1200;
const VB_H = 80;

/**
 * Divisoria con motivo celular/Voronoi (membranas orgánicas).
 * Se "dibuja" al entrar en viewport (stroke-dashoffset) de izquierda a derecha.
 * @param {number} [seed] - semilla del patrón (estable → mismo dibujo)
 * @param {number} [count] - cantidad de celdas
 * @param {number} [accent] - cuántas celdas llevan el acento rojo
 */
export default function CellularDivider({ seed, count = 46, accent = 3, className = "" }) {
  const resolvedSeed = useMemo(
    () => (seed == null ? Math.floor(Math.random() * 1e6) : seed),
    [seed],
  );
  const cells = useMemo(
    () => generateCells({ seed: resolvedSeed, count, width: VB_W, height: VB_H }),
    [resolvedSeed, count],
  );

  const accentSet = useMemo(() => {
    const set = new Set();
    if (cells.length) {
      const step = Math.max(1, Math.floor(cells.length / (accent + 1)));
      for (let i = 1; i <= accent; i += 1) set.add((i * step) % cells.length);
    }
    return set;
  }, [cells, accent]);

  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const maskId = useId();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`cell-divider ${drawn ? "is-drawn" : ""} ${className}`}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id={`${maskId}-g`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="black" />
            <stop offset="0.12" stopColor="white" />
            <stop offset="0.88" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </linearGradient>
          <mask id={`${maskId}-m`}>
            <rect width={VB_W} height={VB_H} fill={`url(#${maskId}-g)`} />
          </mask>
        </defs>
        <g mask={`url(#${maskId}-m)`}>
          {cells.map((cell, i) => (
            <path
              key={i}
              d={cell.d}
              pathLength="1"
              className={accentSet.has(i) ? "cell cell--accent" : "cell"}
              style={{ transitionDelay: `${Math.round((cell.cx / VB_W) * 1200)}ms` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
