import MediaAsset from "./MediaAsset";

export default function RenderRow({ work, index, onOpen }) {
  const reverse = index % 2 === 1;
  const mediaAspect = work.portrait ? "aspect-[9/16] max-w-sm mx-auto" : work.square ? "aspect-square" : "aspect-[16/10]";
  const mediaFit = (work.portrait || work.square) ? "object-contain" : "object-cover transition duration-700 group-hover:scale-[1.04]";
  return (
    <article className={`render-row scroll-focus-item group reveal-on-scroll grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end ${reverse ? "md:grid-cols-[1.25fr_0.75fr]" : ""}`}>
      <div className={reverse ? "md:order-2" : ""}>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-raveRed">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-4 font-display text-[clamp(2.8rem,5vw,5.8rem)] font-bold uppercase leading-[0.8] tracking-[-0.055em] text-[#EAEAEA]">{work.title}</h3>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#C8C8C8]">{work.description}</p>
      </div>
      <button type="button" onClick={onOpen} className={`${reverse ? "md:order-1" : ""} block text-left`}>
        <div className={`premium-media ${mediaAspect} overflow-hidden bg-[#0A0A0A]`}>
          <MediaAsset src={work.thumbnail} alt={work.title} className={`h-full w-full ${mediaFit}`} />
        </div>
      </button>
    </article>
  );
}
