"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./philosophy.module.css";

/** One reversible local timeline coordinates the complete editorial stage. */
export function PhilosophyStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    let disposed = false;
    let generation = 0;
    let revert: (() => void) | undefined;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const layout = matchMedia("(min-width: 901px)");
    const setup = async () => {
      const current = ++generation;
      revert?.();
      revert = undefined;
      host.dataset.enhanced = "false";
      host.removeAttribute("data-active");
      if (disposed || motion.matches) return;
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed || motion.matches || current !== generation) return;
        gsap.registerPlugin(ScrollTrigger);
        const layers = host.querySelectorAll<HTMLElement>(
          "[data-philosophy-layer]",
        );
        const names = host.querySelectorAll<HTMLElement>(
          "[data-philosophy-name]",
        );
        const chapters = host.querySelectorAll<HTMLElement>(
          "[data-philosophy-chapter]",
        );
        const progress = host.querySelector<HTMLElement>(
          "[data-philosophy-progress]",
        );
        const context = gsap.context(() => {
          gsap.set(layers, { opacity: 0, y: 14 });
          gsap.set(layers[0], { opacity: 1, y: 0 });
          gsap.set(names, { opacity: 0.75 });
          gsap.set(names[0], { opacity: 1 });
          gsap.set(chapters, { opacity: 0.82 });
          gsap.set(chapters[0], { opacity: 1 });
          const desktop = layout.matches;
          // Photo plates crossfade in the same timeline as the preserved index.
          // Below 900px the visible panels remain in the natural article flow.
          const photos = host.querySelectorAll<HTMLElement>(
            "[data-philosophy-layer] picture",
          );
          if (desktop && photos.length)
            gsap.set(photos, {
              scale: desktop ? 1.015 : 1,
              transformOrigin: "center",
            });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: host,
              start: "top center",
              end: "bottom center",
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const active = String(
                  Math.min(2, Math.floor(self.progress * 3)) + 1,
                );
                if (host.dataset.active !== active)
                  host.dataset.active = active;
              },
            },
          });
          if (desktop)
            photos.forEach((photo) => {
              const index = Array.from(layers).findIndex((layer) =>
                layer.contains(photo),
              );
              timeline.to(
                photo,
                { scale: 1, duration: 1, ease: "none" },
                index,
              );
            });
          if (!desktop)
            host
              .querySelectorAll<HTMLElement>("[data-philosophy-static-scene]")
              .forEach((panel) => {
                const photo = panel.querySelector("picture");
                if (!photo) return;
                gsap.fromTo(
                  photo,
                  { opacity: 0.82, y: 8 },
                  {
                    opacity: 1,
                    y: 0,
                    ease: "none",
                    scrollTrigger: {
                      trigger: panel,
                      start: "top 92%",
                      end: "top 55%",
                      scrub: 0.45,
                    },
                  },
                );
              });
          timeline.fromTo(
            progress,
            { scaleX: 0 },
            { scaleX: 1, duration: 3, ease: "none" },
            0,
          );
          for (let index = 1; index < 3; index++) {
            const at = index - 0.2;
            timeline
              .to(
                layers[index - 1],
                { opacity: 0, y: -14, duration: 0.4, ease: "none" },
                at,
              )
              .to(
                layers[index],
                { opacity: 1, y: 0, duration: 0.4, ease: "none" },
                at,
              )
              .to(
                names[index - 1],
                { opacity: 0.75, duration: 0.4, ease: "none" },
                at,
              )
              .to(names[index], { opacity: 1, duration: 0.4, ease: "none" }, at)
              .to(
                chapters[index - 1],
                { opacity: 0.82, duration: 0.4, ease: "none" },
                at,
              )
              .to(
                chapters[index],
                { opacity: 1, duration: 0.4, ease: "none" },
                at,
              );
          }
        }, host);
        host.dataset.active ||= "1";
        host.dataset.enhanced = "true";
        revert = () => context.revert();
      } catch {
        // The static chapter range and all copy remain visible on chunk failure.
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void setup();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(host);
    motion.addEventListener("change", setup);
    layout.addEventListener("change", setup);
    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      motion.removeEventListener("change", setup);
      layout.removeEventListener("change", setup);
      revert?.();
    };
  }, []);
  return (
    <div
      className={styles.story}
      ref={root}
      data-philosophy-story
      data-enhanced="false"
    >
      {children}
    </div>
  );
}
