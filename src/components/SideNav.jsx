import { useState, useEffect, useMemo } from "react";

export default function SideNav({ nav }) {
  const [active, setActive] = useState("");

  const items = useMemo(() => nav.filter((i) => !i.external && i.href.startsWith("#")), [nav]);

  useEffect(() => {
    const ids = items.map((i) => i.href.slice(1));
    const observers = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav
      aria-label="Navegación lateral"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
    >
      {items.map((item) => {
        const id = item.href.slice(1);
        const isActive = active === id;
        return (
          <a
            key={item.href}
            href={item.href}
            className="group flex items-center gap-2"
            aria-label={item.label}
          >
            <span
              className={`font-mono text-[8px] uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive ? "opacity-60 text-white" : "opacity-0 text-white/40 group-hover:opacity-50"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-[6px] w-[6px] bg-raveRed"
                  : "h-[4px] w-[4px] bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
