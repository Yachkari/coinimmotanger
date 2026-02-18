import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";
import { formatPrice, formatSurface, listingUrl, getCoverImage, formatType } from "@/lib/utils";
import { Bed, Bath, Maximize2 } from "lucide-react";

interface Props {
  listing: Listing;
  priority?: boolean;
}

const PURPOSE_BADGE: Record<string, { label: string; color: string }> = {
  vente:    { label: "À Vendre",  color: "#c4714f" },
  location: { label: "À Louer",  color: "#5a8a6a" },
  vacances: { label: "Vacances", color: "#6a7fad" },
};

const STATUS_BADGE: Record<string, { label: string }> = {
  vendu:   { label: "Vendu"    },
  loue:    { label: "Loué"     },
  reserve: { label: "Réservé"  },
};

export default function ListingCard({ listing, priority = false }: Props) {
  const coverUrl = getCoverImage(listing.listing_images ?? [], listing.cover_image_index);
  const badge    = PURPOSE_BADGE[listing.purpose];
  const status   = STATUS_BADGE[listing.status];
  const href     = listingUrl(listing.purpose, listing.slug);

  return (
    <Link href={href} className="card">
      {/* Image */}
      <div className="card-img-wrap">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="card-img"
            priority={priority}
          />
        ) : (
          <div className="card-img-placeholder">
            <span>◆</span>
          </div>
        )}

        {/* Purpose badge */}
        <span
          className="card-badge"
          style={{ background: badge.color }}
        >
          {badge.label}
        </span>

        {/* Sold/rented overlay */}
        {status && (
          <div className="card-status-overlay">
            <span>{status.label}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="card-body">
        <p className="card-type">{formatType(listing.type)} · {listing.city}{listing.neighborhood ? `, ${listing.neighborhood}` : ""}</p>
        <h3 className="card-title">{listing.title}</h3>

        <div className="card-specs">
          {listing.surface && (
            <span className="spec">
              <Maximize2 size={13} />
              {formatSurface(listing.surface)}
            </span>
          )}
          {listing.bedrooms && (
            <span className="spec">
              <Bed size={13} />
              {listing.bedrooms} ch.
            </span>
          )}
          {listing.bathrooms && (
            <span className="spec">
              <Bath size={13} />
              {listing.bathrooms} sdb.
            </span>
          )}
        </div>

        <div className="card-footer">
          <span className="card-price">
            {formatPrice(listing.price, listing.price_period)}
          </span>
          <span className="card-arrow">→</span>
        </div>
      </div>

      <style>{`
        .card {
          display: flex; flex-direction: column;
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          border: 1px solid var(--border);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--sand);
        }
        .card:hover .card-img { transform: scale(1.04); }
        .card:hover .card-arrow { transform: translateX(4px); color: var(--terracotta); }

        .card-img-wrap {
          position: relative; aspect-ratio: 4/3; overflow: hidden;
          background: var(--cream-dark);
        }
        .card-img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .card-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: var(--sand); font-size: 32px;
        }

        .card-badge {
          position: absolute; top: 14px; left: 14px;
          color: white; font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 20px;
          letter-spacing: 0.04em; text-transform: uppercase;
        }

        .card-status-overlay {
          position: absolute; inset: 0;
          background: rgba(26,22,20,0.55);
          display: flex; align-items: center; justify-content: center;
        }
        .card-status-overlay span {
          background: rgba(26,22,20,0.8);
          color: white; font-size: 13px; font-weight: 600;
          padding: 8px 20px; border-radius: 30px;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .card-type  { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .card-title {
          font-family: var(--font-display);
          font-size: 18px; font-weight: 600; color: var(--charcoal);
          line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        .card-specs {
          display: flex; gap: 14px; flex-wrap: wrap;
          margin-top: 4px;
        }
        .spec {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--muted);
        }

        .card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: auto; padding-top: 12px;
          border-top: 1px solid var(--cream-dark);
        }
        .card-price {
          font-family: var(--font-display);
          font-size: 18px; font-weight: 600; color: var(--terracotta);
        }
        .card-arrow {
          font-size: 18px; color: var(--muted);
          transition: all 0.25s ease;
        }
      `}</style>
    </Link>
  );
}