import { Delaunay } from "d3-delaunay";

// RNG determinista para que cada semilla dé siempre el mismo patrón
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function centroid(poly) {
  let x = 0;
  let y = 0;
  let a = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    const cross = x0 * y1 - x1 * y0;
    a += cross;
    x += (x0 + x1) * cross;
    y += (y0 + y1) * cross;
  }
  a *= 0.5;
  if (Math.abs(a) < 1e-6) {
    const n = poly.length;
    return [
      poly.reduce((sum, p) => sum + p[0], 0) / n,
      poly.reduce((sum, p) => sum + p[1], 0) / n,
    ];
  }
  return [x / (6 * a), y / (6 * a)];
}

// Curva cerrada suave que pasa por los puntos medios de cada arista,
// usando los vértices como puntos de control → celdas orgánicas tipo espuma
function smoothClosedPath(poly) {
  const n = poly.length;
  if (n < 3) return "";
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (v) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const first = mid(poly[0], poly[1]);
  let d = `M${f(first)}`;
  for (let i = 0; i < n; i += 1) {
    const control = poly[(i + 1) % n];
    const end = mid(poly[(i + 1) % n], poly[(i + 2) % n]);
    d += `Q${f(control)} ${f(end)}`;
  }
  return `${d}Z`;
}

/**
 * Genera celdas Voronoi orgánicas (relajadas con Lloyd) como paths SVG.
 * @returns {Array<{d:string, cx:number, cy:number}>} ordenadas por x
 */
export function generateCells({
  seed = 1,
  count = 44,
  width = 1200,
  height = 80,
  relax = 2,
  padding = 60,
} = {}) {
  const rand = mulberry32(seed);
  const bounds = [-padding, -padding, width + padding, height + padding];
  let pts = Array.from({ length: count }, () => [
    -padding + rand() * (width + padding * 2),
    -padding + rand() * (height + padding * 2),
  ]);

  // Relajación de Lloyd: mueve cada punto al centroide de su celda
  for (let r = 0; r < relax; r += 1) {
    const vor = Delaunay.from(pts).voronoi(bounds);
    pts = pts.map((p, i) => {
      const poly = vor.cellPolygon(i);
      return poly ? centroid(poly.slice(0, -1)) : p;
    });
  }

  const vor = Delaunay.from(pts).voronoi(bounds);
  const cells = [];
  for (let i = 0; i < pts.length; i += 1) {
    const poly = vor.cellPolygon(i);
    if (!poly) continue;
    const ring = poly.slice(0, -1);
    const c = centroid(ring);
    // Solo celdas cuyo centro cae dentro de la banda visible
    if (c[0] < 0 || c[0] > width) continue;
    cells.push({ d: smoothClosedPath(ring), cx: c[0], cy: c[1] });
  }
  cells.sort((a, b) => a.cx - b.cx);
  return cells;
}
