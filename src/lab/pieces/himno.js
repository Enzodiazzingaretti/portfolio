import { makeRng, beatEnv, BEAT_S, PALETTE } from "../prng";

/**
 * HIMNO FANTASMA — armonógrafo de fósforo.
 * Dos péndulos amortiguados por eje trazan curvas armónicas que decaen;
 * cuando la energía muere, el siguiente compás re-excita el sistema con
 * una nueva relación de frecuencias enteras. Fósforo: núcleo blanco fino
 * sobre halo rojo aditivo, acumulados en un fade lento.
 */
const RATIOS = [[2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [2, 5], [5, 7]];

export default function createHimno({ w, h, seed }) {
  const rng = makeRng(seed);
  const cx = w / 2;
  const cy = h / 2;
  const S = Math.min(w, h) * 0.40;

  const state = {
    fa: 0, fb: 0, fc: 0, fd: 0,
    pa: 0, pb: 0, pc: 0, pd: 0,
    tau: 0,
    energy: 1,
    lastBeat: -1,
    prevX: null,
    prevY: null,
  };

  function excite() {
    const [rx1, rx2] = rng.pick(RATIOS);
    const [ry1, ry2] = rng.pick(RATIOS);
    const detune = rng.range(0.001, 0.006); // batido lento entre ejes
    state.fa = rx1; state.fb = rx2;
    state.fc = ry1 + detune; state.fd = ry2;
    state.pa = rng.range(0, Math.PI * 2);
    state.pb = rng.range(0, Math.PI * 2);
    state.pc = rng.range(0, Math.PI * 2);
    state.pd = rng.range(0, Math.PI * 2);
    state.energy = 1;
    state.prevX = null;
  }

  excite();

  const STEPS = 420;      // resolución del trazo por frame
  const DECAY = 0.115;    // vida ≈ dos compases

  return {
    warmupFrames: 300,
    frame(ctx, t, dt) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `${PALETTE.fade}0.045)`;
      ctx.fillRect(0, 0, w, h);

      state.energy *= Math.exp(-dt * DECAY * 4);
      // Re-excitación cuantizada al compás: el himno respira a tempo
      const beat = Math.floor(t / (BEAT_S * 4));
      if (state.energy < 0.16 && beat !== state.lastBeat) {
        state.lastBeat = beat;
        excite();
      }

      const speed = 0.9 + beatEnv(t, 4) * 0.25;
      const stepTau = (dt * speed * 2.2) / STEPS * 60;
      // Piso de amplitud: la figura respira pero nunca colapsa del todo
      const E = 0.38 + state.energy * 0.62;

      // Trazo continuo: retoma el último punto del frame anterior
      const path = new Path2D();
      let started = false;
      if (state.prevX !== null) {
        path.moveTo(state.prevX, state.prevY);
        started = true;
      }
      for (let i = 0; i < STEPS; i += 1) {
        state.tau += stepTau;
        const τ = state.tau;
        const x = cx + S * E * (Math.sin(τ * state.fa + state.pa) * 0.62 + Math.sin(τ * state.fb + state.pb) * 0.38);
        const y = cy + S * E * (Math.sin(τ * state.fc + state.pc) * 0.62 + Math.cos(τ * state.fd + state.pd) * 0.38);
        if (!started) { path.moveTo(x, y); started = true; } else path.lineTo(x, y);
        state.prevX = x;
        state.prevY = y;
      }

      // Halo rojo aditivo + núcleo de fósforo blanco
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `${PALETTE.red}${0.07 + E * 0.06})`;
      ctx.lineWidth = 3.4;
      ctx.stroke(path);
      ctx.strokeStyle = `${PALETTE.white}${0.10 + state.energy * 0.16})`;
      ctx.lineWidth = 1;
      ctx.stroke(path);
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
