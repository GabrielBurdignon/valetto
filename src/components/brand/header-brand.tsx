import { officialBrandAssets } from "@/lib/brand-assets";
import { OfficialBrand } from "./official-brand";

/** Responsive official artwork stays in a server-rendered slot.
 * The text fallback is used only when no approved artwork is configured.
 */
export function HeaderBrand() {
  if (
    !officialBrandAssets.headerDesktop ||
    !officialBrandAssets.headerCompact
  ) {
    return (
      <>
        VALETTO<span> MOTORCYCLE CONCIERGE</span>
      </>
    );
  }
  return (
    <>
      <OfficialBrand
        application="headerDesktop"
        className="header-brand-wide"
      />
      <OfficialBrand
        application="headerCompact"
        className="header-brand-compact"
      />
    </>
  );
}
