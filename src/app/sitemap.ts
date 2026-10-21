import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacidade"].map((path) => ({
    url: `https://valetto.com.br${path}`,
  }));
}
