import MediaAsset from "./MediaAsset";

/**
 * BrowserFrame - Marco estilo navegador para previews
 * @param {Object} props
 * @param {string|null} props.src - URL de la imagen/video
 * @param {string} props.title - Título que aparece en la barra
 * @param {boolean} [props.scrollPreview] - Si true, activa animación de scroll
 */
export default function BrowserFrame({ src, title, scrollPreview = false }) {
  const mediaClass = scrollPreview
    ? "preview-scroll h-full w-full object-cover opacity-90 grayscale"
    : "h-full w-full object-cover opacity-90 grayscale transition duration-700 group-hover:scale-[1.045] group-hover:grayscale-0";

  return (
    <div className="premium-media overflow-hidden border border-white/10 bg-ink shadow-2xl shadow-black/50">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-raveRed/70" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="ml-3 truncate font-mono text-label uppercase tracking-[0.2em] text-white/48">{title}</span>
      </div>
      <div className="aspect-video overflow-hidden bg-black">
        <MediaAsset src={src} alt={title} className={mediaClass} />
      </div>
    </div>
  );
}
