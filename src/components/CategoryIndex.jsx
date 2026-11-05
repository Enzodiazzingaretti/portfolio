import { useState } from "react";
import { Link } from "react-router-dom";
import MediaAsset from "./MediaAsset";
import { useInView } from "../fx/useInView";
import { isVideoAsset } from "../utils/helpers";

function fotograma(src) {
  if (!src) return null;
  if (!isVideoAsset(src)) return src;
  return /\/images\/loops\//i.test(src) ? src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg") : null;
}

/**
 * El índice: una fila por disciplina, cada una la entrada a su ruta.
 *
 * Al pasar el mouse, el título se encierra con un círculo a mano y abajo
 * corre una tira de película con la obra de adentro. En táctil no hay hover,
 * así que la tira se ve siempre (quieta) apenas la fila entra en pantalla.
 *
 * Las miniaturas no se montan hasta que hacen falta: estaban en opacity 0
 * pero bajaban igual (~2,3 MB en cada visita al home). Se montan al primer
 * hover o cuando la fila entra en pantalla en un dispositivo táctil, y
 * quedan montadas.
 */
function Row({ category, labels, index }) {
  const [hovered, setHovered] = useState(false);
  const [montar, setMontar] = useState(false);
  const [ref, inView] = useInView({ rootMargin: "0px 0px -10% 0px" });
  const tactil = typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches;
  const visibles = montar || (tactil && inView);

  // La tira usa imágenes fijas: con la pista duplicada para el loop serían
  // dieciséis videos decodificando a la vez por fila. De un loop se toma su
  // poster; un video sin poster queda afuera.
  const tira = category.groups
    .flatMap((group) => group.items)
    .map((item) => fotograma(item.thumbnail))
    .filter(Boolean)
    .slice(0, 8);

  // La tarjeta flotante sigue al cursor dentro de la fila (solo desktop).
  const seguir = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--py", `${e.clientY - r.top}px`);
  };

  const apuntar = () => {
    setHovered(true);
    setMontar(true);
  };

  return (
    <Link
      ref={ref}
      to={`/${category.slug}`}
      className={`ix-row${hovered ? " is-hovered" : ""}${inView ? " is-in" : ""}`}
      style={{ "--row": index }}
      data-cursor={labels?.enter}
      onMouseEnter={apuntar}
      onMouseMove={seguir}
      onMouseLeave={() => setHovered(false)}
      onFocus={apuntar}
      onBlur={() => setHovered(false)}
    >
      <span className="ix-num font-mono" aria-hidden="true">
        {category.num}
      </span>

      <span className="ix-main">
        <span className="ix-title font-poster">
          <span className="ix-title-text" data-text={category.title}>
            {category.title}
          </span>
        </span>
        <span className="ix-kicker font-mono">{category.kicker}</span>
      </span>

      <span className="ix-meta font-mono">
        <span className="ix-count">
          {String(category.count).padStart(2, "0")} {category.count === 1 ? labels?.singular : labels?.plural}
        </span>
        <span className="ix-arrow" aria-hidden="true">
          →
        </span>
      </span>

      {tira.length ? (
        <span className="ix-float" aria-hidden="true">
          {tira.slice(0, 3).map((src, i) => (
            <span key={src} className="ix-float-card" style={{ "--c": i }}>
              {montar ? (
                /-poster\.jpg$/i.test(src) ? (
                  <img src={src} alt="" loading="lazy" decoding="async" />
                ) : (
                  <MediaAsset src={src} alt="" className="h-full w-full object-cover" />
                )
              ) : null}
            </span>
          ))}
        </span>
      ) : null}

      {tira.length ? (
        <span className="ix-strip" aria-hidden="true">
          <span className="ix-strip-track">
            {[...tira, ...tira].map((src, i) => (
              <span key={`${src}-${i}`} className="ix-frame">
                {visibles ? (
                  // Los posters de /images/loops/ son .jpg sin hermano .webp:
                  // MediaAsset los pediría como .webp y darían 404.
                  /-poster\.jpg$/i.test(src) ? (
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <MediaAsset src={src} alt="" className="h-full w-full object-cover" />
                  )
                ) : null}
                <span className="ix-frame-num font-mono">{String((i % tira.length) + 1).padStart(2, "0")}</span>
              </span>
            ))}
          </span>
        </span>
      ) : null}
    </Link>
  );
}

export default function CategoryIndex({ categories, labels }) {
  return (
    <nav className="ix" aria-label={labels?.index ?? "Índice"}>
      {categories.map((category, i) => (
        <Row key={category.id} category={category} labels={labels} index={i} />
      ))}
    </nav>
  );
}
