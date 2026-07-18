import { useEffect, useRef } from "react";
import { isVideoAsset } from "../utils/helpers";

function LazyVideo({ src, className, controls }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.paused) el.play().catch(() => {});
        } else {
          if (!el.paused) el.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      controls={controls}
    />
  );
}

function toWebpSrc(src) {
  // encodeURI: srcset trata el espacio como separador URL/descriptor,
  // sin escapar rompe rutas como "logo_chica_lunar (3).webp"
  return encodeURI(src.replace(/\.(png|jpe?g)(\?.*)?$/i, ".webp"));
}

function isConvertible(src) {
  return /\.(png|jpe?g)(\?.*)?$/i.test(src ?? "");
}

export default function MediaAsset({ src, alt, className = "h-full w-full object-cover", controls = false, eager = false }) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center bg-surface`}>
        {alt && <span className="font-mono text-caption uppercase tracking-[0.2em] text-white/20">{alt}</span>}
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
