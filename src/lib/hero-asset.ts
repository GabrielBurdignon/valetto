export type MotorcycleAsset = {
  /** Local self-contained GLB; no external textures or remote decoder requests. */
  model: string;
  poster: string;
  alt: string;
  license: { name: string; source: string; author: string; evidence: string };
  /** Model orientation after normalization to a 3.8-unit longest dimension. */
  rotation: [number, number, number];
};

/** Deliberately disabled until licensed, brand-free assets pass docs/HERO-ASSETS.md. */
export const motorcycleAsset: MotorcycleAsset | null = null;

export type HeroPosterAsset = {
  src: string;
  width: number;
  height: number;
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
  original: string;
  alt: string;
  provenance: string;
};

/** Static artwork supplied by the project owner; not a GLB or license claim. */
export const heroPosterAsset: HeroPosterAsset | null = {
  src: "/media/hero/motorcycle-desktop.webp",
  width: 1672,
  height: 941,
  mobileSrc: "/media/hero/motorcycle-mobile.webp",
  mobileWidth: 920,
  mobileHeight: 941,
  original: "/media/hero/motorcycle-original.png",
  alt: "Motocicleta big trail grafite e preta em iluminação cinematográfica de estúdio.",
  provenance:
    "Imagem gerada por IA fornecida pelo responsável do projeto no arquivo Motocicleta.zip.",
};
