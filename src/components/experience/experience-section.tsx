import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { experienceAsset as asset } from "@/lib/experience-asset";
import { ExperienceMotion } from "./experience-motion";
import styles from "./experience.module.css";

export function ExperienceSection() {
  return (
    <section
      id="servicos"
      className={`section-pad ${styles.section}`}
      aria-labelledby="experience-title"
    >
      <div className="section-label">
        <span>04 / A EXPERIÊNCIA</span>
        <span>PENSADA PARA A SUA ROTINA</span>
      </div>
      <ExperienceMotion>
        <h2
          id="experience-title"
          className={styles.headline}
          data-experience-heading
        >
          A próxima revisão.
          <br />
          Sem reorganizar
          <br />
          <span>a sua vida.</span>
        </h2>
        <div className={styles.scene} data-experience-scene>
          <figure className={styles.frame} data-experience-frame>
            <picture data-experience-picture>
              <source
                media="(max-width: 900px)"
                srcSet={asset.mobile.src}
                width={asset.mobile.width}
                height={asset.mobile.height}
              />
              <Image
                src={asset.desktop.src}
                width={asset.desktop.width}
                height={asset.desktop.height}
                alt={asset.alt}
                loading="lazy"
                sizes="100vw"
              />
            </picture>
          </figure>
          <div className={styles.editorial} data-experience-copy>
            <span className="eyebrow">A PROPOSTA VALETTO</span>
            <div className={styles.description}>
              <h3>Concierge para revisões e manutenções programadas.</h3>
              <p>
                Organização da retirada, transporte até a concessionária ou
                prestador especializado e retorno da motocicleta, conforme o
                atendimento combinado.
              </p>
              <a className="text-link" href="#lancamento">
                Acompanhe o próximo capítulo <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </ExperienceMotion>
      <div className={styles.future} data-experience-future>
        <span className="eyebrow">VISÃO DE EXPANSÃO</span>
        <p>
          Novas possibilidades de conveniência estão no nosso horizonte. Cada
          novo serviço será apresentado quando estiver pronto.
        </p>
      </div>
    </section>
  );
}
