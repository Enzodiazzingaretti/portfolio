import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isConvertible, isVideoAsset, toWebpSrc } from "../utils/helpers";
import { videoHQ } from "../media";

/**
 * Las portadas livianas de grilla viven en /images/loops/ y cada una tiene su
 * poster al lado, generados juntos. Fuera de esa carpeta no se asume nada: un
 * poster inexistente seria un 404 por video.
 */
function posterDe(src) {
  if (!/\/images\/loops\//i.test(src)) return undefined;
  return src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg");
}

function LazyVideo({ src: liviano, className, controls }) {
  const ref = useRef(null);
  const enVista = useRef(false);
  // La versión en alta, si la hay (ver src/media.js). Si no carga —el
  // proyecto de medios caído, un archivo que falta—, vuelve a la liviana del
  // repo en vez de dejar el cuadro en negro.
  const [hq, setHq] = useState(() => videoHQ(liviano));
  const src = hq?.src ?? liviano;
  const poster = hq?.poster ?? posterDe(liviano);
  // Con el tamaño real en pantalla se elige el de 720 o el de 1080. Con
  // preload="none" el cambio llega antes de bajar un solo byte del video.
  useLayoutEffect(() => {
    const el = ref.current;
    const r = el?.getBoundingClientRect();
    setHq(videoHQ(liviano, r ? { w: r.width, h: r.height } : undefined));
  }, [liviano]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // El video del modal ocupa la pantalla y no se scrollea: no hay nada que
    // observar. Y el observer ademas lo pausaba —un video sin metadata mide
    // 0x0 y con threshold 0.25 se reporta fuera de vista—, asi que el modal
    // abria siempre en un frame negro. Ahi va `autoPlay` y listo.
    if (controls) return undefined;

    // Con reduced motion el poster alcanza: no se descarga el video.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && poster) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        enVista.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (el.paused) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);

    // Un video sin metadata cargada mide 0x0, y con threshold 0.25 el
    // observer lo da por fuera de vista y no vuelve a disparar. Pasaba en el
    // modal, que abria siempre pausado en un frame negro: ahi el elemento
    // nace ya visible y no hay scroll posterior que lo despierte.
    const alTenerTamaño = () => {
      if (enVista.current && el.paused) el.play().catch(() => {});
    };
    el.addEventListener("loadedmetadata", alTenerTamaño);

    return () => {
      observer.disconnect();
      el.removeEventListener("loadedmetadata", alTenerTamaño);
    };
  }, [src, poster, controls]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      onError={hq ? () => setHq(null) : undefined}
      className={className}
      muted
      loop
      playsInline
      /* Con poster, `none`: no se baja un solo byte del video hasta que el
         tile entra en viewport y el observer llama a play(). Sin poster hace
         falta `metadata`, si no el primer frame no se decodifica y la portada
         queda en negro. */
      preload={poster ? "none" : "metadata"}
      autoPlay={controls}
      controls={controls}
    />
  );
}

export default function MediaAsset({ src, alt, className = "h-full w-full object-cover", controls = false, eager = false }) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center bg-surface`}>
        {alt && <span className="font-mono text-caption uppercase tracking-[0.2em] text-white/46">{alt}</span>}
      </div>
    );
  }
  if (isVideoAsset(src)) {
    return <LazyVideo src={src} className={className} controls={controls} />;
  }
  if (isConvertible(src)) {
    return (
      <img
        src={toWebpSrc(src)}
        alt={alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
      />
    );
  }
  return <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" />;
}
