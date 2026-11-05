import { useRef } from "react";
import MediaAsset from "./MediaAsset";

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * Tarjeta de un reel: formato 9:16, con el loop liviano corriendo apenas
 * entra en pantalla y el rótulo de grabación arriba. Abre el visor con el
 * reel completo. Se usa en el home (riel horizontal) y en /motion (grilla).
 */
export function ReelCard({ item, index, onOpen, labels, numerado = false }) {
  return (
    <article className="rl-card">
      {/* En /motion cada reel lleva su número en contorno detrás, como la sala */}
      {numerado ? (
        <span className="rl-num font-poster" aria-hidden="true">
          {pad(index + 1)}
        </span>
      ) : null}
      <button type="button" className="rl-button" onClick={onOpen} data-cursor={labels?.open} data-tilt="1.4">
        <span className="rl-phone">
          <span className="rl-screen">
            <MediaAsset src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
            <span className="rl-scan" aria-hidden="true" />
          </span>
          <span className="rl-hud rl-hud--top font-mono" aria-hidden="true">
            <span className="rl-rec" />
            REEL {pad(index + 1)}
            {item.duration ? <span className="rl-dur">{item.duration}</span> : null}
          </span>
          <span className="rl-hud rl-hud--bottom font-mono" aria-hidden="true">
            {item.client}
          </span>
          <span className="rl-play" aria-hidden="true">
            ▶
          </span>
        </span>
        <span className="rl-caption">
          <span className="rl-title font-poster">{item.title}</span>
          <span className="rl-type font-mono">{item.subtitle}</span>
        </span>
      </button>
    </article>
  );
}

/**
 * Riel de reels del home: scroll horizontal con snap. En desktop hay
 * flechas, porque el scroll lateral con trackpad no es un gesto que se pueda
 * dar por sabido; en táctil alcanza con deslizar.
 */
export default function ReelsRail({ items, labels, onOpen }) {
  const pista = useRef(null);
  if (!items?.length) return null;

  const mover = (dir) => {
    const el = pista.current;
    if (!el) return;
    const card = el.querySelector(".rl-card");
    const paso = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * paso * 2, behavior: "smooth" });
  };

  return (
    <div className="rl">
      <div className="rl-track" ref={pista}>
        {items.map((item, i) => (
          <ReelCard key={`${item.title}-${i}`} item={item} index={i} labels={labels} onOpen={() => onOpen(i)} />
        ))}
      </div>
      <div className="rl-nav">
        <p className="rl-hint font-mono">{labels?.hint}</p>
        <div className="rl-arrows">
          <button type="button" className="rl-arrow" onClick={() => mover(-1)} aria-label={labels?.previous}>
            ←
          </button>
          <button type="button" className="rl-arrow" onClick={() => mover(1)} aria-label={labels?.next}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
