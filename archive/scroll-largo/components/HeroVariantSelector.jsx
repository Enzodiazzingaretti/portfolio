export default function HeroVariantSelector({ variants, activeId, labels, onSelect }) {
  const activeLabel = labels?.items?.[activeId] ?? activeId;

  return (
    <div className="pointer-events-auto flex items-center gap-3">
      <div className="flex items-center" role="radiogroup" aria-label={labels?.ariaLabel ?? "Hero background"}>
        {variants.map((variant) => {
          const label = labels?.items?.[variant.id] ?? variant.id;
          const selected = variant.id === activeId;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              title={label}
              onClick={() => onSelect(variant.id)}
              className="group flex h-11 w-8 items-center justify-center"
            >
              <span
                className={`block h-2.5 w-2.5 border transition ${
                  selected
                    ? "border-raveRed bg-raveRed shadow-[0_0_18px_rgba(177,18,18,0.7)]"
                    : "border-white/25 bg-white/5 group-hover:border-white/60 group-hover:bg-white/20"
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="font-mono text-label uppercase tracking-[0.28em] text-white/40 transition-colors duration-500">
        {activeLabel}
      </span>
    </div>
  );
}
