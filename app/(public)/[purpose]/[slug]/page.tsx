import { getListingBySlug, getRelatedListings } from "@/lib/supabase/queries";
import { getListingMetadata, getListingStructuredData } from "@/lib/seo";
import { formatPrice, formatSurface, formatFloor, formatType, formatPurpose, formatStatus } from "@/lib/utils";
import { getListingAmenities } from "@/constants/amenities";
import type { ListingPurpose } from "@/types";
import ContactForm from "@/components/contact/ContactForm";
import ListingCard from "@/components/listings/ListingCard";
import ListingGallery from "@/components/listings/ListingGallery";
import { notFound } from "next/navigation";
import { MapPin, Maximize2, Bed, Bath, Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ purpose: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result   = await getListingBySlug(slug);
  if (!result.data) return {};
  return getListingMetadata(result.data);
}

export default async function ListingDetailPage({ params }: Props) {
  const { purpose, slug } = await params;
  const result            = await getListingBySlug(slug);

  if (!result.data) notFound();

  const listing  = result.data;
  const related  = await getRelatedListings(listing, 3);
  const amenities = getListingAmenities(listing.amenities ?? []);
  const structured = getListingStructuredData(listing);
  const { label: statusLabel, color: statusColor } = formatStatus(listing.status);
  const images = (listing.listing_images ?? []).sort((a, b) => a.order - b.order);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />

      <div className="dp-root">

        {/* ── Breadcrumb ─── */}
        <div className="dp-breadcrumb">
          <div className="container dp-breadcrumb-inner">
            <Link href={`/${purpose}`} className="dp-back">
              <ArrowLeft size={16} />
              {formatPurpose(listing.purpose)}
            </Link>
            <span className="dp-bc-sep">/</span>
            <span className="dp-bc-current">{listing.title}</span>
          </div>
        </div>

        {/* ── Gallery ─── */}
        <ListingGallery images={images} title={listing.title} />

        {/* ── Main content ─── */}
        <div className="container dp-body">

          {/* Left — details */}
          <div className="dp-main">

            {/* Header */}
            <div className="dp-header">
              <div className="dp-badges">
                <span className="dp-purpose-badge">{formatPurpose(listing.purpose)}</span>
                <span className="dp-type-badge">{formatType(listing.type)}</span>
                {listing.status !== "disponible" && (
                  <span className="dp-status-badge" style={{
                    background: statusColor.includes("green")  ? "rgba(76,175,130,0.1)"  :
                                statusColor.includes("red")    ? "rgba(224,82,82,0.1)"   :
                                                                 "rgba(201,168,76,0.1)",
                    color:      statusColor.includes("green")  ? "#4caf82"  :
                                statusColor.includes("red")    ? "#e05252"  :
                                                                 "#c9a84c",
                  }}>
                    {statusLabel}
                  </span>
                )}
              </div>

              <h1 className="dp-title">{listing.title}</h1>

              <div className="dp-location">
                <MapPin size={15} />
                <span>{listing.city}{listing.neighborhood ? `, ${listing.neighborhood}` : ""}</span>
              </div>

              <div className="dp-price">
                {formatPrice(listing.price, listing.price_period)}
              </div>
            </div>

            {/* Key specs */}
            <div className="dp-specs">
              {listing.surface && (
                <div className="dp-spec">
                  <Maximize2 size={20} />
                  <span className="dp-spec-val">{formatSurface(listing.surface)}</span>
                  <span className="dp-spec-lbl">Surface</span>
                </div>
              )}
              {listing.rooms && (
                <div className="dp-spec">
                  <Layers size={20} />
                  <span className="dp-spec-val">{listing.rooms}</span>
                  <span className="dp-spec-lbl">Pièces</span>
                </div>
              )}
              {listing.bedrooms && (
                <div className="dp-spec">
                  <Bed size={20} />
                  <span className="dp-spec-val">{listing.bedrooms}</span>
                  <span className="dp-spec-lbl">Chambres</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="dp-spec">
                  <Bath size={20} />
                  <span className="dp-spec-val">{listing.bathrooms}</span>
                  <span className="dp-spec-lbl">Sdb</span>
                </div>
              )}
              {listing.floor !== null && (
                <div className="dp-spec">
                  <span className="dp-spec-emoji">🏢</span>
                  <span className="dp-spec-val">{formatFloor(listing.floor)}</span>
                  <span className="dp-spec-lbl">Étage</span>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="dp-section">
                <h2 className="dp-section-title">Description</h2>
                <p className="dp-description">{listing.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="dp-section">
                <h2 className="dp-section-title">Équipements & Commodités</h2>
                <div className="dp-amenities">
                  {amenities.map(({ key, label }) => (
                    <span key={key} className="dp-amenity">{label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky contact */}
          <aside className="dp-aside">
            <ContactForm listing={listing} />
          </aside>
        </div>

        {/* ── Related listings ─── */}
        {(related.data?.length ?? 0) > 0 && (
          <div className="dp-related">
            <div className="container">
              <h2 className="dp-related-title">Biens similaires</h2>
              <div className="dp-related-grid stagger">
                {related.data!.map((l, i) => (
                  <div key={l.id} className="anim-fade-up">
                    <ListingCard listing={l} priority={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dp-root { padding-bottom: 0; }

        .dp-breadcrumb {
          background: var(--charcoal);
          padding: 80px 0 0;
        }
        .dp-breadcrumb-inner {
          display: flex; align-items: center; gap: 10px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .dp-back {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--terra-light);
          text-decoration: none; transition: gap 0.2s ease;
        }
        .dp-back:hover { gap: 10px; }
        .dp-bc-sep     { color: rgba(255,255,255,0.2); }
        .dp-bc-current { font-size: 13px; color: rgba(255,255,255,0.4); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; }

        /* Gallery is full-width */

        .dp-body {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          padding-top: 48px; padding-bottom: 80px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .dp-body { grid-template-columns: 1fr; }
          .dp-aside { order: -1; }
        }

        .dp-header { margin-bottom: 32px; }
        .dp-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }

        .dp-purpose-badge, .dp-type-badge, .dp-status-badge {
          font-size: 11px; font-weight: 600; padding: 4px 12px;
          border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .dp-purpose-badge {
          background: rgba(196,113,79,0.1); color: var(--terracotta);
        }
        .dp-type-badge {
          background: var(--cream-dark); color: var(--muted);
        }

        .dp-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 600; color: var(--charcoal);
          line-height: 1.15; margin-bottom: 12px;
        }
        .dp-location {
          display: flex; align-items: center; gap: 6px;
          font-size: 15px; color: var(--muted); margin-bottom: 16px;
        }
        .dp-price {
          font-family: var(--font-display);
          font-size: clamp(28px, 3vw, 38px);
          font-weight: 600; color: var(--terracotta);
        }

        .dp-specs {
          display: flex; flex-wrap: wrap; gap: 0;
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          overflow: hidden; margin-bottom: 40px;
        }
        .dp-spec {
          flex: 1; min-width: 100px;
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; padding: 20px 16px;
          border-right: 1px solid var(--border);
          background: var(--white);
          color: var(--muted);
        }
        .dp-spec:last-child { border-right: none; }
        .dp-spec-emoji { font-size: 20px; }
        .dp-spec-val {
          font-family: var(--font-display);
          font-size: 20px; font-weight: 600; color: var(--charcoal);
          text-align: center;
        }
        .dp-spec-lbl { font-size: 11px; color: var(--muted); text-align: center; }

        .dp-section { margin-bottom: 36px; }
        .dp-section-title {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 600; color: var(--charcoal);
          margin-bottom: 16px; padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .dp-description {
          font-size: 15px; color: var(--ink);
          line-height: 1.8; white-space: pre-wrap;
        }

        .dp-amenities { display: flex; flex-wrap: wrap; gap: 8px; }
        .dp-amenity {
          padding: 7px 16px; border-radius: 20px;
          background: var(--cream-dark); color: var(--ink);
          font-size: 13px; font-weight: 450;
          border: 1px solid var(--border);
        }

        .dp-aside { position: sticky; top: 90px; }

        .dp-related {
          background: var(--cream-dark);
          padding: 64px 0;
        }
        .dp-related-title {
          font-family: var(--font-display);
          font-size: 32px; font-weight: 600; color: var(--charcoal);
          margin-bottom: 32px;
        }
        .dp-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
      `}</style>
    </>
  );
}