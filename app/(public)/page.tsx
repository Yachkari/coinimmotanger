import { getFeaturedListings } from "@/lib/supabase/queries";
import ListingCard from "@/components/listings/ListingCard";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result   = await getFeaturedListings(6);
  const featured = result.data ?? [];

  return (
    <div className="home">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
        </div>

        <div className="container hero-content">
          <div className="hero-text anim-fade-up">
            <span className="hero-eyebrow">Immobilier au Maroc</span>
            <h1 className="hero-title">
              Trouvez le bien
              <em> de vos rêves</em>
            </h1>
            <p className="hero-subtitle">
              Appartements, villas et maisons à vendre, à louer ou en vacances.
              Une sélection exclusive pour chaque projet de vie.
            </p>
          </div>

          {/* Search bar */}
          <div className="hero-search anim-fade-up" style={{ animationDelay: "0.15s" }}>
            <Link href="/vente"    className="search-pill active">Acheter</Link>
            <Link href="/location" className="search-pill">Louer</Link>
            <Link href="/vacances" className="search-pill">Vacances</Link>
            <Link href="/recherche" className="search-btn">
              <Search size={16} />
              Rechercher
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats anim-fade-up stagger" style={{ animationDelay: "0.25s" }}>
            {[
              { value: "20+",   label: "Biens disponibles" },
              { value: "100%",  label: "Annonces vérifiées" },
              { value: "5★",    label: "Service client"     },
            ].map(({ value, label }) => (
              <div key={label} className="stat">
                <span className="stat-val">{value}</span>
                <span className="stat-lbl">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-hint">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* ── Category cards ─────────────────────────────────── */}
      <section className="categories">
        <div className="container">
          <div className="categories-grid stagger">
            {[
              {
                href:    "/vente",
                label:   "Acheter",
                sub:     "Appartements, villas et maisons",
                emoji:   "🏛",
                color:   "var(--terracotta)",
                bg:      "rgba(196,113,79,0.06)",
              },
              {
                href:    "/location",
                label:   "Louer",
                sub:     "Location longue durée",
                emoji:   "🔑",
                color:   "#5a8a6a",
                bg:      "rgba(90,138,106,0.06)",
              },
              {
                href:    "/vacances",
                label:   "Vacances",
                sub:     "Séjours courte durée",
                emoji:   "☀️",
                color:   "#6a7fad",
                bg:      "rgba(106,127,173,0.06)",
              },
            ].map(({ href, label, sub, emoji, color, bg }) => (
              <Link key={href} href={href} className="cat-card anim-fade-up" style={{ "--accent": color, "--accent-bg": bg } as React.CSSProperties}>
                <span className="cat-emoji">{emoji}</span>
                <div>
                  <h3 className="cat-label">{label}</h3>
                  <p className="cat-sub">{sub}</p>
                </div>
                <ArrowRight size={18} className="cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured listings ──────────────────────────────── */}
      {featured.length > 0 && (
        <section className="featured">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Sélection</span>
                <h2 className="section-title">Nos meilleures annonces</h2>
              </div>
              <Link href="/vente" className="section-link">
                Tout voir <ArrowRight size={16} />
              </Link>
            </div>

            <div className="listings-grid stagger">
              {featured.map((listing, i) => (
                <div key={listing.id} className="anim-fade-up">
                  <ListingCard listing={listing} priority={i < 3} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA banner ─────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2 className="cta-title">Vous avez un bien à vendre ou louer ?</h2>
              <p className="cta-sub">Contactez-nous pour une estimation gratuite et confidentielle.</p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <style>{`
        /* ── Hero ─────────────────────────────────────── */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          position: relative; overflow: hidden;
          padding: 120px 0 80px;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .hero-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(
            135deg,
            var(--cream) 0%,
            var(--cream-dark) 40%,
            #e8ddd0 100%
          );
        }
        .hero-pattern {
          position: absolute; inset: 0; opacity: 0.4;
          background-image: radial-gradient(var(--sand) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .hero-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 40px;
          max-width: 720px;
        }
        .hero-eyebrow {
          font-size: 12px; font-weight: 600; color: var(--terracotta);
          text-transform: uppercase; letter-spacing: 0.12em;
          display: block; margin-bottom: 16px;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 600; line-height: 1.05;
          color: var(--charcoal);
        }
        .hero-title em {
          font-style: italic; color: var(--terracotta);
          display: block;
        }
        .hero-subtitle {
          font-size: 18px; color: var(--muted);
          line-height: 1.7; max-width: 500px;
          margin-top: -16px;
        }

        .hero-search {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap;
        }
        .search-pill {
          padding: 10px 20px; border-radius: 30px;
          font-size: 14px; font-weight: 500;
          background: var(--white); border: 1.5px solid var(--border);
          color: var(--muted); text-decoration: none;
          transition: all 0.2s ease;
        }
        .search-pill:hover, .search-pill.active {
          border-color: var(--terracotta);
          color: var(--terracotta);
          background: rgba(196,113,79,0.06);
        }
        .search-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 24px; border-radius: 30px;
          background: var(--terracotta); color: white;
          font-size: 14px; font-weight: 500;
          text-decoration: none; transition: all 0.2s ease;
          margin-left: 8px;
        }
        .search-btn:hover {
          background: var(--terra-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(196,113,79,0.3);
        }

        .hero-stats {
          display: flex; gap: 40px; flex-wrap: wrap;
        }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat-val {
          font-family: var(--font-display);
          font-size: 32px; font-weight: 600; color: var(--charcoal);
        }
        .stat-lbl { font-size: 13px; color: var(--muted); }

        .scroll-hint {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center;
        }
        .scroll-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--terracotta); opacity: 0.6;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(8px); opacity: 0.2; }
        }

        /* ── Categories ─────────────────────────────── */
        .categories { padding: 64px 0; }
        .categories-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: 1fr; }
        }
        .cat-card {
          display: flex; align-items: center; gap: 20px;
          padding: 28px 24px; border-radius: var(--radius-lg);
          background: var(--white); border: 1.5px solid var(--border);
          text-decoration: none; transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .cat-card::before {
          content: ''; position: absolute; inset: 0;
          background: var(--accent-bg); opacity: 0;
          transition: opacity 0.25s ease;
        }
        .cat-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .cat-card:hover::before { opacity: 1; }
        .cat-card:hover .cat-arrow { transform: translateX(4px); color: var(--accent); }
        .cat-emoji { font-size: 32px; position: relative; z-index: 1; }
        .cat-label {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 600; color: var(--charcoal);
          position: relative; z-index: 1;
        }
        .cat-sub { font-size: 13px; color: var(--muted); position: relative; z-index: 1; }
        .cat-arrow { margin-left: auto; color: var(--muted); transition: all 0.25s ease; position: relative; z-index: 1; }

        /* ── Featured ───────────────────────────────── */
        .featured { padding: 0 0 80px; }
        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 40px; flex-wrap: wrap; gap: 16px;
        }
        .section-eyebrow {
          display: block; font-size: 11px; font-weight: 600;
          color: var(--terracotta); text-transform: uppercase;
          letter-spacing: 0.12em; margin-bottom: 8px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 40px); font-weight: 600;
          color: var(--charcoal);
        }
        .section-link {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 500; color: var(--terracotta);
          text-decoration: none; transition: gap 0.2s ease;
          white-space: nowrap;
        }
        .section-link:hover { gap: 10px; }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        @media (max-width: 480px) {
          .listings-grid { grid-template-columns: 1fr; }
        }

        /* ── CTA banner ──────────────────────────────── */
        .cta-banner {
          background: var(--charcoal);
          padding: 64px 0; margin-bottom: -80px;
        }
        .cta-inner {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 28px;
        }
        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(22px, 3vw, 32px); color: var(--cream);
          font-weight: 600; margin-bottom: 8px;
        }
        .cta-sub { font-size: 15px; color: var(--muted); }
        .cta-btn {
          display: inline-block; padding: 14px 32px;
          background: var(--terracotta); color: white;
          border-radius: 30px; font-size: 15px; font-weight: 500;
          text-decoration: none; white-space: nowrap;
          transition: all 0.2s ease;
        }
        .cta-btn:hover {
          background: var(--terra-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(196,113,79,0.4);
        }
      `}</style>
    </div>
  );
}