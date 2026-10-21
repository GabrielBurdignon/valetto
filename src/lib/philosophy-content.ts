export type PhilosophyVisual = {
  src: string;
  width: number;
  height: number;
  position: string;
  alt: string;
  mobile?: { src: string; width: number; height: number; position: string };

  provenance: string;
  usagePermission: string;
};
export type PhilosophyChapter = {
  sceneId: "cockpit" | "engineering" | "finish";
  title: string;
  text: string;
  visual: PhilosophyVisual | null;
};

/** Approved institutional copy; visual assets remain explicitly unconfigured. */
export const philosophyChapters: readonly PhilosophyChapter[] = [
  {
    sceneId: "cockpit",
    title: "Conveniência",
    text: "Sua rotina no centro. Uma proposta pensada para poupar deslocamentos e simplificar a organização do cuidado com sua moto.",
    visual: null,
  },
  {
    sceneId: "engineering",
    title: "Responsabilidade",
    text: "Clareza para combinar cada atendimento, respeitando o destino e as condições alinhadas com você.",
    visual: null,
  },
  {
    sceneId: "finish",
    title: "Atenção aos detalhes",
    text: "Um olhar cuidadoso para a experiência inteira. Do primeiro contato à combinação do retorno.",
    visual: null,
  },
];
