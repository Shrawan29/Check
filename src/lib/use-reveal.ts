"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal: returns a ref and whether the element has entered the viewport.
 * Pair with the `.reveal` / `.is-in` classes in globals.css.
 */
export function useReveal<T extends Element>(threshold = 0.05) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, shown] as const;
}
