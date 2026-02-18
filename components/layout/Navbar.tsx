"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/vente",    label: "Acheter"   },
  { href: "/location", label: "Louer"     },
  { href: "/vacances", label: "Vacances"  },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner container">

          {/* Logo */}
          <Link href="/" className="nav-logo">
            <span className="logo-mark">◆</span>
            <span className="logo-name">{process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier"}</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname.startsWith(href) ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="nav-cta-wrap">
            <Link href="/recherche" className="nav-search-btn">
              Rechercher
            </Link>
            <button
              className="nav-burger"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="mobile-link"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/recherche" className="mobile-link cta" onClick={() => setOpen(false)}>
            Rechercher un bien
          </Link>
        </div>
      )}

      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          padding: 20px 0;
          transition: all 0.3s ease;
          background: transparent;
        }
        .nav.scrolled {
          padding: 12px 0;
          background: rgba(250,247,242,0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(26,22,20,0.08);
        }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 20px;
          font-weight: 600; color: var(--charcoal);
          text-decoration: none;
        }
        .logo-mark { color: var(--terracotta); font-size: 16px; }
        .logo-name  { letter-spacing: 0.02em; }

        .nav-links {
          display: flex; align-items: center; gap: 36px;
        }
        .nav-link {
          font-size: 14px; font-weight: 450; color: var(--ink);
          text-decoration: none; letter-spacing: 0.02em;
          position: relative; padding-bottom: 2px;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px; background: var(--terracotta);
          transition: width 0.25s ease;
        }
        .nav-link:hover, .nav-link.active { color: var(--terracotta); }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }

        .nav-cta-wrap { display: flex; align-items: center; gap: 12px; }
        .nav-search-btn {
          background: var(--terracotta); color: var(--white);
          padding: 9px 20px; border-radius: 30px;
          font-size: 13px; font-weight: 500;
          text-decoration: none; transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .nav-search-btn:hover {
          background: var(--terra-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(196,113,79,0.3);
        }
        .nav-burger {
          display: none; background: none; border: none;
          color: var(--ink); padding: 4px;
        }

        /* Mobile */
        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: var(--cream); z-index: 190;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px;
          animation: fadeIn 0.2s ease;
        }
        .mobile-link {
          font-family: var(--font-display);
          font-size: 32px; font-weight: 500; color: var(--charcoal);
          text-decoration: none; padding: 12px 24px;
          transition: color 0.2s ease;
        }
        .mobile-link:hover { color: var(--terracotta); }
        .mobile-link.cta {
          font-family: var(--font-body); font-size: 15px;
          font-weight: 500; margin-top: 16px;
          background: var(--terracotta); color: white;
          border-radius: 30px; padding: 12px 28px;
        }

        @media (max-width: 768px) {
          .nav-links  { display: none; }
          .nav-search-btn { display: none; }
          .nav-burger { display: flex; }
        }
      `}</style>
    </>
  );
}