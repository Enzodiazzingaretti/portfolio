import { useEffect, useState } from "react";

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useFPS() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let last = performance.now();
    let frames = 0;
    let raf;
    const tick = (now) => {
      frames++;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

const HINT = {
  es: 'intentá escribir "kexxy"',
  en: 'try typing "kexxy"',
  pt: 'tente digitar "kexxy"',
};

const pad = (n) => String(n).padStart(2, "0");

function useSlowBlink(ms) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 1800);
    };
    const id = setInterval(show, ms);
    return () => clearInterval(id);
  }, [ms]);
  return visible;
}

export default function HudOverlay({ language = "es" }) {
  const time = useClock();
  const fps = useFPS();
  const hintVisible = useSlowBlink(4000);

  const hh = pad(time.getHours());
  const mm = pad(time.getMinutes());
  const ss = pad(time.getSeconds());
  const dateStr = `${time.getFullYear()}.${pad(time.getMonth() + 1)}.${pad(time.getDate())}`;

  return (
    <>
      <div className="hud-corner hud-corner--tl" aria-hidden="true">
        <span>SYS_LOG_01</span>
        <span>STATUS: OPERATIONAL</span>
        <span>{dateStr} — {hh}:{mm}:{ss}</span>
      </div>

      <div className="hud-corner hud-corner--tr" aria-hidden="true">
        <span>FPS: {fps}</span>
        <span>LAT: -34.6037°</span>
        <span>LON: -58.3816°</span>
      </div>

      <div className="hud-corner hud-corner--bl" aria-hidden="true">
        <span>PORTFOLIO</span>
        <span>BUILD: 2026.V1</span>
      </div>

      <div className="hud-corner hud-corner--br" aria-hidden="true">
        <span
          className="transition-opacity duration-700"
          style={{ opacity: hintVisible ? 1 : 0, fontSize: "10px", letterSpacing: "0.18em" }}
        >
          // {HINT[language] ?? HINT.es}
        </span>
      </div>
    </>
  );
}
