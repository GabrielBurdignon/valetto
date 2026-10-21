export type EssenceAsset = {
  src: string;
  original: string;
  width: number;
  height: number;
  alt: string;
  /** Real source and usage permission; no invented licensing or author credit. */
  provenance: string;
  usagePermission: string;
  /** CSS object-position tuned with the actual macro, independently on mobile. */
  focalPoint: string;
  mobileFocalPoint: string;
};

/** AI artwork supplied and approved by the project owner; not a GLB render. */
export const essenceAsset: EssenceAsset | null = {
  src: "/media/essence/valetto-essencia-macro.webp",
  original: "/media/essence/valetto-essencia-macro.png",
  width: 1677,
  height: 938,
  alt: "Detalhe do acabamento metálico grafite no tanque e na carenagem de uma motocicleta, sob luz de estúdio.",
  provenance:
    "Imagem gerada por IA no ChatGPT, fornecida pelo responsável em valetto-essencia-assets.zip; ASSET-INFO.txt informa geração em 20/10/2026.",
  usagePermission:
    "Fornecida e aprovada pelo responsável para integração à seção A Essência. Nenhuma licença adicional ou autoria foi presumida.",
  focalPoint: "50% 48%",
  mobileFocalPoint: "65% 50%",
};
