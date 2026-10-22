import { heroPosterAsset, type MotorcycleAsset } from "@/lib/hero-asset";
import { HeroPoster } from "./hero-poster";
import { LicensedVisual } from "./licensed-visual";

export function HeroVisual({ asset }: { asset: MotorcycleAsset | null }) {
  if (heroPosterAsset)
    return (
      <div className="hero-art hero-art-static" data-asset="static">
        <HeroPoster asset={heroPosterAsset} />
      </div>
    );
  return (
    <div
      className={`hero-art${asset ? " hero-art-configured" : " hero-art-pending"}`}
      data-asset={asset ? "configured" : "pending"}
    >
      {asset ? (
        <LicensedVisual asset={asset} />
      ) : (
        <p className="hero-asset-note">Experiência visual em preparação.</p>
      )}
      <span className="hero-brand-mark" aria-hidden="true">
        V
      </span>
      <span className="art-caption" aria-hidden="true">
        PRECISÃO. CUIDADO. TEMPO.
      </span>
    </div>
  );
}
