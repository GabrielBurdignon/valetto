"use client";

import { useEffect, useRef } from "react";

type Controller = (host: HTMLDivElement) => (() => void) | undefined;
type Loader = () => Promise<Controller>;

/** Keep the server HTML; download controller code only as its section approaches. */
export function useProgressiveController(load: Loader, rootMargin: string) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let near = false;
    let started = false;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const activate = () => {
      if (!near || started || disposed || motion.matches) return;
      started = true;
      void load()
        .then((mount) => {
          if (!disposed) cleanup = mount(host);
        })
        .catch(() => {
          // The visible, server-rendered composition is the failure fallback.
        });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          near = true;
          observer.disconnect();
          activate();
        }
      },
      { rootMargin },
    );
    observer.observe(host);
    motion.addEventListener("change", activate);
    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener("change", activate);
      cleanup?.();
    };
  }, [load, rootMargin]);
  return root;
}
