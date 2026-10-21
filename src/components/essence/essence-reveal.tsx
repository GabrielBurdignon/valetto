"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Native, once-only scroll reveals; HTML stays visible without JavaScript. */
export function EssenceReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = root.current;
    if (
      !host ||
      typeof IntersectionObserver === "undefined" ||
      !("animate" in Element.prototype)
    )
      return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const pendingImages = new Set<() => void>();
    let disposed = false;
    const reveal = (target: Element) => {
      if (disposed || motion.matches || !target.isConnected) return;
      const bounds = target.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
      const animation = target.animate(
        [
          { opacity: 0.65, transform: "translate3d(0, 12px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 1000, easing: "cubic-bezier(.2,.65,.3,1)" },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (motion.matches) continue;
          const target = entry.target;
          const image = target.querySelector("img");
          if (!image) {
            reveal(target);
            continue;
          }
          // Lazy images reveal only after decode, never as an animated empty panel.
          const decode = () => {
            void image
              .decode()
              .then(() => reveal(target))
              .catch(() => {});
          };
          if (image.complete) {
            if (image.naturalWidth > 0) decode();
            continue;
          }
          const cleanup = () => {
            image.removeEventListener("load", onLoad);
            image.removeEventListener("error", cleanup);
            pendingImages.delete(cleanup);
          };
          const onLoad = () => {
            cleanup();
            decode();
          };
          pendingImages.add(cleanup);
          image.addEventListener("load", onLoad, { once: true });
          image.addEventListener("error", cleanup, { once: true });
        }
      },
      { threshold: 0.12 },
    );
    host
      .querySelectorAll("[data-essence-reveal]")
      .forEach((element) => observer.observe(element));
    const onMotion = () => {
      if (motion.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    motion.addEventListener("change", onMotion);
    return () => {
      disposed = true;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      pendingImages.forEach((cleanup) => cleanup());
      motion.removeEventListener("change", onMotion);
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
