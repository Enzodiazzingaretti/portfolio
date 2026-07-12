import { useEffect } from "react";

export function useScrollFocus(selector = ".scroll-focus-item") {
  useEffect(() => {
    const items = () => Array.from(document.querySelectorAll(selector));

    const update = () => {
      const nodes = items();
      if (!nodes.length) return;

      const viewportMid = window.innerHeight / 2;
      let closest = null;
      let closestDist = Infinity;

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const nodeMid = rect.top + rect.height / 2;
        const dist = Math.abs(nodeMid - viewportMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = node;
        }
      });

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;
        if (node === closest && inView) {
          node.classList.add("is-focused");
          node.classList.remove("is-unfocused");
        } else if (inView) {
          node.classList.remove("is-focused");
          node.classList.add("is-unfocused");
        } else {
          node.classList.remove("is-focused", "is-unfocused");
        }
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [selector]);
}
