import { brand } from "@/lib/brand";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacidade"].map((path) => ({
    url: `${brand.site}${path}`,
  }));
}
