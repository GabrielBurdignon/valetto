import Image from "next/image";
import { philosophyChapters as chapters } from "@/lib/philosophy-content";
import { PhilosophyStory } from "./philosophy-story";
import styles from "./philosophy.module.css";

export function PhilosophySection() {
  return (
    <section
      id="filosofia"
      className={`section-pad ${styles.section}`}
      aria-labelledby="philosophy-title"
    >
      <div className={`section-label ${styles.label}`}>
        <span>02 / NOSSA FILOSOFIA</span>
        <span>ATENÇÃO EM CADA ESCOLHA</span>
      </div>
      <div className={styles.introduction}>
        <h2 id="philosophy-title">
          Cuidado que vai
          <br />
          <span>além do transporte.</span>
        </h2>
        <p>
          Não se trata apenas de levar uma moto de um lugar a outro. É sobre
          tornar o caminho mais simples para você.
        </p>
      </div>
      <PhilosophyStory>
        <div
          className={styles.visual}
          data-philosophy-visual
          aria-hidden="true"
        >
          <div className={styles.visualTop}>
            <span>ATENÇÃO EM CADA ESCOLHA</span>
            <span>01 — 03</span>
          </div>
          <div className={styles.plate}>
            <span className={styles.range}>01—03</span>
            {chapters.map((chapter, index) => (
              <div
                className={styles.layer}
                data-philosophy-layer
                key={chapter.title}
              >
                {chapter.visual && (
                  <Image
                    src={chapter.visual.src}
                    width={chapter.visual.width}
                    height={chapter.visual.height}
                    alt=""
                    sizes="(max-width: 900px) 0px, 44vw"
                    loading="lazy"
                    style={{ objectPosition: chapter.visual.position }}
                  />
                )}
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.chapterNames}>
            {chapters.map((chapter, index) => (
              <span data-philosophy-name key={chapter.title}>
                <span className={styles.smallNumber}>0{index + 1}</span>
                {chapter.title}
              </span>
            ))}
          </div>
          <div className={styles.progress}>
            <span data-philosophy-progress />
          </div>
        </div>
        <div className={styles.chapters}>
          {chapters.map((chapter, index) => (
            <article
              className={styles.chapter}
              data-philosophy-chapter
              key={chapter.title}
              aria-labelledby={`philosophy-chapter-${index}`}
            >
              <span className={styles.chapterIndex} aria-hidden="true">
                0{index + 1} / 03
              </span>
              <h3 id={`philosophy-chapter-${index}`}>{chapter.title}</h3>
              <p>{chapter.text}</p>
            </article>
          ))}
        </div>
      </PhilosophyStory>
    </section>
  );
}
