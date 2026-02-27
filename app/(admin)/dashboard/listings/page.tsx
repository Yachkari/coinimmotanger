"use client";

import { useEffect, useState } from "react";
import { formatPrice, formatStatus, relativeTime } from "@/lib/utils";
import Link from "next/link";
import { PlusCircle, Pencil, Eye, X } from "lucide-react";
import DeleteListingButton from "@/components/admin/DeleteListingButton";

import { TYPE_OPTIONS, PURPOSE_OPTIONS } from "@/constants/filters";
import { CITIES } from "@/constants/cities";
import { REFERENCE_PREFIXES, GEO_CODES, GEO_CODE_KEYS } from "@/constants/referenceCodes";

const STATUS_OPTIONS = ["disponible", "vendu", "loue", "reserve"];

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  const [search,    setSearch]    = useState("");
  const [refCode,   setRefCode]   = useState("");
  const [city,      setCity]      = useState("");
  const [status,    setStatus]    = useState("");
  const [purpose,   setPurpose]   = useState("");
  const [type,      setType]      = useState("");
  const [geoCode, setGeoCode] = useState("");

  useEffect(() => {
    fetch("/api/listings?limit=200&orderBy=date_desc")
      .then(r => r.json())
      .then(d => { setListings(d.listings ?? []); setLoading(false); });
  }, []);

  const filtered = listings.filter(l => {
  if (search  && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
  if (refCode && l.reference_code !== refCode) return false;
  if (geoCode && l.geo_code !== geoCode)       return false;
  if (city    && l.city !== city)               return false;
  if (status  && l.status !== status)           return false;
  if (purpose && l.purpose !== purpose)         return false;
  if (type    && l.type !== type)               return false;
  return true;
});

  const hasFilters = search || refCode || city || status || purpose || type || geoCode;

  function clearAll() {
  setSearch(""); setRefCode(""); setCity("");
  setStatus(""); setPurpose(""); setType(""); setGeoCode("");
}

  return (
    <div className="lp">

      {/* Header */}
      <div className="lp__header">
        <div>
          <span className="lp__eyebrow">◆ Gestion</span>
          <h1 className="lp__title">Annonces</h1>
          <p className="lp__sub">
            {loading ? "Chargement…" : `${filtered.length} / ${listings.length} bien${listings.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/dashboard/listings/new" className="lp__cta">
          <PlusCircle size={14} />
          Nouvelle annonce
        </Link>
      </div>

      {/* Filter bar */}
      <div className="lp__filters">
        <input
          className="lp__filter-input lp__filter-search"
          placeholder="Rechercher par titre…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="lp__filter-input" value={refCode} onChange={e => setRefCode(e.target.value)}>
          <option value="">Tous les codes</option>
          {REFERENCE_PREFIXES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="lp__filter-input" value={geoCode} onChange={e => setGeoCode(e.target.value)}>
  <option value="">Toutes les zones</option>
  {GEO_CODE_KEYS.map(k => (
    <option key={k} value={k}>{k} — {GEO_CODES[k]}</option>
  ))}
</select>
        <select className="lp__filter-input" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Toutes les villes</option>
          {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <select className="lp__filter-input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="lp__filter-input" value={purpose} onChange={e => setPurpose(e.target.value)}>
          <option value="">Tous les objectifs</option>
          {PURPOSE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="lp__filter-input" value={type} onChange={e => setType(e.target.value)}>
          <option value="">Tous les types</option>
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {hasFilters && (
          <button className="lp__filter-clear" onClick={clearAll}>
            <X size={12} /> Effacer
          </button>
        )}
      </div>

      {loading ? (
        <div className="lp__loading">Chargement des annonces…</div>
      ) : filtered.length === 0 ? (
        <div className="lp__empty">
          <p>{hasFilters ? "Aucun résultat pour ces filtres." : "Aucune annonce. Commencez par en créer une."}</p>
          {!hasFilters && (
            <Link href="/dashboard/listings/new" className="lp__cta" style={{ marginTop: 20 }}>
              Créer une annonce
            </Link>
          )}
        </div>
      ) : (
        <div className="lp__table-wrap">
          <table className="lp__table">
            <thead>
              <tr>
                <th>Réf.</th>
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
              {filtered.map((l) => {
                const { label, color } = formatStatus(l.status);
                const badgeMod =
                  color.includes("green")  ? "green"  :
                  color.includes("red")    ? "red"    :
                  color.includes("orange") ? "orange" : "gold";

                return (
                  <tr key={l.id}>
                    <td className="lp__td-ref">
                      {l.reference ?? <span className="lp__td-empty">—</span>}
                    </td>
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
        .lp { color: var(--off-white); animation: fadeUp .3s ease both; }

        .lp__header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding-bottom: 28px; margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .lp__eyebrow {
          display: block; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .22em;
          color: var(--gold); margin-bottom: 6px;
        }
        .lp__title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 400; color: var(--white);
          margin: 0 0 4px; line-height: 1.1;
        }
        .lp__sub { font-size: 13px; color: var(--muted); margin: 0; }

        .lp__cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold); color: var(--black);
          text-decoration: none; padding: 10px 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          transition: all .2s ease; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .lp__cta:hover { background: var(--gold-light); box-shadow: 0 0 0 3px rgba(201,168,76,.15); }

        /* Filter bar */
        .lp__filters {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 20px; align-items: center;
        }
        .lp__filter-input {
          background: var(--surface); border: 1px solid var(--border);
          color: var(--off-white); font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          padding: 8px 12px; outline: none;
          transition: border-color .15s ease;
          height: 36px;
        }
        .lp__filter-input:focus { border-color: var(--gold); }
        .lp__filter-search { min-width: 220px; flex: 1; }
        .lp__filter-input option { background: var(--surface); }
        .lp__filter-clear {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; height: 36px;
          background: none; border: 1px solid var(--border);
          color: var(--muted); font-size: 11px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: .08em; text-transform: uppercase;
          cursor: pointer; transition: all .15s ease;
        }
        .lp__filter-clear:hover { border-color: #c05252; color: #c05252; }

        .lp__loading {
          padding: 60px 40px; text-align: center;
          color: var(--muted); font-size: 13px;
          text-transform: uppercase; letter-spacing: .1em;
        }

        .lp__empty {
          background: var(--surface); border: 1px solid var(--border);
          padding: 80px 40px; text-align: center; color: var(--muted);
          font-size: 13px; display: flex; flex-direction: column; align-items: center;
        }

        .lp__table-wrap {
          background: var(--surface); border: 1px solid var(--border);
          overflow: hidden; overflow-x: auto;
        }
        .lp__table { width: 100%; border-collapse: collapse; font-size: 13px; }

        .lp__table thead tr { border-bottom: 1px solid var(--border); }
        .lp__table th {
          padding: 11px 16px; text-align: left;
          font-size: 9px; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: .15em;
          white-space: nowrap; background: var(--surface-2);
        }

        .lp__table tbody tr { border-bottom: 1px solid var(--border); transition: background .1s ease; }
        .lp__table tbody tr:last-child { border-bottom: none; }
        .lp__table tbody tr:hover { background: var(--surface-3); }
        .lp__table td { padding: 13px 16px; vertical-align: middle; }

        .lp__td-ref {
          color: var(--gold); font-weight: 700;
          font-size: 12px; letter-spacing: 0.08em;
          white-space: nowrap; font-family: var(--font-ui);
        }
        .lp__td-empty { color: var(--muted); font-weight: 400; }
        .lp__td-title { min-width: 220px; }
        .lp__title-text { color: var(--off-white); font-weight: 500; }
        .lp__featured { color: var(--gold); margin-left: 7px; font-size: 11px; }

        .lp__td-dim   { color: var(--muted); }
        .lp__td-price { color: var(--gold); font-weight: 600; white-space: nowrap; }
        .lp__td-time  { white-space: nowrap; }

        .lp__badge {
          display: inline-block; padding: 2px 8px;
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .1em; white-space: nowrap;
        }
        .lp__badge--green  { background: rgba(76,175,130,.12);  color: #4caf82; }
        .lp__badge--red    { background: rgba(192,82,82,.12);   color: #c05252; }
        .lp__badge--orange { background: rgba(224,123,82,.12);  color: #e07b52; }
        .lp__badge--gold   { background: rgba(201,168,76,.12);  color: var(--gold); }

        .lp__actions { display: flex; align-items: center; gap: 4px; }
        .lp__action {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; border: 1px solid var(--border);
          background: none; cursor: pointer; color: var(--muted);
          transition: all .15s ease;
        }
        .lp__action:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,.06); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}