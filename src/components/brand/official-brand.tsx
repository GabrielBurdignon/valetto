import Image from "next/image";
import { officialBrandAssets } from "@/lib/brand-assets";

type Application = "headerDesktop" | "headerCompact" | "footer";

/** Prepared for Stage 2; unused until official artwork is supplied and approved. */
export function OfficialBrand({
  application,
  className,
}: {
  application: Application;
  className?: string;
}) {
  const asset = officialBrandAssets[application];
  if (!asset) return null;
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={asset.alt}
      className={className}
    />
  );
}
