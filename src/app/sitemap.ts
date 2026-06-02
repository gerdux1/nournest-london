import type { MetadataRoute } from "next";
import { LISTINGS, LOCATIONS } from "@/lib/listings";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nournestapartments.com";
  const now = new Date();

  const staticPages = [
    "",
    "/apartments",
    "/corporate",
    "/about",
    "/apartments-vs-hotels",
    "/faq",
    "/contact",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1.0 : 0.7,
  }));

  const locationPages = LOCATIONS.map((l) => ({
    url: `${base}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const listingPages = LISTINGS.map((l) => ({
    url: `${base}/apartments/${l.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...locationPages, ...listingPages];
}
