"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroPosterAsset } from "@/lib/hero-asset";

/** Real photography/render only. This layer never mounts or imports a canvas. */
export function HeroPoster({ asset }: { asset: HeroPosterAsset }) {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    let disposed = false;
    let generation = 0;
    let revert: (() => void) | undefined;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const setup = async () => {
      const currentGeneration = ++generation;
      revert?.();
      revert = undefined;
      if (motion.matches) return;
      try {
        const { mountHero } = await import("./hero-controller");
        if (
          disposed ||
          motion.matches ||
          currentGeneration !== generation ||
          !root.current ||
          !layer.current
        )
          return;
        revert = mountHero(root.current, layer.current);
      } catch {
        // A failed animation chunk must never hide the product image or CTA.
      }
    };
    let disarm: (() => void) | undefined;
    const prepare = () => {
      disarm?.();
      revert?.();
      revert = undefined;
      generation++;
      if (motion.matches) return;
      if (window.scrollY > 0) {
        void setup();
        return;
      }
      // CSS handles the approved entrance. Scroll machinery is unnecessary at rest.
      const onIntent = (event: Event) => {
        if (
          event instanceof KeyboardEvent &&
          ![
            "ArrowDown",
            "ArrowUp",
            "PageDown",
            "PageUp",
            "Home",
            "End",
            " ",
          ].includes(event.key)
        )
          return;
        disarm?.();
        void setup();
      };
      const events = ["wheel", "touchstart", "scroll", "keydown"];
      events.forEach((event) =>
        window.addEventListener(event, onIntent, { passive: true }),
      );
      disarm = () =>
        events.forEach((event) => window.removeEventListener(event, onIntent));
    };
    prepare();
    motion.addEventListener("change", prepare);
    return () => {
      disposed = true;
      motion.removeEventListener("change", prepare);
      disarm?.();
      revert?.();
    };
  }, [loaded]);

  return (
    <div ref={root} className="hero-poster" data-loaded={loaded}>
      <div className="hero-poster-reveal">
        <div ref={layer} className="hero-poster-parallax">
          <picture>
            {asset.mobileSrc && (
              <source
                media="(max-width: 900px)"
                srcSet={asset.mobileSrcSet || asset.mobileSrc}
                sizes={asset.mobileSizes}
                width={asset.mobileWidth}
                height={asset.mobileHeight}
              />
            )}
            <Image
              src={asset.src}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              sizes="100vw"
              fetchPriority="high"
              loading="eager"
              onLoad={(event) => {
                const image = event.currentTarget;
                void image
                  .decode()
                  .then(() => setLoaded(true))
                  .catch(() => {});
              }}
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
