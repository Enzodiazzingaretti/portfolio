import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRutas from "./AppRutas.jsx";
import "./index.css";
// La capa «vidrio ahumado» va después: pisa lo que haga falta de index.css.
import "./styles/vidrio.css";
import "./styles/paletas.css";
import { iniciarPaleta } from "./paletas";
import { sinGpu } from "./sinGpu";
import { iniciarPulso } from "./pulso";
import { prefijoDe } from "./idiomaRuta";


// La paleta guardada (o la de un link con ?paleta=) antes del primer render
iniciarPaleta();
if (sinGpu()) document.documentElement.classList.add("sin-gpu");
iniciarPulso();

// /en/… y /pt/…: el prefijo es la base del router, así todos los links lo
// conservan
const prefijo = prefijoDe(window.location.pathname);

// La página llegó pregenerada (scripts/prerender.mjs): React la reemplaza por
// la misma, y las entradas animadas ya corrieron en la versión estática, así
// que en este primer montaje saltan a su final (html.pre-montado).
const raiz = document.getElementById("root");
if (raiz.firstElementChild) document.documentElement.classList.add("pre-montado");

ReactDOM.createRoot(raiz).render(
  <StrictMode>
    <BrowserRouter basename={prefijo ? `/${prefijo}` : undefined}>
      <AppRutas />
    </BrowserRouter>
  </StrictMode>,
);
