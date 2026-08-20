import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MediaAsset from "./MediaAsset";
import GenerativeCanvas from "./GenerativeCanvas";
import LoopAudioButton from "./LoopAudioButton";
import createEnjambre from "../lab/pieces/enjambre";
import { loopAudio } from "../audio/loopAudio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Se importa la pieza suelta y no el registro `LAB_PIECES`: ese índice importa
 * los cinco algoritmos, así que traerlo acá metía los otros cuatro en el
 * bundle del home —16 kB que nadie ejecuta hasta entrar a /motion—.
 *
 * Los valores replican la entrada `enjambre` de `src/lab/pieces/index.js`, a
 * propósito: tienen que ser los mismos para que la obra del showcase sea
 * idéntica a la que se ve después en la categoría.
 */
const ENJAMBRE = { create: createEnjambre, seed: 1312, w: 800, h: 600 };

function CardMedia({ item, reduced }) {
  if (!item.generative) {
    return <MediaAsset src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />;
  }

  return (
    <GenerativeCanvas
      createPiece={ENJAMBRE.create}
      seed={ENJAMBRE.seed}
      width={ENJAMBRE.w}
      height={ENJAMBRE.h}
      staticMode={reduced}
    />
  );
}

/**
 * Carrusel de obra destacada del home.
 *
 * Scroll-snap nativo: en mobile el swipe ya funciona sin una sola línea de JS,
 * y las flechas de desktop existen porque el scroll horizontal con trackpad no
 * es un gesto que se pueda dar por sabido.
 */
export default function ShowcaseCarousel({ items, labels }) {
  const reduced = usePrefersReducedMotion();
  const pistaRef = useRef(null);
  const [limite, setLimite] = useState({ inicio: true, fin: false });

  const medir = useCallback(() => {
    const el = pistaRef.current;
    if (!el) return;
    const primera = el.firstElementChild;
    if (!primera) return;

    // El principio no se detecta con `scrollLeft <= 0`: la pista sangra con
    // padding lateral y el scroll-snap la deja descansando en ese padding, así
    // que el mínimo real nunca es 0 y la flecha izquierda no se apagaba nunca.
    // Comparar los bordes no depende de cuánto valga ese padding.
    const caja = el.getBoundingClientRect();
    const inicio = primera.getBoundingClientRect().left >= caja.left - 2;

    // Para el final sí sirve la cuenta de scroll: por el padding de la derecha,
    // comparar bordes apagaría la flecha unos píxeles antes de llegar.
    const max = el.scrollWidth - el.clientWidth;
    const fin = max <= 2 || el.scrollLeft >= max - 2;

    // Mismo objeto si nada cambió: si no, cada evento de scroll re-renderiza.
    setLimite((actual) => (actual.inicio === inicio && actual.fin === fin ? actual : { inicio, fin }));
  }, []);

  useEffect(() => {
    const el = pistaRef.current;
    if (!el) return undefined;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [medir, items.length]);

  const desplazar = (direccion) => {
    const el = pistaRef.current;
    if (!el) return;
    const card = el.querySelector(".showcase-card");
    const paso = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direccion * paso, behavior: reduced ? "auto" : "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className="showcase">
      <div className="showcase-track" ref={pistaRef}>
        {items.map((item) => (
          <article
            key={item.id}
            className="showcase-card"
            // El hover va en el <article> y no en el <Link>: el parlante es
            // hermano del link y queda encima, así que colgarlo del link
            // dispararía un mouseleave al pasar por el botón.
            onMouseEnter={() => loopAudio.alEntrar(item.audio)}
            onMouseLeave={() => loopAudio.alSalir(item.audio)}
          >
            <Link to={item.href} className="showcase-card-link">
              <span className="showcase-card-media">
                <CardMedia item={item} reduced={reduced} />
                <span className="showcase-card-veil" aria-hidden="true" />
              </span>

              <span className="showcase-card-body">
                <span className="showcase-card-tag font-mono">{item.tag}</span>
                <span className="showcase-card-title font-display">{item.title}</span>
                {item.description ? <span className="showcase-card-desc">{item.description}</span> : null}
              </span>
            </Link>

            {item.audio ? <LoopAudioButton src={item.audio} labels={labels?.audio} /> : null}
          </article>
        ))}
      </div>

      <div className="showcase-nav">
        <button
          type="button"
          className="showcase-arrow"
          onClick={() => desplazar(-1)}
          disabled={limite.inicio}
          aria-label={labels?.previous}
        >
          ←
        </button>
        <button
          type="button"
          className="showcase-arrow"
          onClick={() => desplazar(1)}
          disabled={limite.fin}
          aria-label={labels?.next}
        >
          →
        </button>
      </div>
    </div>
  );
}
