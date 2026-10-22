import { brand } from "@/lib/brand";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${brand.site}/sitemap.xml`,
  };
}
