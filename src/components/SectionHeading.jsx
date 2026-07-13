import CellularDivider from "./CellularDivider";

export default function SectionHeading({ index, title, subtitle, action }) {
  const num = index?.split("/")[0]?.trim().replace(/\s/g, "") ?? "";
  const seed = (parseInt(num, 10) || 1) * 1337;
  return (
    <div className="fluid-section-head reveal-on-scroll">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="grid gap-5 md:grid-cols-[110px_1fr] md:items-start">
          <div className="flex items-start gap-3 md:flex-col md:gap-2">
            <span className="font-display text-[clamp(2.2rem,4vw,3.8rem)] font-bold leading-none tracking-[-0.04em] text-raveRed" aria-hidden>
              {num}
            </span>
            <span className="mt-2 h-px w-8 bg-raveRed/50 md:mt-1" aria-hidden />
          </div>
          <div>
            <h2 className="glitch-hover font-display text-[clamp(3.4rem,9vw,8.5rem)] font-bold uppercase leading-[0.78] tracking-[-0.05em] text-[#EAEAEA]" data-text={title}>
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-5 max-w-xl border-l-2 border-raveRed/60 pl-4 text-[0.875rem] leading-relaxed text-[#D6D6D6] md:text-[0.95rem]">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="shrink-0 self-start border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 transition hover:border-raveRed/50 hover:text-white md:self-end"
          >
            {action.label}
          </button>
        ) : null}
      </div>
      <CellularDivider seed={seed} />
    </div>
  );
}
