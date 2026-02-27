import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/login");

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

      <div className="shell">
        <AdminSidebar />
        <div className="shell__right">
          <main className="shell__main">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0; padding: 0;
          background: var(--black);
          font-family: 'DM Sans', sans-serif;
          color: var(--off-white);
          -webkit-font-smoothing: antialiased;
        }

        .shell {
          display: flex;
          min-height: 100vh;
          background: var(--black);
        }

        .shell__right {
          flex: 1;
          margin-left: 220px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .shell__main {
          flex: 1;
          padding: 40px 48px;
          max-width: 1200px;
        }

        /* Shared admin component styles */
        .adm-page { color: var(--off-white); max-width: 1100px; }

        .adm-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; flex-wrap: wrap;
          gap: 16px; margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .adm-eyebrow {
          font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--gold); margin-bottom: 6px; display: block;
        }
        .adm-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 400;
          color: var(--white); margin: 0 0 4px;
          line-height: 1.1;
        }
        .adm-sub { font-size: 13px; color: var(--muted); margin: 0; }

        .adm-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold); color: var(--black);
          text-decoration: none; padding: 10px 20px;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: all 0.2s ease; white-space: nowrap;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .adm-btn:hover { background: var(--gold-light); box-shadow: 0 4px 20px rgba(201,168,76,0.25); }

        .adm-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; color: var(--muted);
          text-decoration: none; padding: 9px 18px;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          border: 1px solid var(--border); cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .adm-btn-ghost:hover { border-color: var(--muted); color: var(--off-white); }

        .adm-panel {
          background: var(--surface-2);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .adm-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }
        .adm-panel-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em;
          color: var(--muted);
        }
        .adm-panel-title svg { color: var(--gold); }
        .adm-panel-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: var(--gold); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: opacity 0.15s ease;
        }
        .adm-panel-link:hover { opacity: 0.7; }

        .adm-badge {
          display: inline-block; padding: 2px 8px;
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          white-space: nowrap;
        }
        .adm-badge--green  { background: rgba(76,175,130,0.12);  color: #4caf82; }
        .adm-badge--red    { background: rgba(192,82,82,0.12);   color: #c05252; }
        .adm-badge--orange { background: rgba(224,123,82,0.12);  color: #e07b52; }
        .adm-badge--gold   { background: rgba(201,168,76,0.12);  color: var(--gold); }

        .adm-table-wrap {
          background: var(--surface-2);
          border: 1px solid var(--border);
          overflow: hidden; overflow-x: auto;
        }
        .adm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .adm-table thead tr { border-bottom: 1px solid var(--border); }
        .adm-table th {
          padding: 12px 16px; text-align: left;
          font-size: 9px; font-weight: 700;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em;
          white-space: nowrap; background: var(--surface);
        }
        .adm-table tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background 0.1s ease;
        }
        .adm-table tbody tr:last-child { border-bottom: none; }
        .adm-table tbody tr:hover { background: var(--surface-3); }
        .adm-table td { padding: 13px 16px; vertical-align: middle; color: var(--muted); }

        .adm-action-row { display: flex; align-items: center; gap: 4px; }
        .adm-action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; border: 1px solid var(--border);
          background: none; cursor: pointer; color: var(--muted);
          transition: all 0.15s ease;
        }
        .adm-action-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.08); }
        .adm-action-btn--danger:hover { border-color: rgba(192,82,82,0.4); color: #c05252; background: rgba(192,82,82,0.08); }

        .adm-stat {
          background: var(--surface-2); border: 1px solid var(--border);
          padding: 20px 24px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .adm-stat:hover { border-color: var(--muted); }
        .adm-stat__accent {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
        }
        .adm-stat__label {
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: var(--muted); margin-bottom: 10px;
        }
        .adm-stat__value {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 400; line-height: 1;
        }
        .adm-stat__icon {
          position: absolute; bottom: 16px; right: 16px;
          opacity: 0.15;
        }

        .adm-empty {
          background: var(--surface-2); border: 1px solid var(--border);
          padding: 80px 40px; text-align: center; color: var(--muted);
          font-size: 13px;
        }
        .adm-empty svg { color: var(--border); margin-bottom: 12px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .shell__right  { margin-left: 0; }
          .shell__main   { padding: 24px 20px; }
        }
      `}</style>
    </>
  );
}