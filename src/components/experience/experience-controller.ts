/** Progressively loaded panorama; semantic content is never gated by animation. */
export function mountExperience(host: HTMLDivElement) {
  if (typeof IntersectionObserver === "undefined") return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const layout = matchMedia("(min-width: 901px)");
  let disposed = false;
  let generation = 0;
  let revert: (() => void) | undefined;
  let clearImageListeners: (() => void) | undefined;
  const setup = async () => {
    const current = ++generation;
    revert?.();
    clearImageListeners?.();
    revert = undefined;
    clearImageListeners = undefined;
    host.dataset.enhanced = "false";
    host.dataset.sceneReady = "false";
    if (disposed || motion.matches) return;
    try {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || motion.matches || current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const compact = !layout.matches;
      const section = host.closest("#servicos");
      const frame = host.querySelector("[data-experience-frame]");
      const picture = host.querySelector("[data-experience-picture]");
      const image = picture?.querySelector("img");
      const context = gsap.context(() => {
        host
          .querySelectorAll("[data-experience-line]")
          .forEach((line, index) => {
            gsap.fromTo(
              line,
              {
                x: (index === 0 ? -1 : 1) * (compact ? 8 : 24 + index * 18),
                y: compact ? 14 : 32,
              },
              {
                x: 0,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: host,
                  start: "top 95%",
                  endTrigger: frame,
                  end: "top 38%",
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        const copy = host.querySelector("[data-experience-copy]");
        if (copy)
          gsap.fromTo(
            copy,
            { y: compact ? 16 : 42 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: copy,
                start: "top 94%",
                end: "top 60%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        const handoff = section?.querySelector("[data-experience-handoff]");
        if (handoff)
          gsap.fromTo(
            handoff,
            { scaleY: 0.12 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: handoff,
                start: "top 95%",
                end: "bottom 70%",
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            },
          );
      }, host);
      revert = () => context.revert();
      if (picture && frame && image) {
        const reveal = async () => {
          try {
            await image.decode();
          } catch {
            return;
          }
          if (disposed || motion.matches || current !== generation) return;
          context.add(() => {
            gsap.fromTo(
              frame,
              {
                clipPath: compact
                  ? "inset(5% 6% 5% 6%)"
                  : "inset(12% 13% 9% 13%)",
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top 96%",
                  end: "center 55%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              },
            );
            gsap.fromTo(
              picture,
              { scale: compact ? 1.065 : 1.11, yPercent: 1.2 },
              {
                scale: 1.045,
                yPercent: -1.2,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
          host.dataset.sceneReady = "true";
        };
        if (image.complete) {
          if (image.naturalWidth) void reveal();
        } else {
          const onLoad = () => {
            clearImageListeners?.();
            void reveal();
          };
          clearImageListeners = () => image.removeEventListener("load", onLoad);
          image.addEventListener("load", onLoad, { once: true });
        }
      }
      host.dataset.enhanced = "true";
    } catch {
      revert?.();
      host.dataset.enhanced = "false";
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
    clearImageListeners?.();
    revert?.();
  };
}
