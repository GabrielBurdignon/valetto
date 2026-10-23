/** Full-width photographic narrative, progressively loaded without scroll pinning. */
export function mountPhilosophy(host: HTMLDivElement) {
  if (typeof IntersectionObserver === "undefined") return;
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
      // Prime only the approaching desktop stage. Keep the complete static
      // articles until every dissolve has a decoded photograph underneath it.
      if (layout.matches) {
        const images = [
          ...host.querySelectorAll<HTMLImageElement>(
            "[data-philosophy-layer] img",
          ),
        ];
        images.forEach((image) => {
          image.loading = "eager";
        });
        await Promise.all(images.map((image) => image.decode()));
        if (disposed || motion.matches || current !== generation) return;
      }
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
        const desktop = layout.matches;
        const duration = desktop ? 2 : 3;
        const nextPhrase = document.querySelector("#process-title > span");
        if (desktop && nextPhrase)
          gsap.fromTo(
            nextPhrase,
            { x: 28 },
            {
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: host,
                start: "bottom 95%",
                end: "bottom 42%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            },
          );
        gsap.set(layers, { opacity: 0, y: desktop ? 0 : 14 });
        gsap.set(layers[0], { opacity: 1, y: 0 });
        gsap.set(names, { opacity: 0.75 });
        gsap.set(names[0], { opacity: 1 });
        gsap.set(chapters, { opacity: 0.82 });
        gsap.set(chapters[0], { opacity: 1 });
        // Photo plates crossfade in the same timeline as the preserved index.
        // Below 900px the visible panels remain in the natural article flow.
        const photos = host.querySelectorAll<HTMLElement>(
          "[data-philosophy-layer] picture",
        );
        if (desktop && photos.length)
          gsap.set(photos, { scale: 1.075, transformOrigin: "center" });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: desktop ? chapters[0] : host,
            start: desktop ? "center center" : "top center",
            endTrigger: desktop ? chapters[chapters.length - 1] : host,
            end: desktop ? "center center" : "bottom center",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
          // Use the rendered timeline, including scrub, for the active index.
          onUpdate: function () {
            const active = String(
              desktop
                ? Math.min(2, Math.round(this.time())) + 1
                : Math.min(2, Math.floor(this.progress() * 3)) + 1,
            );
            if (host.dataset.active !== active) host.dataset.active = active;
          },
        });
        if (desktop && photos.length) {
          photos.forEach((photo, index) => {
            timeline.fromTo(
              photo,
              { scale: 1.075, yPercent: 1.2 },
              {
                scale: 1.025,
                yPercent: -1,
                duration: index === 1 ? 1.5 : 0.75,
                ease: "none",
              },
              index === 0 ? 0 : index - 0.75,
            );
          });
        }

        if (!desktop)
          host
            .querySelectorAll<HTMLElement>("[data-philosophy-static-scene]")
            .forEach((panel) => {
              const photo = panel.querySelector("picture");
              if (!photo) return;
              gsap.fromTo(
                photo,
                { scale: 1.075, yPercent: 1 },
                {
                  scale: 1.025,
                  yPercent: -1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    start: "top 92%",
                    end: "bottom top",
                    scrub: 0.55,
                  },
                },
              );
            });
        timeline.fromTo(
          progress,
          { scaleX: 0 },
          { scaleX: 1, duration, ease: "none" },
          0,
        );
        for (let index = 1; index < 3; index++) {
          const transition = desktop ? 0.5 : 0.4;
          const at = desktop ? index - 0.75 : index - 0.2;
          if (desktop) {
            // Keep an opaque outgoing photo beneath the incoming dissolve.
            // This avoids a dark gap and remains fully reversible.
            timeline.set(layers[index - 1], { opacity: 0 }, at + transition);
          } else {
            timeline.to(
              layers[index - 1],
              { opacity: 0, y: -14, duration: transition, ease: "none" },
              at,
            );
          }
          if (desktop) {
            timeline.fromTo(
              layers[index].querySelector("span"),
              { y: 22, scale: 0.96 },
              { y: 0, scale: 1, duration: transition, ease: "none" },
              at,
            );
            timeline.fromTo(
              chapters[index].querySelector("h3"),
              { x: 20 },
              { x: 0, duration: transition, ease: "none" },
              at,
            );
          }
          timeline
            .to(
              layers[index],
              { opacity: 1, y: 0, duration: transition, ease: "none" },
              at,
            )
            .to(
              names[index - 1],
              { opacity: 0.75, duration: transition, ease: "none" },
              at,
            )
            .to(
              names[index],
              { opacity: 1, duration: transition, ease: "none" },
              at,
            )
            .to(
              chapters[index - 1],
              { opacity: 0.82, duration: transition, ease: "none" },
              at,
            )
            .to(
              chapters[index],
              { opacity: 1, duration: transition, ease: "none" },
              at,
            );
        }
      }, host);
      host.dataset.active ||= "1";
      host.dataset.enhanced = "true";
      revert = () => context.revert();
      // The enhanced desktop hides duplicate inline photos. Recompute every
      // section's scroll bounds after that layout change, including direct links.
      ScrollTrigger.refresh();
    } catch {
      // The static chapter range and all copy remain visible on chunk failure.
    }
  };
  void setup();
  motion.addEventListener("change", setup);
  layout.addEventListener("change", setup);
  return () => {
    disposed = true;
    generation++;
    motion.removeEventListener("change", setup);
    layout.removeEventListener("change", setup);
    revert?.();
  };
}
