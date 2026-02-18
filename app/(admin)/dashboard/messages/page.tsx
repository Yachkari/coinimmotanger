import { getContactMessages } from "@/lib/supabase/queries";
import { relativeTime } from "@/lib/utils";
import DeleteMessageButton from "@/components/admin/DeleteMessageButton";
import MarkReadButton from "@/components/admin/MarkReadButton";
import { MessageSquare, Mail, Phone, Home } from "lucide-react";


export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const result   = await getContactMessages();
  const messages = result.data ?? [];
  const unread   = messages.filter((m) => !m.is_read).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="page-sub">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
            {unread > 0 && ` · ${unread} non lu${unread !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="empty-panel">
          <MessageSquare size={32} />
          <p>Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((m) => (
            <div key={m.id} className={`msg-card ${m.is_read ? "read" : "unread"}`}>

              {/* Header */}
              <div className="msg-card-header">
                <div className="msg-sender">
                  <div className="msg-avatar">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="msg-name">{m.name}</div>
                    <div className="msg-time">{relativeTime(m.created_at)}</div>
                  </div>
                </div>

                <div className="msg-actions">
                  {!m.is_read && <span className="unread-dot" />}
                  <MarkReadButton id={m.id} isRead={m.is_read} />
                   <DeleteMessageButton id={m.id} />
                </div>
              </div>

              {/* Contact info */}
              <div className="msg-meta">
                <a href={`mailto:${m.email}`} className="msg-meta-item">
                  <Mail size={13} /> {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="msg-meta-item">
                    <Phone size={13} /> {m.phone}
                  </a>
                )}
                {m.listing_title && (
                  <span className="msg-meta-item listing">
                    <Home size={13} /> {m.listing_title}
                  </span>
                )}
              </div>

              {/* Message body */}
              <p className="msg-body">{m.message}</p>

              {/* Reply CTA */}
              <a
                href={`mailto:${m.email}?subject=Re: Votre demande${m.listing_title ? ` — ${m.listing_title}` : ""}`}
                className="msg-reply-btn"
              >
                Répondre par email
              </a>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600&family=Playfair+Display:wght@600&display=swap');

        .page { font-family: 'DM Sans', sans-serif; color: #e0e0e0; max-width: 800px; }
        .page-header { margin-bottom: 28px; }
        .page-title  { font-family: 'Playfair Display', serif; font-size: 28px; color: #f0f0f0; margin-bottom: 4px; }
        .page-sub    { font-size: 14px; color: #555; }

        .empty-panel {
          background: #141414; border: 1px solid #1f1f1f; border-radius: 12px;
          padding: 60px; text-align: center; color: #555;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }

        .messages-list { display: flex; flex-direction: column; gap: 12px; }

        .msg-card {
          background: #141414; border: 1px solid #1f1f1f;
          border-radius: 12px; padding: 24px; transition: border-color 0.15s ease;
        }
        .msg-card.unread { border-color: rgba(201,168,76,0.25); }
        .msg-card:hover  { border-color: #2a2a2a; }

        .msg-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .msg-sender { display: flex; align-items: center; gap: 12px; }
        .msg-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(201,168,76,0.15); color: #c9a84c;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 600; flex-shrink: 0;
        }
        .msg-name { font-size: 15px; color: #e0e0e0; font-weight: 500; }
        .msg-time { font-size: 12px; color: #555; margin-top: 2px; }

        .msg-actions { display: flex; align-items: center; gap: 10px; }
        .unread-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #c9a84c;
        }

        .msg-meta {
          display: flex; flex-wrap: wrap; gap: 16px;
          margin-bottom: 14px; padding-bottom: 14px;
          border-bottom: 1px solid #1a1a1a;
        }
        .msg-meta-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #888; text-decoration: none;
        }
        .msg-meta-item:hover { color: #c9a84c; }
        .msg-meta-item.listing { color: #555; }

        .msg-body {
          font-size: 14px; color: #c0c0c0; line-height: 1.7;
          margin-bottom: 16px; white-space: pre-wrap;
        }

        .msg-reply-btn {
          display: inline-block; padding: 8px 16px; border-radius: 7px;
          background: rgba(201,168,76,0.1); color: #c9a84c;
          text-decoration: none; font-size: 13px; font-weight: 500;
          border: 1px solid rgba(201,168,76,0.2);
          transition: all 0.15s ease;
        }
        .msg-reply-btn:hover { background: rgba(201,168,76,0.18); }
      `}</style>
    </div>
  );
}