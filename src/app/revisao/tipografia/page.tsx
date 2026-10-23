import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { comparisonFontFiles } from "@/lib/typography-specimens";
import styles from "./typography.module.css";

export const metadata: Metadata = {
  title: "Comparação tipográfica — revisão interna",
  description:
    "Estudo isolado de tipografia da Valetto. Não altera o website aprovado.",
  robots: { index: false, follow: false },
};

const families = [
  {
    id: "system",
    name: "Arial / Helvetica",
    className: styles.system,
    detail: "Fonte do sistema · 0 bytes adicionais",
  },
  {
    id: "inter",
    name: "Inter",
    className: styles.inter,
    detail: `${comparisonFontFiles[0].bytes.toLocaleString("pt-BR")} bytes · WOFF2 variável`,
  },
  {
    id: "manrope",
    name: "Manrope",
    className: styles.manrope,
    detail: `${comparisonFontFiles[1].bytes.toLocaleString("pt-BR")} bytes · WOFF2 variável`,
  },
] as const;

function Specimen({
  id,
  title,
  children,
  dark = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={`${styles.specimen} ${dark ? styles.dark : ""}`}
      aria-labelledby={id}
    >
      <h3 id={id} className={styles.label}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function TypographyComparison() {
  return (
    <main id="conteudo" tabIndex={-1} className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>VALETTO / ESTUDO 01</p>
        <h1>
          Uma mensagem.
          <br />
          Três vozes tipográficas.
        </h1>
        <p className={styles.lead}>
          Compare o desenho das letras, o ritmo e as quebras. As três colunas
          usam os mesmos tamanhos, pesos, espaços e larguras. Nenhuma opção foi
          aplicada à home.
        </p>
        <p className={styles.notice}>
          Arial/Helvetica e Georgia dependem das fontes instaladas no
          dispositivo. Nas capturas Linux, há substituição por fontes locais;
          Inter e Manrope usam os arquivos reais. Georgia é o acento comum às
          três opções.
        </p>
        <div className={styles.facts}>
          <span>Desktop: comparação lado a lado</span>
          <span>Mobile: mesma sequência por família</span>
          <span>Sem animações · conteúdo disponível sem JavaScript</span>
        </div>
      </header>
      <div className={styles.comparison}>
        {families.map((family) => (
          <article
            key={family.id}
            className={`${styles.column} ${family.className}`}
            data-font-family={family.id}
            aria-labelledby={`${family.id}-title`}
          >
            <header className={styles.familyHeader}>
              <p className={styles.kicker}>
                OPÇÃO{" "}
                {family.id === "system"
                  ? "01"
                  : family.id === "inter"
                    ? "02"
                    : "03"}
              </p>
              <h2 id={`${family.id}-title`}>
                {family.name}
                <span> + Georgia</span>
              </h2>
              <p>{family.detail}</p>
            </header>
            <Specimen
              id={`${family.id}-hero`}
              title="01 / Headline cinematográfica"
              dark
            >
              <p className={styles.hero} data-sample="hero">
                Sua moto
                <br />
                precisa ir.
                <br />
                <span>Você não.</span>
              </p>
              <p className={styles.support} data-sample="support">
                A Valetto nasce para cuidar da logística da sua motocicleta:
                retirada, transporte para revisão ou manutenção e retorno, com
                conveniência em cada etapa.
              </p>
              <a className={styles.cta} href="#comparacao-notas">
                Conheça a Valetto <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            </Specimen>
            <Specimen id={`${family.id}-essence`} title="02 / Título editorial">
              <p className={styles.editorial} data-sample="editorial">
                Seu tempo é valioso.
                <br />
                <span>Sua moto também.</span>
              </p>
              <p className={styles.introduction}>
                Algumas coisas merecem a sua atenção. Outras podem ser cuidadas
                por quem entende o valor do seu tempo.
              </p>
            </Specimen>
            <Specimen
              id={`${family.id}-experience`}
              title="03 / Serviço e leitura"
              dark
            >
              <p className={styles.experience} data-sample="experience">
                A próxima revisão.
                <br />
                Sem reorganizar
                <br />
                <span>a sua vida.</span>
              </p>
              <h4>Concierge para revisões e manutenções programadas.</h4>
              <p className={styles.body}>
                Organização da retirada, transporte até a concessionária ou
                prestador especializado e retorno da motocicleta, conforme o
                atendimento combinado.
              </p>
              <p className={styles.caption}>
                EM PRÉ-LANÇAMENTO · BELO HORIZONTE
              </p>
            </Specimen>
            <Specimen
              id={`${family.id}-manifesto`}
              title="04 / Acento editorial"
            >
              <p className={styles.manifesto}>
                Mais tempo para <em>viver.</em>
                <br />
                <span>Menos tempo resolvendo.</span>
              </p>
            </Specimen>
          </article>
        ))}
      </div>
      <section
        id="comparacao-notas"
        className={styles.notes}
        aria-labelledby="comparison-notes-title"
      >
        <p className={styles.kicker}>CRITÉRIOS DE ESCOLHA</p>
        <h2 id="comparison-notes-title">Precisão antes da preferência.</h2>
        <p>
          Observe a legibilidade dos parágrafos, a largura das palavras, a
          presença dos números e a relação entre o título e o texto. As quebras
          explícitas são iguais; diferenças de quebra automática fazem parte da
          comparação. Não há ajustes individuais para favorecer uma família.
        </p>
        <p>
          Fontes Inter e Manrope: distribuição Fontsource Variable 5.3.0,
          subconjunto Latin, licença SIL OFL 1.1. Os valores acima são os
          tamanhos reais dos arquivos WOFF2; não incluem headers HTTP. Não há
          chamadas a serviços externos de fontes. Esta página não é uma
          reprodução da composição completa do hero.
        </p>
        <p>
          O texto de apoio exibido está aprovado para a Etapa 3. A home
          permanece com o texto atual. A marca oficial continua pendente de
          fornecimento e não foi reconstruída neste estudo.
        </p>
      </section>
    </main>
  );
}
