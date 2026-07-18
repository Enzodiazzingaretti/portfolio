import BrowserFrame from "./BrowserFrame";

/**
 * SelectedWorkCard - Tarjeta de proyecto destacado con preview
 * @param {Object} props
 * @param {Object} props.project - Datos del proyecto (title, description, tags, etc.)
 * @param {number} props.index - Índice para alternar layout
 * @param {Function} props.onOpen - Callback al abrir el modal
 * @param {Object} props.labels - Labels traducidos (viewCase, visitSite)
 */
export default function SelectedWorkCard({ project, index, onOpen, labels }) {
  const imageOrder = index % 2 === 0 ? "" : "md:order-2";
  const textOrder  = index % 2 === 0 ? "" : "md:order-1";
  return (
    <article className="case-study group reveal-on-scroll grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
      <button type="button" onClick={onOpen} className={`${imageOrder} block text-left`}>
        <BrowserFrame
          src={project.thumbnail}
          title={project.title}
          scrollPreview={project.title.toLowerCase().includes("press kit") || project.title.toLowerCase().includes("web v1")}
        />
      </button>
      <div className={`${textOrder} flex flex-col justify-end pb-1`}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-caption uppercase tracking-[0.32em] text-raveRed/80">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-white/15" />
          <span className="font-mono text-caption uppercase tracking-[0.24em] text-white/70">{project.year}</span>
          <span className="font-mono text-caption uppercase tracking-[0.24em] text-white/70">{project.subtitle}</span>
        </div>
        <button type="button" onClick={onOpen} className="text-left">
          <h3 className="font-display text-[clamp(3rem,6.5vw,7rem)] font-bold uppercase leading-[0.78] tracking-[-0.06em] text-paper transition group-hover:text-white">{project.title}</h3>
        </button>
        <p className="mt-7 max-w-md text-sm leading-relaxed text-dim">{project.description}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-white/20 px-2.5 py-1 font-mono text-label uppercase tracking-[0.18em] text-white/72">{tag}</span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.previewUrl && !project.previewUrl.startsWith("#") ? (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="premium-button premium-button-accent px-5 py-3 font-mono text-caption uppercase tracking-[0.24em]"
            >
              {labels.visitSite} ↗
            </a>
          ) : null}
          <button
            type="button"
            onClick={onOpen}
            className="premium-button px-5 py-3 font-mono text-caption uppercase tracking-[0.24em]"
          >
            {labels.viewCase}
          </button>
        </div>
      </div>
    </article>
  );
}
