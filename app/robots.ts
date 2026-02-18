import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/vente/", "/location/", "/vacances/", "/recherche/"],
        disallow:  ["/dashboard/", "/login/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}