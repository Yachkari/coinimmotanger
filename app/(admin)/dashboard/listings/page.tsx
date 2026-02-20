import { getListings } from "@/lib/supabase/queries";
import { formatPrice, formatStatus, relativeTime } from "@/lib/utils";
import Link from "next/link";
import { PlusCircle, Pencil, Eye } from "lucide-react";
import DeleteListingButton from "@/components/admin/DeleteListingButton";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const result   = await getListings({ limit: 100, orderBy: "date_desc", status: undefined as any });
  const listings = result.data?.listings ?? [];

  return (
    <div className="lp">

      {/* Header */}
      <div className="lp__header">
        <div>
          <span className="lp__eyebrow">◆ Gestion</span>
          <h1 className="lp__title">Annonces</h1>
          <p className="lp__sub">{listings.length} bien{listings.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/dashboard/listings/new" className="lp__cta">
          <PlusCircle size={14} />
          Nouvelle annonce
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="lp__empty">
          <p>Aucune annonce. Commencez par en créer une.</p>
          <Link href="/dashboard/listings/new" className="lp__cta" style={{ marginTop: 20 }}>
            Créer une annonce
          </Link>
        </div>
      ) : (
        <div className="lp__table-wrap">
          <table className="lp__table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Objectif</th>
                <th>Ville</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Créé</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => {
                const { label, color } = formatStatus(l.status);
                const badgeMod =
                  color.includes("green")  ? "green"  :
                  color.includes("red")    ? "red"    :
                  color.includes("orange") ? "orange" : "gold";

                return (
                  <tr key={l.id}>
                    <td className="lp__td-title">
                      <span className="lp__title-text">{l.title}</span>
                      {l.is_featured && <span className="lp__featured">★</span>}
                    </td>
                    <td className="lp__td-dim">{l.type}</td>
                    <td className="lp__td-dim">{l.purpose}</td>
                    <td className="lp__td-dim">{l.city}</td>
                    <td className="lp__td-price">{formatPrice(l.price, l.price_period)}</td>
                    <td>
                      <span className={`lp__badge lp__badge--${badgeMod}`}>{label}</span>
                    </td>
                    <td className="lp__td-dim lp__td-time">{relativeTime(l.created_at)}</td>
                    <td>
                      <div className="lp__actions">
                        <Link href={`/${l.purpose}/${l.slug}`} target="_blank" className="lp__action" title="Voir">
                          <Eye size={14} />
                        </Link>
                        <Link href={`/dashboard/listings/${l.id}/edit`} className="lp__action" title="Modifier">
                          <Pencil size={14} />
                        </Link>
                        <DeleteListingButton id={l.id} title={l.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .lp { color: #d8d5cf; animation: fadeUp .3s ease both; }

        .lp__header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding-bottom: 28px; margin-bottom: 28px;
          border-bottom: 1px solid #1a1a1a;
        }
        .lp__eyebrow {
          display: block; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .22em;
          color: #c9a84c; margin-bottom: 6px;
        }
        .lp__title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 400; color: #f0ece4;
          margin: 0 0 4px; line-height: 1.1;
        }
        .lp__sub { font-size: 13px; color: #555; margin: 0; }

        .lp__cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #c9a84c; color: #080808;
          text-decoration: none; padding: 10px 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          transition: all .2s ease; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .lp__cta:hover { background: #d4b45a; box-shadow: 0 0 0 3px rgba(201,168,76,.15); }

        .lp__empty {
          background: #0f0f0f; border: 1px solid #1a1a1a;
          padding: 80px 40px; text-align: center; color: #444;
          font-size: 13px; display: flex; flex-direction: column; align-items: center;
        }

        /* Table */
        .lp__table-wrap {
          background: #0f0f0f; border: 1px solid #1a1a1a;
          overflow: hidden; overflow-x: auto;
        }
        .lp__table { width: 100%; border-collapse: collapse; font-size: 13px; }

        .lp__table thead tr { border-bottom: 1px solid #1a1a1a; }
        .lp__table th {
          padding: 11px 16px; text-align: left;
          font-size: 9px; font-weight: 700; color: #444;
          text-transform: uppercase; letter-spacing: .15em;
          white-space: nowrap; background: #0a0a0a;
        }

        .lp__table tbody tr { border-bottom: 1px solid #141414; transition: background .1s ease; }
        .lp__table tbody tr:last-child { border-bottom: none; }
        .lp__table tbody tr:hover { background: rgba(255,255,255,.018); }
        .lp__table td { padding: 13px 16px; vertical-align: middle; }

        .lp__td-title { min-width: 220px; }
        .lp__title-text { color: #c8c5be; font-weight: 500; }
        .lp__featured { color: #c9a84c; margin-left: 7px; font-size: 11px; }

        .lp__td-dim   { color: #555; }
        .lp__td-price { color: #c9a84c; font-weight: 600; white-space: nowrap; }
        .lp__td-time  { white-space: nowrap; }

        .lp__badge {
          display: inline-block; padding: 2px 8px;
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .1em; white-space: nowrap;
        }
        .lp__badge--green  { background: rgba(76,175,130,.12); color: #4caf82; }
        .lp__badge--red    { background: rgba(192,82,82,.12);  color: #c05252; }
        .lp__badge--orange { background: rgba(224,123,82,.12); color: #e07b52; }
        .lp__badge--gold   { background: rgba(201,168,76,.12); color: #c9a84c; }

        .lp__actions { display: flex; align-items: center; gap: 4px; }
        .lp__action {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; border: 1px solid #1f1f1f;
          background: none; cursor: pointer; color: #555;
          transition: all .15s ease;
        }
        .lp__action:hover { border-color: #c9a84c; color: #c9a84c; background: rgba(201,168,76,.06); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}