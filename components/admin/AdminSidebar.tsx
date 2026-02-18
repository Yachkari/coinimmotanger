"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/listings",  icon: Building2,       label: "Annonces"        },
  { href: "/dashboard/listings/new", icon: PlusCircle,   label: "Nouvelle annonce"},
  { href: "/dashboard/messages",  icon: MessageSquare,   label: "Messages"        },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">◆</span>
        <span className="logo-text">Admin</span>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="sidebar-footer">
        <Link href="/" target="_blank" className="nav-item footer-link">
          <Home size={18} />
          <span>Voir le site</span>
        </Link>
        <button onClick={handleLogout} className="nav-item logout-btn">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 260px;
          height: 100vh;
          background: #141414;
          border-right: 1px solid #1f1f1f;
          display: flex;
          flex-direction: column;
          z-index: 100;
          padding: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 28px 24px 24px;
          border-bottom: 1px solid #1f1f1f;
        }
        .logo-icon {
          color: #c9a84c;
          font-size: 20px;
          line-height: 1;
        }
        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: #f5f5f5;
          letter-spacing: 0.03em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          font-weight: 450;
          text-decoration: none;
          transition: all 0.15s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }
        .nav-item:hover {
          background: #1a1a1a;
          color: #e0e0e0;
        }
        .nav-item.active {
          background: rgba(201, 168, 76, 0.12);
          color: #c9a84c;
        }
        .nav-item.active svg {
          color: #c9a84c;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid #1f1f1f;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .footer-link { color: #666; font-size: 13px; }
        .logout-btn  { color: #666; font-size: 13px; }
        .logout-btn:hover { color: #e05252; background: rgba(224,82,82,0.08); }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
        }
      `}</style>
    </aside>
  );
}