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

/** Pending approval. Header slots retain the provisional mark while either asset is null. */
export const officialBrandAssets: OfficialBrandAssets = {
  headerDesktop: null,
  headerCompact: null,
  footer: null,
  favicon: null,
  socialImage: null,
};
