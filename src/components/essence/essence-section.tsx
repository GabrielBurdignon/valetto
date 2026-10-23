import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { essenceContent as content } from "@/lib/essence-content";
import { essenceAsset } from "@/lib/essence-asset";
import { EssenceReveal } from "./essence-reveal";
import styles from "./essence.module.css";

/** Server-rendered editorial content, with an optional approved macro panel. */
export function EssenceSection() {
  const asset = essenceAsset;
  return (
    <section
      id="essencia"
      className={`manifesto section-pad ${styles.section}`}
      aria-labelledby="essence-title"
      data-image={asset ? "configured" : "pending"}
    >
      <div className={`section-label ${styles.label}`}>
        <span>01 / A ESSÊNCIA</span>
        <span>O SEU TEMPO, DE VOLTA.</span>
      </div>
      <EssenceReveal>
        <h2
          id="essence-title"
          className={styles.heading}
          data-essence-reveal="headline"
        >
          <span>{content.title}</span> <span>{content.titleContinuation}</span>
        </h2>
        <p className={styles.introduction} data-essence-reveal="introduction">
          {content.introduction}
        </p>
        {asset && (
          <figure
            className={styles.figure}
            data-essence-reveal="image"
            style={
              {
                "--essence-focus": asset.focalPoint,
                "--essence-mobile-focus": asset.mobileFocalPoint,
              } as CSSProperties
            }
          >
            <Image
              src={asset.src}
              width={asset.width}
              height={asset.height}
              alt={asset.alt}
              sizes="100vw"
              loading="lazy"
            />
          </figure>
        )}
        <div className={styles.narrative}>
          <div className={styles.body} data-essence-reveal="description">
            <p>{content.description}</p>
            <p className={styles.note}>{content.note}</p>
          </div>
        </div>
        <div className={styles.closing} data-essence-reveal="closing">
          <span>MENOS LOGÍSTICA.</span>
          <ArrowUpRight aria-hidden="true" strokeWidth={1} size={22} />
          <span>MAIS VIDA.</span>
        </div>
      </EssenceReveal>
    </section>
  );
}
