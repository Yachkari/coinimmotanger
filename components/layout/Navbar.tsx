"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";

const NAV = [
  { href: "/vente",    label: "Acheter"  },
  { href: "/location", label: "Louer"    },
  { href: "/vacances", label: "Vacances" },
  { href: "/contact",  label: "Contact"  },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
        <div className="nav__inner container">

          {/* Logo */}
          {/* <Link href="/" className="nav__logo" onClick={() => setOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1" fill="none"/>
              <path d="M12 2v20M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1"/>
            </svg>
            <span className="nav__name">
              {process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier"}
            </span>
          </Link> */}
          <Link href="/" className="nav__logo" onClick={() => setOpen(false)}>
            <Image
              src="/logo.png"
              alt={process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier"}
              width={180}
              height={180}
              className="nav__logo-img"
              priority
            />
          </Link>

          {/* Center nav */}
          <div className="nav__links">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav__link ${pathname.startsWith(href) ? "nav__link--active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="nav__actions">
            <Link href="/recherche" className="nav__search">
              <Search size={15} />
              <span>Rechercher</span>
            </Link>
            <button
              className="nav__burger"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full screen mobile menu */}
      <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu__content">
          {NAV.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className="mobile-menu__link"
              style={{ animationDelay: open ? `${0.1 + i * 0.08}s` : "0s" }}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu__num">0{i + 1}</span>
              {label}
            </Link>
          ))}
          <Link
            href="/recherche"
            className="mobile-menu__link"
            style={{ animationDelay: open ? "0.42s" : "0s" }}
            onClick={() => setOpen(false)}
          >
            <span className="mobile-menu__num">05</span>
            Rechercher
          </Link>
        </div>
        <div className="mobile-menu__footer">
          <p>{process.env.NEXT_PUBLIC_SITE_NAME} · Immobilier au Maroc</p>
        </div>
      </div>

      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          height: var(--nav-h); z-index: 500;
          transition: background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .nav--scrolled {
          background: rgba(8,8,8,0.88);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom-color: var(--border);
        }
        .nav--open { background: var(--black) !important; border-bottom-color: var(--border) !important; }

        .nav__inner {
          height: 100%;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px;
        }

        .nav__logo {
          display: flex; align-items: center; gap: 12px;
          color: var(--white); text-decoration: none; flex-shrink: 0;
        }
        .nav__logo svg { color: var(--gold); }
        .nav__name {
          font-family: var(--font-display);
          font-size: 17px; font-weight: 500;
          letter-spacing: 0.04em; color: var(--white);
        }

        .nav__links { display: flex; align-items: center; gap: 36px; }
        .nav__link {
          font-size: 13px; font-weight: 400;
          color: var(--muted-2); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase;
          position: relative; padding-bottom: 2px;
          transition: color 0.2s ease;
        }
        .nav__link::after {
          content: ''; position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1px; background: var(--gold);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav__link:hover, .nav__link--active { color: var(--white); }
        .nav__link:hover::after, .nav__link--active::after { transform: scaleX(1); }

        .nav__actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .nav__search {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 18px; border-radius: 2px;
          border: 1px solid var(--border);
          color: var(--muted-2); font-size: 12px;
          font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; text-decoration: none;
          transition: all 0.25s ease;
        }
        .nav__search:hover { border-color: var(--gold); color: var(--gold); }
        .nav__burger {
          display: none;
          background: none; border: none; color: var(--white);
          padding: 8px; cursor: pointer;
        }
          .nav__logo {
  display: flex; align-items: center;
  text-decoration: none; flex-shrink: 0;
}
.nav__logo-img {
  height: 180px; width: auto;
  object-fit: contain;
}

        /* Mobile menu */
        .mobile-menu {
          position: fixed; inset: 0; z-index: 499;
          background: var(--black);
          display: flex; flex-direction: column;
          padding-top: var(--nav-h);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-menu--open { opacity: 1; pointer-events: all; }

        .mobile-menu__content {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 0 40px; gap: 8px;
        }
        .mobile-menu__link {
          display: flex; align-items: baseline; gap: 20px;
          font-family: var(--font-display);
          font-size: clamp(32px, 7vw, 60px);
          font-weight: 400; color: var(--white);
          text-decoration: none; line-height: 1.1;
          padding: 10px 0; border-bottom: 1px solid var(--border);
          opacity: 0; transform: translateY(16px);
          transition: color 0.2s ease;
          animation: none;
        }
        .mobile-menu--open .mobile-menu__link {
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .mobile-menu__link:hover { color: var(--gold); }
        .mobile-menu__num {
          font-family: var(--font-ui);
          font-size: 11px; color: var(--gold);
          letter-spacing: 0.1em; flex-shrink: 0;
        }
        .mobile-menu__footer {
          padding: 28px 40px;
          font-size: 12px; color: var(--muted);
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        @media (max-width: 1000px) {
          .nav__links  { display: none; }
          .nav__search { display: none; }
          .nav__burger { display: flex; }
        }
      `}</style>
    </>
  );
}