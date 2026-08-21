import { mulberry32, makeRng, beatEnv, beatIndex, BEAT_S } from "../prng";
import { paramReader } from "../controls";

/**
 * LITURGIA BRUTAL — subdivisión recursiva con glitch a tempo.
 * Una retícula brutalista se parte con proporciones áureas; la composición
 * es estática y severa hasta que el golpe la corta en bandas desplazadas
 * con un eco rojo aditivo. Cada 32 golpes la retícula se recompone:
 * corte seco, sin fundido — como cambia un loop en la cabina.
 */
const SPLITS = [0.382, 0.5, 0.618];

/**
 * `profundidad` y `corte` recomponen la retícula, así que se rebuildea sola
 * cuando cambian. Los guardas de tamaño mínimo acotan las hojas incluso en 7.
 */
export const controls = [
  { id: "profundidad", min: 3, max: 7, step: 1, def: 5 },
  { id: "corte", min: 0.4, max: 2.2, step: 0.01, def: 1 },
  { id: "glitch", min: 0, max: 2.5, step: 0.01, def: 1 },
  { id: "epoca", min: 0.25, max: 3, step: 0.01, def: 1 },
];

export default function createLiturgia({ w, h, seed, params }) {
  const p = paramReader(controls, params);
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const offCtx = off.getContext("2d");

  const ghost = document.createElement("canvas");
  ghost.width = w;
  ghost.height = h;
  const ghostCtx = ghost.getContext("2d");

  function buildLeaves(rng, maxDepth, cut) {
    const leaves = [];
    // chance() consume un rand() pase lo que pase: con corte en 1 la
    // secuencia es idéntica a la de antes de que esto fuera regulable.
    const stop = Math.min(0.32 * cut, 0.85);
    const subdivide = (x, y, ww, hh, depth) => {
      const done = depth >= maxDepth || (depth >= 2 && rng.chance(stop)) || ww < w * 0.07 || hh < h * 0.09;
      if (done) {
        const roll = rng.rand();
        leaves.push({
          x, y, w: ww, h: hh,
          style: roll < 0.66 ? "stroke" : roll < 0.78 ? "red" : roll < 0.86 ? "paper" : "hatch",
          bright: rng.rand(),
        });
        return;
      }
      const ratio = rng.pick(SPLITS);
      if ((ww > hh) !== rng.chance(0.18)) {
        subdivide(x, y, ww * ratio, hh, depth + 1);
        subdivide(x + ww * ratio, y, ww * (1 - ratio), hh, depth + 1);
      } else {
        subdivide(x, y, ww, hh * ratio, depth + 1);
        subdivide(x, y + hh * ratio, ww, hh * (1 - ratio), depth + 1);
      }
    };
    subdivide(0, 0, w, h, 0);
    return leaves;
  }

  function renderLayout(leaves) {
    offCtx.fillStyle = "#050505";
    offCtx.fillRect(0, 0, w, h);
    ghostCtx.clearRect(0, 0, w, h);

    const pad = Math.min(w, h) * 0.012;
    leaves.forEach((leaf) => {
      const x = leaf.x + pad;
      const y = leaf.y + pad;
      const ww = leaf.w - pad * 2;
      const hh = leaf.h - pad * 2;
      if (ww <= 0 || hh <= 0) return;

      if (leaf.style === "red") {
        offCtx.fillStyle = leaf.bright > 0.5 ? "#B11212" : "#5B0000";
        offCtx.fillRect(x, y, ww, hh);
      } else if (leaf.style === "paper") {
        offCtx.fillStyle = "#EAEAEA";
        offCtx.fillRect(x, y, ww, hh);
      } else if (leaf.style === "hatch") {
        offCtx.strokeStyle = "rgba(234,234,234,0.30)";
        offCtx.lineWidth = 1;
        offCtx.beginPath();
        const gap = 6 + Math.floor(leaf.bright * 6);
        for (let i = -hh; i < ww; i += gap) {
          offCtx.moveTo(x + i, y + hh);
          offCtx.lineTo(x + i + hh, y);
        }
        offCtx.stroke();
        offCtx.strokeStyle = "rgba(234,234,234,0.22)";
        offCtx.strokeRect(x, y, ww, hh);
      } else {
        offCtx.strokeStyle = `rgba(234,234,234,${0.14 + leaf.bright * 0.2})`;
        offCtx.lineWidth = 1;
        offCtx.strokeRect(x, y, ww, hh);
      }

      // Eco fantasma: misma retícula, solo trazos rojos sobre transparente
      ghostCtx.strokeStyle = "rgba(255,42,42,0.9)";
      ghostCtx.lineWidth = 1;
      ghostCtx.strokeRect(x, y, ww, hh);
    });
  }

  let epoch = -1;
  let builtWith = "";

  return {
    warmupFrames: 1,
    frame(ctx, t) {
      const depth = Math.round(p("profundidad"));
      const cut = p("corte");
      const gm = p("glitch");

      // Recomposición cada 32 golpes: corte seco, determinista por época
      const currentEpoch = Math.floor(t / (BEAT_S * 32 * p("epoca")));
      const signature = `${currentEpoch}|${depth}|${cut}`;
      if (signature !== builtWith) {
        builtWith = signature;
        epoch = currentEpoch;
        renderLayout(buildLeaves(makeRng((seed ^ (epoch * 0x9E3779B9)) >>> 0), depth, cut));
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(off, 0, 0);

      // Glitch cuantizado: el golpe corta la imagen en bandas desplazadas
      const g = beatEnv(t, 2) * gm;
      if (g > 0.3) {
        const bandRand = mulberry32((seed + beatIndex(t) * 2654435761) >>> 0);
        const bands = 2 + Math.floor(bandRand() * 3);
        for (let i = 0; i < bands; i += 1) {
          const by = Math.floor(bandRand() * h * 0.9);
          const bh = Math.floor(h * (0.02 + bandRand() * 0.06));
          const dx = (bandRand() - 0.5) * w * 0.09 * g;
          ctx.drawImage(off, 0, by, w, bh, dx, by, w, bh);
        }
        // Eco rojo aditivo desplazado: cromatismo de pantalla rota
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.min(0.35 * g, 0.6);
        ctx.drawImage(ghost, (bandRand() - 0.5) * 10 * g, (bandRand() - 0.5) * 6 * g);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    },
  };
}
