export type PhilosophyVisual = {
  src: string;
  width: number;
  height: number;
  position: string;
  provenance: string;
  usagePermission: string;
};
export type PhilosophyChapter = {
  title: string;
  text: string;
  visual: PhilosophyVisual | null;
};

/** Approved institutional copy; visual assets remain explicitly unconfigured. */
export const philosophyChapters: readonly PhilosophyChapter[] = [
  {
    title: "Conveniência",
    text: "Sua rotina no centro. Uma proposta pensada para poupar deslocamentos e simplificar a organização do cuidado com sua moto.",
    visual: null,
  },
  {
    title: "Responsabilidade",
    text: "Clareza para combinar cada atendimento, respeitando o destino e as condições alinhadas com você.",
    visual: null,
  },
  {
    title: "Atenção aos detalhes",
    text: "Um olhar cuidadoso para a experiência inteira. Do primeiro contato à combinação do retorno.",
    visual: null,
  },
];
