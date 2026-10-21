import { PhilosophySection } from "@/components/philosophy/philosophy-section";
import { EssenceSection } from "@/components/essence/essence-section";
import { HeroVisual } from "@/components/hero/hero-visual";
import { motorcycleAsset } from "@/lib/hero-asset";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { brand, steps } from "@/lib/brand";
export default function Home() {
  return (
    <main id="conteudo">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span className="eyebrow">
            <i /> BELO HORIZONTE, MG
          </span>
          <span className="eyebrow muted">CONVENIÊNCIA EM OUTRO NÍVEL</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">VALETTO / MOTORCYCLE CONCIERGE</p>
          <h1 id="hero-title">
            Sua moto
            <br />
            precisa ir.
            <br />
            <span>Você não.</span>
          </h1>
          <p className="hero-description">
            Seu tempo merece uma nova experiência
            <br className="desktop-break" /> em cuidado e conveniência para
            motocicletas.
          </p>
          <a className="button button-light" href="#essencia">
            Conheça a Valetto <ArrowUpRight size={18} />
          </a>
        </div>
        <HeroVisual asset={motorcycleAsset} />
        <div className="hero-bottom">
          <a href="#essencia" className="scroll-link">
            <ArrowDown size={17} /> EXPLORE A EXPERIÊNCIA
          </a>
          <span className="status">
            <i /> EM PRÉ-LANÇAMENTO
          </span>
        </div>
      </section>
      <EssenceSection />
      <PhilosophySection />
      <section id="como-funciona" className="process section-pad">
        <div className="section-label">
          <span>03 / COMO FUNCIONA</span>
          <span>SIMPLES, DO INÍCIO AO FIM.</span>
        </div>
        <h2>
          Você entrega a chave.
          <br />
          <span>Nós cuidamos do resto.</span>
        </h2>
        <ol className="timeline">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="small-note">
          Fluxo previsto. Disponibilidade e condições serão informadas no
          lançamento.
        </p>
      </section>
      <section id="servicos" className="services section-pad">
        <div className="section-label">
          <span>04 / A EXPERIÊNCIA</span>
          <span>PENSADA PARA A SUA ROTINA</span>
        </div>
        <div className="service-feature">
          <div>
            <span className="eyebrow">A PROPOSTA VALETTO</span>
            <h2>
              A próxima revisão.
              <br />
              Sem reorganizar
              <br />
              <span>a sua vida.</span>
            </h2>
          </div>
          <div className="service-description">
            <MoveUpRight size={48} strokeWidth={1} />
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
        <div className="future">
          <span className="eyebrow">VISÃO DE EXPANSÃO</span>
          <p>
            Novas possibilidades de conveniência estão no nosso horizonte. Cada
            novo serviço será apresentado quando estiver pronto.
          </p>
        </div>
      </section>
      <section className="statement section-pad">
        <span className="eyebrow">O VERDADEIRO LUXO É TER TEMPO.</span>
        <h2>
          Mais tempo
          <br />
          para <em>viver.</em>
          <br />
          <span>
            Menos tempo
            <br />
            resolvendo.
          </span>
        </h2>
        <span className="statement-signature">ESSA É A NOSSA DIREÇÃO. ↗</span>
      </section>
      <section id="lancamento" className="launch section-pad">
        <div className="section-label">
          <span>05 / BELO HORIZONTE</span>
          <span className="status">
            <i /> EM PRÉ-LANÇAMENTO
          </span>
        </div>
        <div className="launch-layout">
          <div>
            <p className="eyebrow">O PRÓXIMO CAPÍTULO COMEÇA AQUI.</p>
            <h2>
              Uma nova experiência
              <br />
              está chegando.
            </h2>
          </div>
          <div>
            <p>
              Estamos preparando uma forma mais simples de cuidar da sua moto.
              Acompanhe a Valetto e conheça os próximos passos do lançamento em
              Belo Horizonte.
            </p>
            <a
              className="button button-light"
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Acompanhe no Instagram <ArrowUpRight size={18} />
            </a>
            <p className="small-note">
              @valettomotos · Novidades nos canais oficiais.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
