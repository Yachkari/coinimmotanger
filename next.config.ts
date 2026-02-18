import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // ============================================================
  // IMAGES
  // Allows Next.js <Image> to load images from Supabase Storage
  // Replace "abcdefghijklmnop" with your actual Supabase project ID
  // (found in your Supabase URL: https://YOURPROJECTID.supabase.co)
  // ============================================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oxitpudbathsmyynvnpw.supabase.co",   // ← replace this
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Optimize image formats — WebP is served automatically by Next.js
    formats: ["image/webp", "image/avif"],
    unoptimized: true, 
  },

  // ============================================================
  // REDIRECTS
  // Old or short URLs redirected to their canonical versions
  // Useful for SEO — avoids duplicate content
  // ============================================================
  async redirects() {
    return [
      {
        source: "/listings",
        destination: "/vente",
        permanent: true,  // 308 — tells Google the old URL is gone for good
      },
      {
        source: "/rent",
        destination: "/location",
        permanent: true,
      },
    ];
  },

  // ============================================================
  // HEADERS
  // Security headers — improves SEO trust signals and protects
  // against common browser attacks
  // ============================================================
  async headers() {
    return [
      {
        source: "/(.*)",  // applies to all pages
        headers: [
          // Prevents your site from being embedded in iframes (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Prevents browsers from guessing content type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controls how much referrer info is shared with other sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Tells browsers to always use HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Cache listing images aggressively — they rarely change
        source: "/listing-images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

};

export default nextConfig;