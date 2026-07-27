import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Section({ title, subtitle, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border border-white/10 bg-white/[0.015] overflow-hidden transition-colors hover:border-white/20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
      >
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2.5">
            <span className="block font-display text-lg font-bold uppercase tracking-[0.08em] text-[#EAEAEA] leading-tight">{title}</span>
            {typeof count === "number" && (
              <span className="font-mono text-[10px] text-raveRedBright/80">{count}</span>
            )}
          </span>
          {subtitle && <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mt-1">{subtitle}</span>}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={`shrink-0 text-white/40 group-hover:text-raveRedBright transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-white/10">{children}</div>}
    </section>
  );
}
