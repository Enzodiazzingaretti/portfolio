import { useState } from "react";
import { Link } from "react-router-dom";
import MediaAsset from "./MediaAsset";

/**
 * El índice: reemplaza las 9 secciones apiladas por 4 filas.
 * Cada fila es la entrada a una ruta. En desktop, el hover muestra un
 * avance de la obra que hay adentro sin salir del home.
 */
export default function CategoryIndex({ categories, labels }) {
  const [hovered, setHovered] = useState(null);

  return (
    <nav className="cat-index" aria-label={labels?.index ?? "Índice"}>
      {categories.map((category) => {
        const isHovered = hovered === category.id;
        const peek = category.groups
          .flatMap((group) => group.items)
          .map((item) => item.thumbnail)
          .filter(Boolean)
          .slice(0, 3);

        return (
          <Link
            key={category.id}
            to={`/${category.slug}`}
            className={`cat-row${isHovered ? " is-hovered" : ""}`}
            onMouseEnter={() => setHovered(category.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(category.id)}
            onBlur={() => setHovered(null)}
          >
            <span className="cat-row-rule" aria-hidden="true" />

            <span className="cat-row-num font-mono">{category.num}</span>

            <span className="cat-row-main">
              <span className="cat-row-title font-display">{category.title}</span>
              <span className="cat-row-kicker font-mono">{category.kicker}</span>
            </span>

            <span className="cat-row-peek" aria-hidden="true">
              {peek.map((src, i) => (
                <span key={src} className="cat-peek-tile" style={{ "--i": i }}>
                  <MediaAsset src={src} alt="" className="h-full w-full object-cover" />
                </span>
              ))}
            </span>

            <span className="cat-row-meta font-mono">
              <span className="cat-row-count">
                {String(category.count).padStart(2, "0")} {category.count === 1 ? labels?.singular : labels?.plural}
              </span>
              <span className="cat-row-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
