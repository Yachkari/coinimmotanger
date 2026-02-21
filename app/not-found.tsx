import Link from "next/link";

export default function NotFound() {
  return (
    <div className="nf-root">
      <div className="nf-content">
        <span className="nf-num">404</span>
        <h1 className="nf-title">Page introuvable</h1>
        <p className="nf-sub">Le bien ou la page que vous cherchez n'existe pas ou a été supprimé.</p>
        <Link href="/" className="nf-btn">Retour à l'accueil</Link>
      </div>
      <style>{`
        .nf-root {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center;
          background: var(--cream); text-align: center;
          padding: 40px;
        }
        .nf-num {
          font-family: var(--font-display);
          font-size: 120px; font-weight: 700;
          color: var(--sand); display: block; line-height: 1;
          margin-bottom: 8px;
        }
        .nf-title {
          font-family: var(--font-display);
          font-size: 32px; color: var(--charcoal); margin-bottom: 12px;
        }
        .nf-sub { font-size: 15px; color: var(--muted); margin-bottom: 32px; }
        .nf-btn {
          display: inline-block; background: var(--terracotta);
          color: white; padding: 13px 28px; border-radius: 30px;
          font-size: 14px; font-weight: 500; text-decoration: none;
          transition: background 0.2s ease;
        }
        .nf-btn:hover { background: var(--terra-dark); }
      `}</style>
    </div>
  );
}