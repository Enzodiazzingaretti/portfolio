import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaAsset from "./MediaAsset";
import { useInView } from "../fx/useInView";
import { isConvertible, isVideoAsset, toWebpSrc } from "../utils/helpers";
import { formatoPropio } from "../salaPlan";

function fotograma(src) {
  if (!src) return null;
  if (!isVideoAsset(src)) return src;
  return /\/images\/loops\//i.test(src) ? src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg") : null;
}

// Mismas condiciones que en el CSS: donde no hay hover (o la ventana es
// angosta) la tira se ve siempre; sin hover, además, manda el foco.
const CON_TIRA = "(hover: none), (max-width: 1023px)";
const SIN_HOVER = "(hover: none)";

function coincide(query) {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.(query).matches);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// Los posters de /images/loops/ son .jpg sin hermano .webp: pedidos como
// .webp (lo que haría MediaAsset) darían 404.
function srcDeFotograma(src) {
  if (/-poster\.jpg$/i.test(src)) return src;
  return isConvertible(src) ? toWebpSrc(src) : src;
}

/**
 * Un fotograma de la tira: la imagen en su formato y su rótulo debajo. Sin
 * `loading="lazy"`: la fila ya está en pantalla cuando se monta, y con lazy
 * cada fotograma bajaba recién al entrar a la tira, en blanco.
 */
function Fotograma({ cuadro, num, montar }) {
  return (
    <span className="ix-frame" style={{ "--a": cuadro.formato.replace("/", " / ") }}>
      <span className="ix-frame-img visor">{montar ? <img src={srcDeFotograma(cuadro.src)} alt="" decoding="async" /> : null}</span>
      <span className="ix-frame-cap font-mono">
        <b>{pad(num)}</b> {cuadro.title}
      </span>
    </span>
  );
}

/**
 * El índice: una fila por disciplina, cada una la entrada a su ruta.
 *
 * Con mouse, el título en contorno se llena al pasar y una tarjeta con la
 * obra sigue al cursor. Sin hover (celular, tablet) cada fila lleva una tira
 * de fotogramas grandes, cada uno en su formato, que corre de costado: las
 * filas alternan el sentido y el scroll las empuja (donde el navegador tiene
 * `animation-timeline`). La fila que pasa por el medio de la pantalla hace de
 * hover: se llena el título, se enciende y su tira corre; las otras quedan
 * quietas y en penumbra.
 *
 * Las miniaturas no se montan hasta que hacen falta: estaban en opacity 0
 * pero bajaban igual (~2,3 MB en cada visita al home). Se montan al primer
 * hover o, donde la tira se ve, cuando la fila está a 700 px de entrar, y
 * quedan montadas.
 */
function Row({ category, labels, index, foco }) {
  const [hovered, setHovered] = useState(false);
  const [enFoco, setEnFoco] = useState(false);
  const [montar, setMontar] = useState(false);
  const [cerca, setCerca] = useState(false);
  const [ref, inView] = useInView({ rootMargin: "0px 0px -10% 0px" });
  const visibles = montar || cerca;

  // Donde la tira se ve, sus fotogramas se montan un poco antes de que la
  // fila llegue (700 px), así ya bajaron cuando aparece.
  useEffect(() => {
    const el = ref.current;
    if (!el || !coincide(CON_TIRA) || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCerca(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px 700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  // Sin hover, el «hover» es pasar por el medio de la pantalla: una franja
  // de un 2 % en el centro, así hay una sola fila encendida a la vez (con
  // una más ancha, en el cambio quedaban dos).
  useEffect(() => {
    const el = ref.current;
    if (!foco || !el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => setEnFoco(entry.isIntersecting), {
      rootMargin: "-49% 0px -49% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [foco, ref]);

  // Imágenes fijas: con la pista repetida para el loop serían decenas de
  // videos decodificando a la vez por fila. De un loop se toma su poster
  // (vertical, 9:16); un video sin poster queda afuera. El resto conserva
  // su formato, como en la sala.
  const tira = category.groups
    .flatMap((group) => group.items)
    .map((item) => {
      const src = fotograma(item.thumbnail);
      if (!src) return null;
      const formato = /-poster\.jpg$/i.test(src) ? "9/16" : formatoPropio(item);
      return { src, title: item.title, formato };
    })
    .filter(Boolean)
    .slice(0, 8);

  // La pista corre entre un tercio y dos tercios de su largo, así siempre hay
  // obra a los dos lados aunque el scroll la corra. Con pocas piezas se
  // repiten hasta llenar el ancho.
  const vueltas = tira.length ? Math.ceil(6 / tira.length) : 0;
  const tanda = Array.from({ length: vueltas }, () => tira).flat();
  const pista = [...tanda, ...tanda, ...tanda];
  // Cada fotograma mide su formato por el alto de la tira (más el margen):
  // con ~9 s por alto de tira, todas corren a la misma velocidad (~33 px/s
  // en un celular de 390).
  const largo = tanda.reduce((suma, c) => {
    const [w, h] = c.formato.split("/").map(Number);
    return suma + w / h + 0.05;
  }, 0);

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

  const encendida = hovered || enFoco;

  return (
    <Link
      ref={ref}
      to={`/${category.slug}`}
      className={`ix-row${encendida ? " is-hovered" : ""}${inView ? " is-in" : ""}`}
      style={{ "--row": index, "--ix-dur": `${Math.round(largo * 9)}s` }}
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
          {pad(category.count)} {category.count === 1 ? labels?.singular : labels?.plural}
        </span>
        <span className="ix-arrow" aria-hidden="true">
          →
        </span>
      </span>

      {tira.length ? (
        <span className="ix-float" aria-hidden="true">
          {tira.slice(0, 3).map(({ src }, i) => (
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
          <span className="ix-strip-scroll">
            <span className="ix-strip-track">
              {pista.map((cuadro, i) => (
                <Fotograma key={`${cuadro.src}-${i}`} cuadro={cuadro} num={(i % tira.length) + 1} montar={visibles} />
              ))}
            </span>
          </span>
        </span>
      ) : null}
    </Link>
  );
}

export default function CategoryIndex({ categories, labels }) {
  const foco = coincide(SIN_HOVER);
  return (
    <nav className={`ix${foco ? " ix--foco" : ""}`} aria-label={labels?.index ?? "Índice"}>
      {categories.map((category, i) => (
        <Row key={category.id} category={category} labels={labels} index={i} foco={foco} />
      ))}
    </nav>
  );
}
