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
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (
          disposed ||
          motion.matches ||
          currentGeneration !== generation ||
          !root.current ||
          !layer.current
        )
          return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          gsap.fromTo(
            layer.current,
            { y: 0 },
            {
              y: matchMedia("(max-width: 900px)").matches ? -6 : -12,
              ease: "none",
              scrollTrigger: {
                trigger: root.current!.closest(".hero"),
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }, root.current);
        revert = () => context.revert();
      } catch {
        // A failed animation chunk must never hide the product image or CTA.
      }
    };
    void setup();
    motion.addEventListener("change", setup);
    return () => {
      disposed = true;
      motion.removeEventListener("change", setup);
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
              onLoad={() => setLoaded(true)}
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
