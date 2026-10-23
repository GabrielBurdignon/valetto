import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Progressive, reversible editorial choreography. Geometry stays in server HTML. */
export function mountEssence(host: HTMLDivElement) {
  const section = host.closest<HTMLElement>("#essencia");
  const figure = host.querySelector<HTMLElement>(
    '[data-essence-reveal="image"]',
  );
  const image = figure?.querySelector<HTMLImageElement>("img");
  if (!section || !figure || !image) return;
  gsap.registerPlugin(ScrollTrigger);
  let disposed = false;
  let media: ReturnType<typeof gsap.matchMedia> | undefined;
  let generation = 0;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const setup = async () => {
    const current = ++generation;
    media?.revert();
    media = undefined;
    host.dataset.enhanced = "false";
    if (motion.matches) return;
    try {
      await image.decode();
    } catch {
      return;
    }
    if (disposed || motion.matches || current !== generation) return;
    media = gsap.matchMedia();
    media.add(
      {
        compact: "(max-width: 900px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const compact = context.conditions.compact;
        const headline = host.querySelector('[data-essence-reveal="headline"]');
        const lines = headline?.querySelectorAll("span");
        const editorial = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: host,
            start: "top bottom",
            endTrigger: figure,
            end: "top 32%",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });
        if (lines?.length) {
          editorial.fromTo(
            lines[0],
            { xPercent: compact ? -2 : -4, y: 24 },
            { xPercent: 0, y: 0, duration: 1 },
            0,
          );
          editorial.fromTo(
            lines[1],
            { xPercent: compact ? 3 : 7, y: 42 },
            { xPercent: 0, y: 0, duration: 1 },
            0.08,
          );
        }
        editorial.fromTo(
          host.querySelector('[data-essence-reveal="introduction"]'),
          { y: compact ? 16 : 36 },
          { y: 0, duration: 0.8 },
          0.2,
        );
        gsap.fromTo(
          figure,
          { clipPath: compact ? "inset(5% 6% 5% 6%)" : "inset(8% 12% 8% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: figure,
              start: "top 95%",
              end: "center 52%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.fromTo(
          image,
          { scale: compact ? 1.06 : 1.12, yPercent: 2 },
          {
            scale: 1.04,
            yPercent: -1.5,
            ease: "none",
            scrollTrigger: {
              trigger: figure,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
        host.dataset.enhanced = "true";
        return () => {
          host.dataset.enhanced = "false";
        };
      },
    );
  };
  const onLoad = () => {
    void setup();
  };
  // decode() can wait for a lazy resource. Listeners let a failed request recover.
  image.addEventListener("load", onLoad);
  motion.addEventListener("change", onLoad);
  void setup();
  return () => {
    disposed = true;
    generation++;
    image.removeEventListener("load", onLoad);
    motion.removeEventListener("change", onLoad);
    media?.revert();
    host.dataset.enhanced = "false";
  };
}
