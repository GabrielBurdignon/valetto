import Image from "next/image";
import type { CSSProperties } from "react";
import type { PhilosophyChapter } from "@/lib/philosophy-content";
import styles from "./philosophy.module.css";

/** Shared delivery for the sticky stage and the static/mobile reading flow. */
export function PhilosophyMedia({
  chapter,
  variant,
}: {
  chapter: PhilosophyChapter;
  variant: "stage" | "inline";
}) {
  const asset = chapter.visual;
  if (!asset) return null;
  return (
    <div
      className={`${styles.media} ${variant === "stage" ? styles.stageMedia : styles.inlineMedia}`}
      data-philosophy-media={chapter.sceneId}
      aria-hidden="true"
      style={
        {
          "--philosophy-focus": asset.position,
          "--philosophy-mobile-focus": asset.mobile?.position || asset.position,
        } as CSSProperties
      }
    >
      <picture>
        {asset.mobile && (
          <source
            media="(max-width: 900px)"
            srcSet={asset.mobile.src}
            width={asset.mobile.width}
            height={asset.mobile.height}
          />
        )}
        <Image
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt=""
          loading="lazy"
          sizes={
            variant === "stage" ? "100vw" : "(max-width: 900px) 100vw, 40vw"
          }
        />
      </picture>
    </div>
  );
}
