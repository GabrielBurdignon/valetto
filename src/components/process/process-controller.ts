/** Progressive editorial process, loaded progressively without a React boundary. */
export function mountProcess(host: HTMLDivElement) {
  if (typeof IntersectionObserver === "undefined") return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 901px)");
  let disposed = false;
  let generation = 0;
  let revert: (() => void) | undefined;
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
      const steps = host.querySelectorAll<HTMLElement>("[data-process-step]");
      const fills = host.querySelectorAll<HTMLElement>(
        "[data-process-progress]",
      );
      const numbers = host.querySelectorAll<HTMLElement>(
        "[data-process-number]",
      );
      const copy = host.querySelectorAll<HTMLElement>("[data-process-copy]");
      const horizontal = desktop.matches;
      const context = gsap.context(() => {
        gsap.set(fills, horizontal ? { scaleX: 0 } : { scaleY: 0 });
        gsap.set(copy, { opacity: 0.88, y: 12 });
        gsap.set(numbers, { color: "#a7adb5", scale: 0.82, y: 16 });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: host,
            start: "top 80%",
            end: horizontal ? "bottom 42%" : "bottom 60%",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
          onUpdate: function () {
            const active = String(
              Math.min(steps.length - 1, Math.floor(this.time())) + 1,
            );
            if (host.dataset.active !== active) host.dataset.active = active;
          },
        });
        steps.forEach((_, index) => {
          timeline
            .to(
              fills[index],
              {
                ...(horizontal ? { scaleX: 1 } : { scaleY: 1 }),
                duration: 1,
                ease: "none",
              },
              index,
            )
            .to(
              numbers[index],
              { color: "#f5f5f3", scale: 1, y: 0, duration: 0.3, ease: "none" },
              index,
            )
            .to(
              copy[index],
              { opacity: 1, y: 0, duration: 0.35, ease: "none" },
              index,
            );
          if (index > 0)
            timeline.to(
              numbers[index - 1],
              { color: "#b6bdc5", scale: 0.9, duration: 0.3, ease: "none" },
              index,
            );
        });
      }, host);
      revert = () => context.revert();
      host.dataset.enhanced = "true";
      host.dataset.active ||= "1";
    } catch {
      // Baseline line, numbers and every word remain visible on chunk failure.
    }
  };
  void setup();
  motion.addEventListener("change", setup);
  desktop.addEventListener("change", setup);
  return () => {
    disposed = true;
    generation++;
    motion.removeEventListener("change", setup);
    desktop.removeEventListener("change", setup);
    revert?.();
  };
}
