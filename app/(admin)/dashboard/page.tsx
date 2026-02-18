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
    getListings({ limit: 5, orderBy: "date_desc", status: undefined as any }),
    getContactMessages(true), // unread only
  ]);

  const stats    = statsRes.data;
  const listings = listingsRes.data?.listings ?? [];
  const messages = messagesRes.data ?? [];

  const STAT_CARDS = [
    {
      label: "Total annonces",
      value: stats?.totalListings     ?? 0,
      icon:  Building2,
      color: "#c9a84c",
      bg:    "rgba(201,168,76,0.08)",
    },
    {
      label: "Disponibles",
      value: stats?.availableListings ?? 0,
      icon:  CheckCircle2,
      color: "#4caf82",
      bg:    "rgba(76,175,130,0.08)",
    },
    {
      label: "Vendus / Loués",
      value: (stats?.soldListings ?? 0) + (stats?.rentedListings ?? 0),
      icon:  XCircle,
      color: "#e07b52",
      bg:    "rgba(224,123,82,0.08)",
    },
    {
      label: "En vedette",
      value: stats?.featuredListings  ?? 0,
      icon:  Star,
      color: "#a07cdb",
      bg:    "rgba(160,124,219,0.08)",
    },
    {
      label: "Messages non lus",
      value: stats?.unreadMessages    ?? 0,
      icon:  MessageSquare,
      color: "#52a8e0",
      bg:    "rgba(82,168,224,0.08)",
    },
  ];

  return (
    <div className="dash">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Tableau de bord</h1>
          <p className="dash-sub">Bienvenue — voici un aperçu de votre activité</p>
        </div>
        <Link href="/dashboard/listings/new" className="dash-cta">
          <PlusCircle size={16} />
          Nouvelle annonce
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg, color }}>
              <Icon size={20} />
            </div>
            <div className="stat-body">
              <div className="stat-value" style={{ color }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two column section */}
      <div className="dash-grid">

        {/* Recent listings */}
        <div className="dash-panel">
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={16} />
              Annonces récentes
            </div>
            <Link href="/dashboard/listings" className="panel-link">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>

          <div className="listing-list">
            {listings.length === 0 && (
              <p className="empty-state">Aucune annonce pour l'instant.</p>
            )}
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/dashboard/listings/${l.id}/edit`}
                className="listing-row"
              >
                <div className="listing-row-info">
                  <span className="listing-row-title">{l.title}</span>
                  <span className="listing-row-meta">
                    {l.city} · {relativeTime(l.created_at)}
                  </span>
                </div>
                <div className="listing-row-right">
                  <span className="listing-row-price">
                    {formatPrice(l.price, l.price_period)}
                  </span>
                  <span
                    className={`listing-row-badge ${l.status}`}
                  >
                    {l.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Unread messages */}
        <div className="dash-panel">
          <div className="panel-header">
            <div className="panel-title">
              <MessageSquare size={16} />
              Messages non lus
              {messages.length > 0 && (
                <span className="badge-count">{messages.length}</span>
              )}
            </div>
            <Link href="/dashboard/messages" className="panel-link">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>

          <div className="message-list">
            {messages.length === 0 && (
              <p className="empty-state">Aucun nouveau message.</p>
            )}
            {messages.slice(0, 5).map((m) => (
              <Link
                key={m.id}
                href="/dashboard/messages"
                className="message-row"
              >
                <div className="msg-avatar">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="msg-body">
                  <span className="msg-name">{m.name}</span>
                  <span className="msg-preview">{m.message.slice(0, 60)}…</span>
                </div>
                <span className="msg-time">{relativeTime(m.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600&family=Playfair+Display:wght@600&display=swap');

        .dash { font-family: 'DM Sans', sans-serif; color: #e0e0e0; max-width: 1100px; }

        .dash-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; flex-wrap: wrap;
          gap: 16px; margin-bottom: 32px;
        }
        .dash-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; color: #f0f0f0; margin-bottom: 4px;
        }
        .dash-sub { font-size: 14px; color: #555; }

        .dash-cta {
          display: flex; align-items: center; gap: 8px;
          background: #c9a84c; color: #0a0a0a;
          text-decoration: none; padding: 10px 18px;
          border-radius: 8px; font-size: 14px; font-weight: 600;
          transition: all 0.15s ease; white-space: nowrap;
        }
        .dash-cta:hover { background: #d4b45a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.25); }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px; margin-bottom: 28px;
        }
        .stat-card {
          background: #141414; border: 1px solid #1f1f1f;
          border-radius: 12px; padding: 20px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.15s ease;
        }
        .stat-card:hover { border-color: #2a2a2a; }
        .stat-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-value { font-size: 26px; font-weight: 600; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 12px; color: #555; }

        /* Two-column grid */
        .dash-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }

        .dash-panel {
          background: #141414; border: 1px solid #1f1f1f;
          border-radius: 12px; overflow: hidden;
        }
        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-bottom: 1px solid #1f1f1f;
        }
        .panel-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; color: #c0c0c0;
        }
        .panel-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: #c9a84c; text-decoration: none;
        }
        .panel-link:hover { color: #d4b45a; }

        .badge-count {
          background: #c9a84c; color: #0a0a0a;
          font-size: 11px; font-weight: 700;
          padding: 1px 7px; border-radius: 20px; margin-left: 4px;
        }

        /* Listing rows */
        .listing-list { display: flex; flex-direction: column; }
        .listing-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; text-decoration: none;
          border-bottom: 1px solid #1a1a1a; gap: 12px;
          transition: background 0.1s ease;
        }
        .listing-row:last-child { border-bottom: none; }
        .listing-row:hover { background: #1a1a1a; }
        .listing-row-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .listing-row-title { font-size: 13px; color: #d0d0d0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .listing-row-meta  { font-size: 11px; color: #555; }
        .listing-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .listing-row-price { font-size: 12px; color: #c9a84c; font-weight: 500; white-space: nowrap; }
        .listing-row-badge {
          font-size: 10px; font-weight: 600; padding: 2px 8px;
          border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .listing-row-badge.disponible { background: rgba(76,175,130,0.15); color: #4caf82; }
        .listing-row-badge.vendu      { background: rgba(224,82,82,0.15);  color: #e05252; }
        .listing-row-badge.loue       { background: rgba(224,123,82,0.15); color: #e07b52; }
        .listing-row-badge.reserve    { background: rgba(201,168,76,0.15); color: #c9a84c; }

        /* Message rows */
        .message-list { display: flex; flex-direction: column; }
        .message-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px; text-decoration: none;
          border-bottom: 1px solid #1a1a1a;
          transition: background 0.1s ease;
        }
        .message-row:last-child { border-bottom: none; }
        .message-row:hover { background: #1a1a1a; }
        .msg-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(201,168,76,0.15); color: #c9a84c;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; flex-shrink: 0;
        }
        .msg-body { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .msg-name    { font-size: 13px; color: #d0d0d0; font-weight: 500; }
        .msg-preview { font-size: 12px; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .msg-time    { font-size: 11px; color: #444; flex-shrink: 0; }

        .empty-state { padding: 32px 20px; text-align: center; color: #444; font-size: 13px; }
      `}</style>
    </div>
  );
}