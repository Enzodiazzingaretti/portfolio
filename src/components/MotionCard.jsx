import MediaAsset from "./MediaAsset";

export default function MotionCard({ loop, index, onOpen, loopLabel }) {
  const featured = index === 0 ? "md:col-span-2" : "";
  return (
    <article className={`motion-card group reveal-on-scroll ${featured}`}>
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="media-lift relative aspect-video overflow-hidden bg-surface">
          <MediaAsset src={loop.thumbnail} alt={loop.title} className="h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.05] group-hover:opacity-100" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(139,0,0,0.22),transparent_45%),linear-gradient(to_top,rgba(0,0,0,0.62),transparent_50%)]" />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-raveRed" />
            <span className="font-mono text-label uppercase tracking-[0.28em] text-white/80">{loopLabel} {String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-3xl font-bold uppercase leading-none tracking-[-0.03em]">{loop.title}</h3>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/88">{loop.description}</p>
          </div>
        </div>
      </button>
    </article>
  );
}
