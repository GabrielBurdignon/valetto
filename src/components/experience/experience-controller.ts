/** Original approved motion, loaded progressively without a React boundary. */
export function mountExperience(host: HTMLDivElement) {
  if (typeof IntersectionObserver === "undefined") return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
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
    if (disposed || motion.matches) return;
    try {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || motion.matches || current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        for (const selector of [
          "[data-experience-heading]",
          "[data-experience-copy]",
        ]) {
          const element = host.querySelector(selector);
          if (!element) continue;
          gsap.fromTo(
            element,
            { opacity: 0.82, y: 8 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 92%",
                end: "top 62%",
                scrub: 0.4,
              },
            },
          );
        }
      }, host);
      revert = () => context.revert();
      const picture = host.querySelector("[data-experience-picture]");
      const frame = host.querySelector("[data-experience-frame]");
      const image = picture?.querySelector("img");
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
              picture,
              { opacity: 0.88, y: 8, scale: 1.04 },
              {
                opacity: 1,
                y: -8,
                scale: 1.04,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
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
  return () => {
    disposed = true;
    generation++;
    motion.removeEventListener("change", setup);
    clearImageListeners?.();
    revert?.();
  };
}
