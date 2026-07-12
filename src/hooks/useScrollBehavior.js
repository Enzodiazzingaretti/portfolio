import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Hook personalizado para manejar comportamiento de scroll
 * @returns {Object} Estado del scroll y progreso
 * @returns {boolean} scrolled - Si se ha scrolleado más de 40px
 * @returns {boolean} navVisible - Si la navegación debe ser visible
 * @returns {boolean} heroPassed - Si se ha pasado el 60% del viewport
 * @returns {number} scrollProgress - Progreso del scroll (0-1)
 */
export function useScrollBehavior() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [heroPassed, setHeroPassed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const currentY = window.scrollY;
    const progress = Math.min(currentY / max, 1);
    
    setScrollProgress(progress);
    setScrolled(currentY > 40);
    setHeroPassed(currentY > window.innerHeight * 0.6);
    setNavVisible(currentY < 80 || currentY < lastScrollY.current);
    
    lastScrollY.current = currentY;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    // Initial call
    update();
    
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  return { scrolled, navVisible, heroPassed, scrollProgress };
}
