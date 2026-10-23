import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroVisual } from "@/components/hero/hero-visual";
import { motorcycleAsset } from "@/lib/hero-asset";

/** Exact hero markup from approved 209d5f6. Review only; not used by the home. */
export function HeroSpecimen() {
  return (
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
  );
}
