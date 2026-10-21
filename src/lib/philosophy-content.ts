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

/** Approved institutional copy and AI-generated images supplied by the project owner. */
export const philosophyChapters: readonly PhilosophyChapter[] = [
  {
    sceneId: "cockpit",
    title: "Conveniência",
    text: "Sua rotina no centro. Uma proposta pensada para poupar deslocamentos e simplificar a organização do cuidado com sua moto.",
    visual: {
      src: "/media/philosophy/cockpit.webp",
      width: 1672,
      height: 941,
      position: "50% 42%",
      alt: "Cockpit de motocicleta grafite, com guidão, painel e tanque sob iluminação de estúdio.",
      mobile: {
        src: "/media/philosophy/cockpit-mobile.webp",
        width: 1040,
        height: 585,
        position: "50% 42%",
      },
      provenance:
        "Imagem gerada por IA, fornecida pelo responsável do projeto no ZIP valetto-filosofia-imagens.zip.",
      usagePermission:
        "Uso no site Valetto autorizado pelo responsável do projeto nesta conversa.",
    },
  },
  {
    sceneId: "engineering",
    title: "Responsabilidade",
    text: "Clareza para combinar cada atendimento, respeitando o destino e as condições alinhadas com você.",
    visual: {
      src: "/media/philosophy/engineering.webp",
      width: 1672,
      height: 941,
      position: "54% 50%",
      alt: "Detalhe do motor, quadro e coletores metálicos de uma motocicleta grafite.",
      mobile: {
        src: "/media/philosophy/engineering-mobile.webp",
        width: 1040,
        height: 585,
        position: "54% 50%",
      },
      provenance:
        "Imagem gerada por IA, fornecida pelo responsável do projeto no ZIP valetto-filosofia-imagens.zip.",
      usagePermission:
        "Uso no site Valetto autorizado pelo responsável do projeto nesta conversa.",
    },
  },
  {
    sceneId: "finish",
    title: "Atenção aos detalhes",
    text: "Um olhar cuidadoso para a experiência inteira. Do primeiro contato à combinação do retorno.",
    visual: {
      src: "/media/philosophy/finish.webp",
      width: 1672,
      height: 941,
      position: "70% 44%",
      alt: "Farol e carenagem grafite com reflexos que destacam as superfícies e os encaixes.",
      mobile: {
        src: "/media/philosophy/finish-mobile.webp",
        width: 1040,
        height: 585,
        position: "70% 44%",
      },
      provenance:
        "Imagem gerada por IA, fornecida pelo responsável do projeto no ZIP valetto-filosofia-imagens.zip.",
      usagePermission:
        "Uso no site Valetto autorizado pelo responsável do projeto nesta conversa.",
    },
  },
];
