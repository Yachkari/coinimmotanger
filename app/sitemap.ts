import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,             lastModified: new Date(), changeFrequency: "daily",   priority: 1.0  },
    { url: `${SITE_URL}/vente`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9  },
    { url: `${SITE_URL}/location`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9  },
    { url: `${SITE_URL}/vacances`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8  },
    { url: `${SITE_URL}/recherche`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.5  },
  ];

  const result = await getAllSlugs();
  if (!result.data) return staticPages;

  const listingPages: MetadataRoute.Sitemap = result.data.map(({ slug, purpose, updated_at }) => ({
    url:             `${SITE_URL}/${purpose}/${slug}`,
    lastModified:    new Date(updated_at),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  return [...staticPages, ...listingPages];
}