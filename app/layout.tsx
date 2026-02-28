import type { Metadata } from "next";
import { getHomeMetadata, getOrganizationStructuredData } from "@/lib/seo";
import ScrollRevealInit from "@/hooks/useScrollReveal";
import "./globals.css";
import { Suspense } from "react";
import  ThemeProvider  from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";

export const metadata: Metadata = getHomeMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = getOrganizationStructuredData();

  return (
    <html lang="fr" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,600&family=Geist:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <ScrollRevealInit />
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}