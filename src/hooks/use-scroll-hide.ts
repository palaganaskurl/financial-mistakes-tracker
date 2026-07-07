import { useState, useEffect, useRef, type RefObject } from "react";

export function useScrollHide(
  scrollRef: RefObject<HTMLElement | null>,
  threshold = 48,
): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentY = el.scrollTop;
          const scrollingDown = currentY > lastScrollY.current;

          if (scrollingDown && currentY > threshold) {
            setVisible(false);
          } else if (!scrollingDown) {
            setVisible(true);
          }

          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef, threshold]);

  return visible;
}
