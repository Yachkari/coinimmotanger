import { getDashboardStats, getListings, getContactMessages } from "@/lib/supabase/queries";
import { formatPrice, relativeTime } from "@/lib/utils";
import Link from "next/link";
import {
  Building2, CheckCircle2, XCircle,
  MessageSquare, Star, TrendingUp, PlusCircle, ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [statsRes, listingsRes, messagesRes] = await Promise.all([
    getDashboardStats(),
    getListings({ limit: 6, orderBy: "date_desc", status: undefined as any }),
    getContactMessages(true),
  ]);

  const stats    = statsRes.data;
  const listings = listingsRes.data?.listings ?? [];
  const messages = messagesRes.data ?? [];

  const STATS = [
    { label: "Total annonces",   value: stats?.totalListings     ?? 0, icon: Building2,    color: "#c9a84c", },
    { label: "Disponibles",      value: stats?.availableListings ?? 0, icon: CheckCircle2, color: "#4caf82", },
    { label: "Vendus / Loués",   value: (stats?.soldListings ?? 0) + (stats?.rentedListings ?? 0), icon: XCircle, color: "#e07b52", },
    { label: "En vedette",       value: stats?.featuredListings  ?? 0, icon: Star,         color: "#a07cdb", },
    { label: "Messages non lus", value: stats?.unreadMessages    ?? 0, icon: MessageSquare,color: "#52a8e0", },
  ];

  return (
    <div className="dp">

      {/* ── Header ── */}
      <div className="dp__header">
        <div>
          <span className="dp__eyebrow">◆ Tableau de bord</span>
          <h1 className="dp__title">Aperçu de l'activité</h1>
        </div>
        <Link href="/dashboard/listings/new" className="dp__cta">
          <PlusCircle size={14} />
          Nouvelle annonce
        </Link>
      </div>

      {/* ── Stat strip ── */}
      <div className="dp__stats">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="dp__stat">
            <div className="dp__stat-bar" style={{ background: color }} />
            <div className="dp__stat-icon" style={{ color }}>
              <Icon size={16} />
            </div>
            <div className="dp__stat-val" style={{ color }}>{value}</div>
            <div className="dp__stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Two panels ── */}
      <div className="dp__grid">

        {/* Recent listings */}
        <div className="dp__panel">
          <div className="dp__panel-hd">
            <span className="dp__panel-title">
              <TrendingUp size={13} />
              Annonces récentes
            </span>
            <Link href="/dashboard/listings" className="dp__panel-link">
              Tout voir <ArrowRight size={12} />
            </Link>
          </div>
          <div className="dp__list">
            {listings.length === 0
              ? <p className="dp__empty">Aucune annonce pour l'instant.</p>
              : listings.map((l) => (
                <Link key={l.id} href={`/dashboard/listings/${l.id}/edit`} className="dp__row">
                  <div className="dp__row-left">
                    <span className="dp__row-title">{l.title}</span>
                    <span className="dp__row-meta">{l.city} · {relativeTime(l.created_at)}</span>
                  </div>
                  <div className="dp__row-right">
                    <span className="dp__row-price">{formatPrice(l.price, l.price_period)}</span>
                    <span className={`dp__badge dp__badge--${l.status}`}>{l.status}</span>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        {/* Messages */}
        <div className="dp__panel">
          <div className="dp__panel-hd">
            <span className="dp__panel-title">
              <MessageSquare size={13} />
              Messages non lus
              {messages.length > 0 && <span className="dp__count">{messages.length}</span>}
            </span>
            <Link href="/dashboard/messages" className="dp__panel-link">
              Tout voir <ArrowRight size={12} />
            </Link>
          </div>
          <div className="dp__list">
            {messages.length === 0
              ? <p className="dp__empty">Aucun nouveau message.</p>
              : messages.slice(0, 6).map((m) => (
                <Link key={m.id} href="/dashboard/messages" className="dp__row dp__row--msg">
                  <div className="dp__avatar">{m.name.charAt(0).toUpperCase()}</div>
                  <div className="dp__msg-body">
                    <span className="dp__row-title">{m.name}</span>
                    <span className="dp__row-meta">{m.message.slice(0, 55)}…</span>
                  </div>
                  <span className="dp__msg-time">{relativeTime(m.created_at)}</span>
                </Link>
              ))
            }
          </div>
        </div>

      </div>

      <style>{`
        .dp { color: #d8d5cf; animation: fadeUp .3s ease both; }

        /* Header */
        .dp__header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding-bottom: 28px; margin-bottom: 28px;
          border-bottom: 1px solid #1a1a1a;
        }
        .dp__eyebrow {
          display: block; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.22em;
          color: #c9a84c; margin-bottom: 6px;
        }
        .dp__title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 400; color: #f0ece4;
          margin: 0; line-height: 1.1;
        }
        .dp__cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #c9a84c; color: #080808;
          text-decoration: none; padding: 10px 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: all .2s ease;
          border: 1px solid transparent;
        }
        .dp__cta:hover {
          background: #d4b45a;
          box-shadow: 0 0 0 3px rgba(201,168,76,.15);
        }

        /* Stats */
        .dp__stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          margin-bottom: 28px;
        }
        .dp__stat {
          background: #0f0f0f; padding: 20px 20px 18px;
          position: relative; overflow: hidden;
          transition: background .2s ease;
        }
        .dp__stat:hover { background: #111; }
        .dp__stat-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          opacity: .6;
        }
        .dp__stat-icon {
          margin-bottom: 12px; opacity: .7;
        }
        .dp__stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 400; line-height: 1;
          margin-bottom: 6px;
        }
        .dp__stat-label {
          font-size: 10px; color: #555;
          text-transform: uppercase; letter-spacing: .1em;
        }
        @media (max-width: 900px) {
          .dp__stats { grid-template-columns: repeat(3,1fr); }
        }

        /* Grid */
        .dp__grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        @media (max-width: 860px) { .dp__grid { grid-template-columns: 1fr; } }

        /* Panel */
        .dp__panel {
          background: #0f0f0f; border: 1px solid #1a1a1a;
          overflow: hidden;
        }
        .dp__panel-hd {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #161616;
          background: #0a0a0a;
        }
        .dp__panel-title {
          display: flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .16em; color: #666;
        }
        .dp__panel-title svg { color: #c9a84c; }
        .dp__panel-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 10px; color: #c9a84c; text-decoration: none;
          text-transform: uppercase; letter-spacing: .1em;
          opacity: .8; transition: opacity .15s ease;
        }
        .dp__panel-link:hover { opacity: 1; }

        .dp__count {
          background: #c9a84c; color: #080808;
          font-size: 9px; font-weight: 800;
          padding: 1px 6px; margin-left: 4px;
        }

        /* Rows */
        .dp__list { display: flex; flex-direction: column; }
        .dp__row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 18px; text-decoration: none;
          border-bottom: 1px solid #141414; gap: 12px;
          transition: background .1s ease;
        }
        .dp__row:last-child { border-bottom: none; }
        .dp__row:hover { background: rgba(255,255,255,.02); }

        .dp__row-left { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .dp__row-title {
          font-size: 13px; color: #c8c5be; font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dp__row-meta { font-size: 11px; color: #444; }

        .dp__row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
        .dp__row-price { font-size: 12px; color: #c9a84c; font-weight: 600; white-space: nowrap; }

        .dp__badge {
          font-size: 9px; font-weight: 700; padding: 2px 7px;
          text-transform: uppercase; letter-spacing: .08em;
        }
        .dp__badge--disponible { background: rgba(76,175,130,.12); color: #4caf82; }
        .dp__badge--vendu      { background: rgba(192,82,82,.12);  color: #c05252; }
        .dp__badge--loue       { background: rgba(224,123,82,.12); color: #e07b52; }
        .dp__badge--reserve    { background: rgba(201,168,76,.12); color: #c9a84c; }

        /* Message rows */
        .dp__row--msg { align-items: flex-start; }
        .dp__avatar {
          width: 32px; height: 32px; flex-shrink: 0;
          background: rgba(201,168,76,.1);
          border: 1px solid rgba(201,168,76,.2);
          color: #c9a84c; font-size: 13px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .dp__msg-body { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .dp__msg-time { font-size: 10px; color: #444; flex-shrink: 0; margin-top: 2px; }

        .dp__empty {
          padding: 36px 18px; text-align: center;
          color: #333; font-size: 12px;
          text-transform: uppercase; letter-spacing: .1em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}