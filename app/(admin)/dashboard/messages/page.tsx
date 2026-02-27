import { getContactMessages } from "@/lib/supabase/queries";
import { relativeTime } from "@/lib/utils";
import MarkReadButton from "@/components/admin/MarkReadButton";
import { MessageSquare, Mail, Phone, Home } from "lucide-react";
import DeleteMessageButton from "@/components/admin/DeleteMessageButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const result   = await getContactMessages();
  const messages = result.data ?? [];
  const unread   = messages.filter((m) => !m.is_read).length;

  return (
    <div className="mp">

      {/* Header */}
      <div className="mp__header">
        <div>
          <span className="mp__eyebrow">◆ Boîte de réception</span>
          <h1 className="mp__title">Messages</h1>
          <p className="mp__sub">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
            {unread > 0 && <> · <span className="mp__unread-count">{unread} non lu{unread !== 1 ? "s" : ""}</span></>}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="mp__empty">
          <MessageSquare size={28} strokeWidth={1} />
          <p>Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="mp__list">
          {messages.map((m) => (
            <div key={m.id} className={`mp__card ${m.is_read ? "" : "mp__card--unread"}`}>

              {/* Card header */}
              <div className="mp__card-hd">
                <div className="mp__sender">
                  <div className="mp__avatar">{m.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="mp__name">{m.name}</div>
                    <div className="mp__time">{relativeTime(m.created_at)}</div>
                  </div>
                </div>
                <div className="mp__hd-right">
                  {!m.is_read && <span className="mp__dot" title="Non lu" />}
                  <MarkReadButton id={m.id} isRead={m.is_read} />
                  <DeleteMessageButton id={m.id} />
                </div>
              </div>

              {/* Meta row */}
              <div className="mp__meta">
                <a href={`mailto:${m.email}`} className="mp__meta-item">
                  <Mail size={12} /> {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="mp__meta-item">
                    <Phone size={12} /> {m.phone}
                  </a>
                )}
                {m.listing_title && (
                  <span className="mp__meta-item mp__meta-item--listing">
                    <Home size={12} /> {m.listing_title}
                  </span>
                )}
              </div>

              {/* Body */}
              <p className="mp__body">{m.message}</p>

              {/* Reply */}
              <a
                href={`mailto:${m.email}?subject=Re: Votre demande${m.listing_title ? ` — ${m.listing_title}` : ""}`}
                className="mp__reply"
              >
                Répondre par email
              </a>

            </div>
          ))}
        </div>
      )}

      <style>{`
       .mp { color: var(--off-white); max-width: 760px; animation: fadeUp .3s ease both; }

.mp__header {
  padding-bottom: 28px; margin-bottom: 28px;
  border-bottom: 1px solid var(--border);
}
.mp__eyebrow {
  display: block; font-size: 9px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .22em;
  color: var(--gold); margin-bottom: 6px;
}
.mp__title {
  font-family: 'Playfair Display', serif;
  font-size: 28px; font-weight: 400; color: var(--white);
  margin: 0 0 4px; line-height: 1.1;
}
.mp__sub { font-size: 13px; color: var(--muted); margin: 0; }
.mp__unread-count { color: var(--gold); }

.mp__empty {
  background: var(--surface); border: 1px solid var(--border);
  padding: 80px 40px; text-align: center;
  color: var(--muted); font-size: 12px;
  text-transform: uppercase; letter-spacing: .12em;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}

.mp__list { display: flex; flex-direction: column; gap: 10px; }

.mp__card {
  background: var(--surface); border: 1px solid var(--border);
  padding: 22px 24px;
  transition: border-color .2s ease;
  position: relative; overflow: hidden;
}
.mp__card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: transparent;
  transition: background .2s ease;
}
.mp__card--unread { border-color: var(--border); }
.mp__card--unread::before { background: var(--gold); }
.mp__card:hover { border-color: var(--muted); }

.mp__card-hd {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.mp__sender { display: flex; align-items: center; gap: 12px; }
.mp__avatar {
  width: 36px; height: 36px; flex-shrink: 0;
  background: rgba(201,168,76,.08);
  border: 1px solid rgba(201,168,76,.2);
  color: var(--gold); font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.mp__name { font-size: 14px; color: var(--off-white); font-weight: 500; margin-bottom: 2px; }
.mp__time { font-size: 11px; color: var(--muted); }

.mp__hd-right { display: flex; align-items: center; gap: 10px; }
.mp__dot { width: 7px; height: 7px; background: var(--gold); }

.mp__meta {
  display: flex; flex-wrap: wrap; gap: 16px;
  padding: 12px 0; margin-bottom: 14px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.mp__meta-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--muted); text-decoration: none;
  transition: color .15s ease;
}
.mp__meta-item:hover { color: var(--gold); }
.mp__meta-item--listing { color: var(--muted); cursor: default; }
.mp__meta-item--listing:hover { color: var(--muted); }

.mp__body {
  font-size: 14px; color: var(--off-white); line-height: 1.75;
  margin: 0 0 18px; white-space: pre-wrap;
}

.mp__reply {
  display: inline-block; padding: 7px 14px;
  background: rgba(201,168,76,.07);
  border: 1px solid rgba(201,168,76,.2);
  color: var(--gold); text-decoration: none;
  font-size: 11px; font-weight: 600;
  letter-spacing: .08em; text-transform: uppercase;
  transition: all .15s ease;
}
.mp__reply:hover { background: rgba(201,168,76,.14); }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
      `}</style>
    </div>
  );
}