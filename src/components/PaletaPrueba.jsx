import { useState } from "react";

// Las paletas de paletas.css, para comparar en el sitio real. Solo se ve si se
// entró con `?paleta=` (lo guarda main.jsx en la sesión); no lo ven los
// visitantes.
const PALETAS = [
  { id: "grafito", nombre: "Grafito", muestra: "#E52436" },
  { id: "brasa", nombre: "Brasa", muestra: "#FF5C1F" },
  { id: "cobalto", nombre: "Cobalto", muestra: "#3D63FF" },
  { id: "ultravioleta", nombre: "Ultravioleta", muestra: "#8B5CFF" },
  { id: "hueso", nombre: "Hueso", muestra: "#D6D0C4" },
];

function leer(clave) {
  try {
    return sessionStorage.getItem(clave);
  } catch {
    return null;
  }
}

export default function PaletaPrueba() {
  const [activa, setActiva] = useState(() => document.documentElement.dataset.paleta || "grafito");
  if (leer("paleta-prueba") !== "1") return null;

  const elegir = (id) => {
    setActiva(id);
    if (id === "grafito") delete document.documentElement.dataset.paleta;
    else document.documentElement.dataset.paleta = id;
    try {
      if (id === "grafito") sessionStorage.removeItem("paleta");
      else sessionStorage.setItem("paleta", id);
    } catch {
      /* sin sessionStorage: dura hasta recargar */
    }
  };

  return (
    <div className="paleta-prueba font-mono" role="group" aria-label="Paleta de prueba">
      {PALETAS.map((p) => (
        <button key={p.id} type="button" aria-pressed={activa === p.id} onClick={() => elegir(p.id)}>
          <i style={{ background: p.muestra }} aria-hidden="true" />
          {p.nombre}
        </button>
      ))}
    </div>
  );
}
