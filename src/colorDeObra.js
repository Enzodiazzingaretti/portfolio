/**
 * El color de una obra, para iluminar el visor con él (2026-11-08): se
 * reduce la imagen a 32 px, se agrupan los píxeles por tono (pesando la
 * saturación) y del tono ganador sale un acento con luz pareja, legible
 * sobre el fondo oscuro. Una obra casi gris devuelve null y el visor queda
 * con el acento del sitio. Se calcula una vez por imagen.
 */
const cache = new Map();

function rgbAHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslARgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
}

export function colorDeObra(src) {
  if (!src) return Promise.resolve(null);
  if (cache.has(src)) return cache.get(src);
  const promesa = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const lado = 32;
        const canvas = document.createElement("canvas");
        canvas.width = lado;
        canvas.height = lado;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, lado, lado);
        const { data } = ctx.getImageData(0, 0, lado, lado);
        // 24 cubos de 15° de tono, pesados por saturación y por no ser ni
        // negro ni blanco
        const peso = new Array(24).fill(0);
        const sumaS = new Array(24).fill(0);
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [h, s, l] = rgbAHsl(data[i], data[i + 1], data[i + 2]);
          const w = s * (1 - Math.abs(l * 2 - 1));
          total += 1;
          if (w < 0.08) continue;
          const c = Math.floor(h / 15) % 24;
          peso[c] += w;
          sumaS[c] += s * w;
        }
        let mejor = 0;
        for (let c = 1; c < 24; c++) if (peso[c] > peso[mejor]) mejor = c;
        // Muy poco color: la obra es casi gris
        if (peso[mejor] / total < 0.035) return resolve(null);
        const h = mejor * 15 + 7.5;
        const s = Math.min(Math.max(sumaS[mejor] / peso[mejor], 0.5), 0.85);
        resolve({ acento: hslARgb(h, s, 0.56), claro: hslARgb(h, s, 0.72) });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
  cache.set(src, promesa);
  return promesa;
}
