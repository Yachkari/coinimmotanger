import { getListings } from "@/lib/supabase/queries";
import { formatPrice, formatStatus, relativeTime } from "@/lib/utils";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";
import DeleteListingButton from "@/components/admin/DeleteListingButton";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const result = await getListings({
    limit:   100,
    orderBy: "date_desc",
    // status:  undefined as any, // show all statuses in admin
  });

  const listings = result.data?.listings ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Annonces</h1>
          <p className="page-sub">{listings.length} bien{listings.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/dashboard/listings/new" className="btn-primary">
          <PlusCircle size={16} />
          Nouvelle annonce
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="empty-panel">
          <p>Aucune annonce. Commencez par en créer une.</p>
          <Link href="/dashboard/listings/new" className="btn-primary" style={{ marginTop: 16 }}>
            Créer une annonce
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Objectif</th>
                <th>Ville</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Créé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => {
                const { label, color } = formatStatus(l.status);
                return (
                  <tr key={l.id}>
                    <td className="td-title">
                      <span className="title-text">{l.title}</span>
                      {l.is_featured && <span className="featured-dot" title="En vedette">★</span>}
                    </td>
                    <td className="td-muted">{l.type}</td>
                    <td className="td-muted">{l.purpose}</td>
                    <td className="td-muted">{l.city}</td>
                    <td className="td-price">{formatPrice(l.price, l.price_period)}</td>
                    <td>
                      <span className="status-badge" style={{
                        background: color.includes("green")  ? "rgba(76,175,130,0.12)"  :
                                    color.includes("red")    ? "rgba(224,82,82,0.12)"   :
                                    color.includes("orange") ? "rgba(224,123,82,0.12)"  :
                                                               "rgba(201,168,76,0.12)",
                        color:      color.includes("green")  ? "#4caf82"  :
                                    color.includes("red")    ? "#e05252"  :
                                    color.includes("orange") ? "#e07b52"  :
                                                               "#c9a84c",
                      }}>
                        {label}
                      </span>
                    </td>
                    <td className="td-muted">{relativeTime(l.created_at)}</td>
                    <td>
                      <div className="action-row">
                        <Link
                          href={`/${l.purpose}/${l.slug}`}
                          target="_blank"
                          className="action-btn view"
                          title="Voir sur le site"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/dashboard/listings/${l.id}/edit`}
                          className="action-btn edit"
                          title="Modifier"
                        >
                          <Pencil size={15} />
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600&family=Playfair+Display:wght@600&display=swap');

        .page { font-family: 'DM Sans', sans-serif; color: #e0e0e0; max-width: 1100px; }

        .page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
        }
        .page-title { font-family: 'Playfair Display', serif; font-size: 28px; color: #f0f0f0; margin-bottom: 4px; }
        .page-sub   { font-size: 14px; color: #555; }

        .btn-primary {
          display: flex; align-items: center; gap: 8px;
          background: #c9a84c; color: #0a0a0a; text-decoration: none;
          padding: 10px 18px; border-radius: 8px; font-size: 14px;
          font-weight: 600; transition: all 0.15s ease; white-space: nowrap;
          border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { background: #d4b45a; transform: translateY(-1px); }

        .empty-panel {
          background: #141414; border: 1px solid #1f1f1f; border-radius: 12px;
          padding: 60px; text-align: center; color: #555; font-size: 14px;
          display: flex; flex-direction: column; align-items: center;
        }

        .table-wrap {
          background: #141414; border: 1px solid #1f1f1f;
          border-radius: 12px; overflow: hidden; overflow-x: auto;
        }

        .table {
          width: 100%; border-collapse: collapse; font-size: 13px;
        }

        .table thead tr {
          border-bottom: 1px solid #1f1f1f;
        }

        .table th {
          padding: 14px 16px; text-align: left;
          font-size: 11px; font-weight: 600;
          color: #555; text-transform: uppercase; letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .table tbody tr {
          border-bottom: 1px solid #1a1a1a;
          transition: background 0.1s ease;
        }
        .table tbody tr:last-child { border-bottom: none; }
        .table tbody tr:hover { background: #1a1a1a; }

        .table td { padding: 14px 16px; vertical-align: middle; }

        .td-title { min-width: 200px; }
        .title-text { color: #d0d0d0; font-weight: 500; }
        .featured-dot { color: #c9a84c; margin-left: 6px; font-size: 12px; }

        .td-muted { color: #666; }
        .td-price  { color: #c9a84c; font-weight: 500; white-space: nowrap; }

        .status-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap;
        }

        .action-row { display: flex; align-items: center; gap: 6px; }
        .action-btn {
          width: 32px; height: 32px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; border: 1px solid #2a2a2a;
          transition: all 0.15s ease; background: none; cursor: pointer;
        }
        .action-btn.view { color: #888; }
        .action-btn.view:hover  { background: #1f1f1f; color: #c9a84c; border-color: #c9a84c44; }
        .action-btn.edit { color: #888; }
        .action-btn.edit:hover  { background: #1f1f1f; color: #52a8e0; border-color: #52a8e044; }
      `}</style>
    </div>
  );
}