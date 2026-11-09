import { useEffect, useState } from "react";
import { activarSonido, alCambiarSonido, sonidoActivo } from "../sonido";

/** El interruptor del sonido de la interfaz, en la barra (apagado por defecto) */
export default function SonidoToggle({ labels }) {
  const [activo, setActivo] = useState(sonidoActivo);
  useEffect(() => alCambiarSonido(setActivo), []);
  const etiqueta = activo ? (labels?.on ?? "Sound on") : (labels?.off ?? "Sound off");
  return (
    <button
      type="button"
      className={`sonido-btn${activo ? " is-on" : ""}`}
      aria-pressed={activo}
      aria-label={etiqueta}
      title={etiqueta}
      onClick={() => activarSonido(!activo)}
    >
      {/* Cuatro barras de ecualizador: quietas apagado, latiendo prendido */}
      <span className="sonido-barras" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
