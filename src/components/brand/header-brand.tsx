import { officialBrandAssets } from "@/lib/brand-assets";
import { OfficialBrand } from "./official-brand";

/** Keep the provisional identity until both responsive applications are approved.
 * This server-rendered slot adds no artwork or image loader to the client menu.
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
