'use client'

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";
import { formatPrice, formatSurface, getCoverImage, formatType } from "@/lib/utils";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { t, tr } from "@/lib/translations";

interface Props {
  listing:   Listing;
  priority?: boolean;
  variant?:  "default" | "compact";
}

export default function ListingCard({ listing, priority = false, variant = "default" }: Props) {
  const { lang } = useLanguage();
  const coverUrl = getCoverImage(listing.listing_images ?? [], listing.cover_image_index);
  const href     = `/${listing.purpose}/${listing.slug}`;
  const isSold   = listing.status !== "disponible";

  const PURPOSE_LABEL: Record<string, { fr: string; en: string }> = {
    vente:    { fr: "Vente",     en: "Sale"     },
    location: { fr: "Location",  en: "Rental"   },
    vacances: { fr: "Vacances",  en: "Vacation" },
  };

  const STATUS_LABEL: Record<string, { fr: string; en: string }> = {
    vendu:   { fr: "Vendu",    en: "Sold"     },
    loue:    { fr: "Loué",     en: "Rented"   },
    reserve: { fr: "Réservé",  en: "Reserved" },
  };

  // Title falls back to French if no English version
  const title = lang === 'en'
    ? (listing.title_en ?? listing.title)
    : listing.title

  return (
    <Link href={href} className={`lc lc--${variant}`}>

      {/* Image */}
      <div className="lc__img-wrap">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="lc__img"
            priority={priority}
          />
        ) : (
          <div className="lc__no-img">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
        )}

        {/* Sold overlay */}
        {isSold && (
          <div className="lc__sold-overlay">
            <span className={`badge badge-${listing.status}`}>
              {STATUS_LABEL[listing.status]?.[lang] ?? listing.status}
            </span>
          </div>
        )}

        {/* Purpose + featured badges */}
        <div className="lc__badges">
          <span className="lc__purpose-badge">
            {PURPOSE_LABEL[listing.purpose]?.[lang] ?? listing.purpose}
          </span>
          {listing.is_featured && (
            <span className="lc__featured-badge">
              ★ {lang === 'fr' ? 'Coup de cœur' : 'Top pick'}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="lc__body">
        <div className="lc__location">
          <MapPin size={12} />
          {listing.city}{listing.neighborhood ? `, ${listing.neighborhood}` : ""}
        </div>

        <h3 className="lc__title">{title}</h3>

        <div className="lc__specs">
          {listing.surface && (
            <span className="lc__spec">
              <Maximize2 size={12} />
              {formatSurface(listing.surface)}
            </span>
          )}
          {listing.bedrooms && (
            <span className="lc__spec">
              <Bed size={12} />
              {listing.bedrooms} {tr(t.card.bedrooms, lang)}
            </span>
          )}
          {listing.bathrooms && (
            <span className="lc__spec">
              <Bath size={12} />
              {listing.bathrooms} {tr(t.card.bathrooms, lang)}
            </span>
          )}
        </div>

        <div className="lc__footer">
          <span className="lc__price">
            {formatPrice(listing.price, listing.price_period)}
          </span>
          <span className="lc__cta">
            {lang === 'fr' ? 'Voir →' : 'View →'}
          </span>
        </div>
      </div>

      <style>{`
        .lc {
          display: flex; flex-direction: column;
          background: var(--surface-2);
          text-decoration: none;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          border-radius: var(--r-md);
          border: 1px solid var(--border);
          height: 100%;
        }
        .lc::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: var(--r-md);
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
          pointer-events: none;
        }
        .lc:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card), var(--shadow-glow);
          border-color: var(--gold-glow);
        }
        .lc:hover::after { border-color: var(--gold-glow); }
        .lc:hover .lc__img { transform: scale(1.05); }
        .lc:hover .lc__cta { color: var(--gold); letter-spacing: 0.12em; }

        .lc__img-wrap {
          position: relative; aspect-ratio: 16/10; overflow: hidden;
          background: var(--surface-3); flex-shrink: 0;
        }
        .lc__img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .lc__no-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
        }
        .lc__sold-overlay {
          position: absolute; inset: 0;
          background: var(--overlay-dark);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(2px);
        }
        .lc__badges {
          position: absolute; top: 12px; left: 12px;
          display: flex; gap: 6px; flex-wrap: wrap; z-index: 1;
        }
        .lc__purpose-badge {
          padding: 4px 10px; border-radius: 2px;
          background: var(--overlay-dark);
          backdrop-filter: blur(8px);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold); border: 1px solid rgba(184,151,90,0.3);
        }
        .lc__featured-badge {
          padding: 4px 10px; border-radius: 2px;
          background: rgba(184,151,90,0.2);
          backdrop-filter: blur(8px);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--gold-light); border: 1px solid rgba(184,151,90,0.3);
        }
        .lc__body {
          padding: 20px; flex: 1;
          display: flex; flex-direction: column; gap: 10px;
        }
        .lc__location {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--muted);
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .lc__title {
          font-family: var(--font-display);
          font-size: 18px; font-weight: 400; color: var(--white);
          line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .lc__specs { display: flex; gap: 14px; flex-wrap: wrap; }
        .lc__spec {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--muted-2);
        }
        .lc__footer {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-top: auto; padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .lc__price {
          font-family: var(--font-display);
          font-size: 20px; font-weight: 500; color: var(--gold);
        }
        .lc__cta {
          font-size: 12px; color: var(--muted);
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.3s ease;
        }
      `}</style>
    </Link>
  );
}