import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EssenceSection } from "@/components/essence/essence-section";
import { ExperienceSection } from "@/components/experience/experience-section";
import { HeroSpecimen } from "../hero-specimen";
import styles from "./specimen.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ variant: "atual" }, { variant: "inter" }];
}

export const metadata: Metadata = {
  title: "Inter — validação visual isolada",
  description:
    "Hero, A Essência e A Experiência em tipografia atual e Inter. Estudo sem alteração da home.",
  robots: { index: false, follow: false },
};

export default async function InterReview({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (variant !== "atual" && variant !== "inter") notFound();
  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className={variant === "inter" ? styles.inter : styles.system}
      data-review-variant={variant}
    >
      <HeroSpecimen />
      <EssenceSection />
      <ExperienceSection />
      <aside
        id="lancamento"
        className={styles.notes}
        aria-labelledby="review-title"
      >
        <p>VALETTO / REVISÃO VISUAL ISOLADA</p>
        <h2 id="review-title">
          {variant === "inter" ? "Inter" : "Tipografia atual"}: mesmas cenas,
          mesmas medidas CSS.
        </h2>
        <p>
          Este estudo preserva textos, tamanhos, espaçamentos, imagens e pontos
          focais existentes. Filosofia, Processo e manifesto não fazem parte
          deste recorte. O cabeçalho e o rodapé continuam com a tipografia
          atual.
        </p>
        <p>
          Arial/Helvetica e Georgia dependem do sistema. Nas capturas Linux, a
          tipografia atual usa substitutas locais. Inter usa o WOFF2 real, de
          48.256 bytes, com licença SIL OFL 1.1. Não há antecipação da nova
          descrição aprovada para a Etapa 3 nem integração da marca oficial.
        </p>
        <nav aria-label="Versões do estudo" className={styles.links}>
          <Link
            prefetch={false}
            href="/revisao/inter/atual"
            aria-current={variant === "atual" ? "page" : undefined}
          >
            Ver tipografia atual
          </Link>
          <Link
            prefetch={false}
            href="/revisao/inter/inter"
            aria-current={variant === "inter" ? "page" : undefined}
          >
            Ver Inter
          </Link>
          <Link prefetch={false} href="/">
            Voltar ao site aprovado
          </Link>
        </nav>
      </aside>
    </main>
  );
}
