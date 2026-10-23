/** Only populate with official files supplied and approved by the brand owner.
 * No existing generic V or text-built wordmark is an official fallback.
 */
export type OfficialBrandAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type OfficialBrandAssets = {
  headerDesktop: OfficialBrandAsset | null;
  headerCompact: OfficialBrandAsset | null;
  footer: OfficialBrandAsset | null;
  favicon: OfficialBrandAsset | null;
  socialImage: OfficialBrandAsset | null;
};

const suppliedWhiteLogo: OfficialBrandAsset = {
  src: "/media/brand/valetto-branca.webp",
  width: 1983,
  height: 793,
  alt: "Valetto — Motorcycle Concierge e Transporte",
};

/** Official artwork supplied by the project owner; no reconstructed lettering. */
export const officialBrandAssets: OfficialBrandAssets = {
  headerDesktop: suppliedWhiteLogo,
  headerCompact: suppliedWhiteLogo,
  footer: suppliedWhiteLogo,
  favicon: null,
  socialImage: null,
};
