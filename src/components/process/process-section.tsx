import { steps } from "@/lib/brand";
import { ProcessTimeline } from "./process-timeline";
import styles from "./process.module.css";

export function ProcessSection() {
  return (
    <section
      id="como-funciona"
      className={`section-pad ${styles.section}`}
      aria-labelledby="process-title"
    >
      <div className="section-label">
        <span>03 / COMO FUNCIONA</span>
        <span>SIMPLES, DO INÍCIO AO FIM.</span>
      </div>
      <h2 id="process-title">
        Você entrega a chave.
        <br />
        <span>Nós cuidamos do resto.</span>
      </h2>
      <ProcessTimeline>
        <ol className={styles.timeline} role="list">
          {steps.map((step, index) => (
            <li key={step.title} data-process-step>
              <span className={styles.track} aria-hidden="true">
                <span data-process-progress />
              </span>
              <span
                className={styles.number}
                data-process-number
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <div className={styles.copy} data-process-copy>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </ProcessTimeline>
      <p className="small-note">
        Fluxo previsto. Disponibilidade e condições serão informadas no
        lançamento.
      </p>
    </section>
  );
}
