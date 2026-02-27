import { getFeaturedListings, getListings } from "@/lib/supabase/queries";
import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRes, statsRes] = await Promise.all([
    getFeaturedListings(6),
    getListings({ limit: 1, orderBy: "date_desc" }),
  ]);

  const featured = featuredRes.data ?? [];
  const total    = statsRes.data?.total ?? 0;

  return (
    <div className="home page-enter">

      {/* ══════════════════════════════════════════════
          HERO — Full viewport with video background
      ══════════════════════════════════════════════ */}
      <section className="hero grain">

        {/* Video background */}
        <div className="hero__media">
          <video
            autoPlay muted loop playsInline
            className="hero__video"
            poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          >
            {/* Unsplash video of luxury architecture/Morocco */}
            <source
              src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38aaa35f6&profile_id=164&oauth2_token_id=57447761"
              type="video/mp4"
            />
          </video>
          <div className="hero__overlay" />
        </div>

        {/* Floating stats pill */}
        <div className="hero__stats-pill">
          <span className="hero__stats-dot" />
          <span>{total}+ biens disponibles</span>
        </div>

        {/* Main content */}
        <div className="container hero__content">
          <div className="hero__left">
            <p className="eyebrow" style={{ color: "var(--gold)", animationDelay: "0.2s" }}>
              Immobilier · Maroc du Nord
            </p>

            <h1 className="hero__title">
              <span className="hero__title-line">L'exception</span>
              <span className="hero__title-line hero__title-italic">à votre portée</span>
            </h1>

            <p className="hero__sub">
              Villas, appartements et maisons d'exception au nord du Maroc.
              Une sélection rigoureuse pour chaque projet de vie.
            </p>

            <div className="hero__actions">
              <Link href="/vente" className="btn btn-gold">
                Voir les biens
                <ArrowRight size={16} />
              </Link>
              <Link href="/recherche" className="btn btn-outline">
                Recherche avancée
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hero__scroll">
            <div className="hero__scroll-line" />
            <span>Défiler</span>
          </div>
        </div>

        {/* Bottom category bar */}
        <div className="hero__categories">
          <div className="container hero__categories-inner">
            {[
              { href: "/vente",    label: "Acheter",  count: "Appartements · Villas · Maisons" },
              { href: "/location", label: "Louer",    count: "Location longue durée"            },
              { href: "/vacances", label: "Vacances", count: "Séjours & courts séjours"         },
            ].map(({ href, label, count }) => (
              <Link key={href} href={href} className="hero__cat">
                <div>
                  <span className="hero__cat-label">{label}</span>
                  <span className="hero__cat-sub">{count}</span>
                </div>
                <ArrowUpRight size={16} className="hero__cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INTRO — Statement section
      ══════════════════════════════════════════════ */}
      <section className="intro">
        <div className="container intro__inner">
          <div className="intro__left reveal">
            <span className="eyebrow">Notre approche</span>
            <h2 className="intro__title">
              Chaque bien,<br />
              <em>une histoire</em>
            </h2>
          </div>
          <div className="intro__right reveal reveal-delay-2">
            <p className="intro__text">
              Nous sélectionnons chaque bien avec soin, pour garantir une expérience immobilière
              à la hauteur de vos attentes. Que vous cherchiez à acheter, louer ou passer des
              vacances au bord de la mer, nous avons le bien qu'il vous faut.
            </p>
            <div className="intro__stats">
              {[
                { val: total + "+", lbl: "Biens sélectionnés" },
                { val: "100%",      lbl: "Annonces vérifiées" },
                { val: "5★",        lbl: "Service client"     },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="intro__stat">
                  <span className="intro__stat-val gold-shimmer">{val}</span>
                  <span className="intro__stat-lbl">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED LISTINGS
      ══════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="featured">
          <div className="container">
            <div className="featured__header reveal">
              <div>
                <span className="eyebrow">Sélection</span>
                <h2 className="featured__title">Nos coups de cœur</h2>
              </div>
              <Link href="/vente" className="featured__see-all">
                Tout voir <ArrowRight size={16} />
              </Link>
            </div>

            <div className="featured__grid">
              {featured.map((listing, i) => (
                <div
                  key={listing.id}
                  className="reveal"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <ListingCard listing={listing} priority={i < 3} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          FULL-BLEED IMAGE SECTION
      ══════════════════════════════════════════════ */}
      <section className="fullbleed grain">
        <div className="fullbleed__bg" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80')`,
        }} />
        <div className="fullbleed__overlay" />
        <div className="container fullbleed__content">
          <div className="reveal">
            <span className="eyebrow">Votre projet</span>
            <h2 className="fullbleed__title">
              Vous avez un bien<br />à vendre ou louer ?
            </h2>
            <p className="fullbleed__sub">
              Estimation gratuite · Accompagnement personnalisé · Résultats rapides
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              style={{ marginTop: 32 }}
            >
              Nous contacter sur WhatsApp
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROPERTY TYPES SECTION
      ══════════════════════════════════════════════ */}
      <section className="cities">
        <div className="container">
          <div className="reveal">
            <span className="eyebrow">Nos biens</span>
            <h2 className="cities__title">Par type de bien</h2>
          </div>
          <div className="cities__grid">
            {[
              { name: "Appartements", type: "appartement", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
              { name: "Villas",       type: "villa",       img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80" },
              { name: "Riads",        type: "Ryad",        img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80" },
              { name: "Maisons",      type: "maison",      img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&q=80" },
            ].map(({ name, type, img }, i) => (
              <Link
                key={name}
                href={`/vente?type=${encodeURIComponent(type)}`}
                className="city-card reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="city-card__img" style={{ backgroundImage: `url('${img}')` }} />
                <div className="city-card__overlay" />
                <div className="city-card__content">
                  <h3 className="city-card__name">{name}</h3>
                  <span className="city-card__cta">Explorer <ArrowUpRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ══ HERO ══════════════════════════════════════════ */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        .hero__media {
          position: absolute; inset: 0; z-index: 0;
        }
        .hero__video {
          width: 100%; height: 100%;
          object-fit: cover;
          transform: scale(1.04);
          animation: heroZoom 20s ease-in-out infinite alternate;
        }
        @keyframes heroZoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.12); }
        }
        .hero__overlay {
          position: absolute; inset: 0;
           background: linear-gradient(
    to bottom,
    var(--hero-overlay-top) 0%,
    var(--hero-overlay-mid) 40%,
    var(--hero-overlay-top) 70%,
    var(--hero-overlay-bot) 100%
  );
        }

        /* Floating stats pill */
        .hero__stats-pill {
          position: absolute; top: calc(var(--nav-h) + 24px); right: 40px;
          z-index: 2;
          display: flex; align-items: center; gap: 8px;
          background: var(--hero-pill-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-hover);
          padding: 8px 16px; border-radius: 30px;
          font-size: 12px; color: var(--off-white);
          letter-spacing: 0.04em;
          animation: fadeIn 0.8s ease 1s both;
        }
        .hero__stats-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--gold);
          animation: pulse-gold 2s ease infinite;
          flex-shrink: 0;
        }

        /* Content */
        .hero__content {
          position: relative; z-index: 2;
          flex: 1;
          display: flex; align-items: flex-end;
          padding-bottom: 140px;
          padding-top: calc(var(--nav-h) + 80px);
        }
        .hero__left { max-width: 680px; }

        .hero__title {
          font-size: clamp(52px, 8vw, 104px);
          font-weight: 400; line-height: 1.0;
          margin-bottom: 24px;
          display: flex; flex-direction: column;
        }
        .hero__title-line {
          display: block;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hero__title-line:nth-child(1) { animation-delay: 0.3s; }
        .hero__title-line:nth-child(2) { animation-delay: 0.45s; }
        .hero__title-italic {
          font-style: italic; color: #b8975a !important;
        }

        .hero__sub {
          font-size: 16px; color: var(--hero-sub-color);
          line-height: 1.7; max-width: 480px;
          margin-bottom: 36px;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s both;
        }
        .hero__actions {
          display: flex; gap: 12px; flex-wrap: wrap;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.75s both;
        }

        /* Scroll indicator */
        .hero__scroll {
          position: absolute; right: 40px; bottom: 180px;
          z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
          animation: fadeIn 1s ease 1.2s both;
        }
        .hero__scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, transparent, var(--gold));
          animation: float 2.5s ease-in-out infinite;
        }
        .hero__scroll span {
          font-size: 10px; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--muted);
          writing-mode: vertical-rl;
        }

        /* Bottom category bar */
        .hero__categories {
  position: relative; z-index: 2;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(8,8,8,0.6);
  backdrop-filter: blur(20px);
}
        .hero__categories-inner {
          display: grid; grid-template-columns: repeat(3, 1fr);
        }
        .hero__cat {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 0; gap: 12px;
          border-right: 1px solid var(--border);
          padding-right: 40px; padding-left: 40px;
          text-decoration: none;
          transition: background 0.2s ease;
          animation: fadeUp 0.6s ease 1s both;
        }
        .hero__cat:last-child { border-right: none; }
        .hero__cat:hover { background: var(--hero-cat-hover); }
        .hero__cat:hover .hero__cat-arrow { color: var(--gold); transform: translate(2px,-2px); }
        .hero__cat-label {
          display: block; font-size: 16px; font-family: var(--font-display);
          font-weight: 500; color: var(--white); margin-bottom: 4px;
        }
        .hero__cat-sub {
          font-size: 12px; color: var(--muted);
          letter-spacing: 0.02em; display: block;
        }
        .hero__cat-arrow {
          color: var(--muted); flex-shrink: 0;
          transition: all 0.25s ease;
        }
        @media (max-width: 768px) {
          .hero__categories-inner { grid-template-columns: 1fr; }
          .hero__cat { border-right: none; border-bottom: 1px solid var(--border); }
          .hero__cat:last-child { border-bottom: none; }
          .hero__scroll { display: none; }
          .hero__stats-pill { right: 20px; }
        }

        /* ══ INTRO ═════════════════════════════════════════ */
        .intro { padding: 120px 0; }
        .intro__inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        @media (max-width: 768px) {
          .intro__inner { grid-template-columns: 1fr; gap: 40px; }
        }
        .intro__title {
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 400; margin-top: 8px;
        }
        .intro__title em { font-style: italic; color: var(--gold); }
        .intro__text {
          font-size: 16px; color: var(--muted-2);
          line-height: 1.8; margin-bottom: 40px;
        }
        .intro__stats { display: flex; gap: 40px; flex-wrap: wrap; }
        .intro__stat { display: flex; flex-direction: column; gap: 6px; }
        .intro__stat-val {
          font-family: var(--font-display);
          font-size: 36px; font-weight: 600;
        }
        .intro__stat-lbl { font-size: 12px; color: var(--muted); letter-spacing: 0.04em; }

        /* ══ FEATURED ══════════════════════════════════════ */
        .featured { padding: 0 0 120px; }
        .featured__header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px; flex-wrap: wrap; gap: 16px;
        }
        .featured__title {
          font-size: clamp(32px, 4vw, 48px); font-weight: 400;
          margin-top: 8px;
        }
        .featured__see-all {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--gold);
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; transition: gap 0.2s ease;
        }
        .featured__see-all:hover { gap: 14px; }
        .featured__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .featured__grid { grid-template-columns: 1fr; }
        }

        /* ══ FULLBLEED ═════════════════════════════════════ */
        .fullbleed {
          position: relative; min-height: 600px;
          display: flex; align-items: center;
          overflow: hidden; margin: 0;
        }
        .fullbleed__bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transform: scale(1.06);
          transition: transform 8s ease;
        }
        .fullbleed:hover .fullbleed__bg { transform: scale(1.0); }
        .fullbleed__overlay {
          position: absolute; inset: 0;
          background: var(--fullbleed-overlay);
        }
        .fullbleed__content {
          position: relative; z-index: 1;
          padding: 100px 40px;
        }
        .fullbleed__title {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 400; color: var(--white);
          margin: 12px 0 16px;
        }
        .fullbleed__sub {
          font-size: 14px; color: var(--muted-2);
          letter-spacing: 0.06em;
        }

        /* ══ CITIES ════════════════════════════════════════ */
        .cities { padding: 120px 0; }
        .cities__title {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 400; margin: 8px 0 48px;
        }
        .cities__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 960px) { .cities__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .cities__grid { grid-template-columns: 1fr; } }

        .city-card {
          position: relative; aspect-ratio: 3/4;
          border-radius: var(--r-md); overflow: hidden;
          text-decoration: none; display: block;
          cursor: pointer;
        }
        .city-card__img {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .city-card:hover .city-card__img { transform: scale(1.06); }
        .city-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--city-overlay-bot) 0%, var(--city-overlay-top) 60%);
          transition: background 0.3s ease;
        }
        .city-card:hover .city-card__overlay {
          background: linear-gradient(to top, var(--city-overlay-bot-h) 0%, var(--city-overlay-top-h) 60%);
        }
        .city-card__content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px; display: flex; flex-direction: column; gap: 6px;
        }
        .city-card__name {
          font-size: 22px; font-weight: 500;
          color: var(--white);
        }
        .city-card__cta {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--gold);
          letter-spacing: 0.08em; text-transform: uppercase;
          opacity: 0; transform: translateY(8px);
          transition: all 0.3s ease;
        }
        .city-card:hover .city-card__cta {
          opacity: 1; transform: translateY(0);
        }
      `}</style>
    </div>
  );
}