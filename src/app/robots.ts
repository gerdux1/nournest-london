import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://nournestapartments.com/sitemap.xml",
    host: "https://nournestapartments.com",
  };
}
