import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Loaded on scroll intent, after the real 2D image has decoded. No pin or canvas. */
export function mountHero(root: HTMLDivElement, layer: HTMLDivElement) {
  gsap.registerPlugin(ScrollTrigger);
  const hero = root.closest<HTMLElement>(".hero");
  if (!hero) return;
  const media = gsap.matchMedia();
  media.add(
    {
      compact: "(max-width: 900px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      if (!context.conditions?.motion) return;
      const compact = context.conditions.compact;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });
      timeline.fromTo(
        layer,
        { y: 0, xPercent: 0, scale: 1 },
        {
          y: compact ? -26 : -86,
          xPercent: compact ? 0 : -2,
          scale: compact ? 1.055 : 1.14,
          duration: 1,
        },
        0,
      );
      timeline.fromTo(
        hero.querySelector(".hero-copy"),
        { y: 0, opacity: 1 },
        { y: compact ? -12 : -64, opacity: 0.85, duration: 0.85 },
        0,
      );
      timeline.fromTo(
        hero.querySelector(".hero-topline"),
        { y: 0, opacity: 1 },
        { y: -18, opacity: 0.8, duration: 0.65 },
        0,
      );
      const nextLabel = document.querySelector("#essencia .section-label");
      if (nextLabel)
        gsap.fromTo(
          nextLabel,
          { y: compact ? 12 : 24 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "bottom 95%",
              end: "bottom 48%",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          },
        );
      hero.dataset.cinematic = "true";
      return () => {
        delete hero.dataset.cinematic;
      };
    },
  );
  return () => media.revert();
}
