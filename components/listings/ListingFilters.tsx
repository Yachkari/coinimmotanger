"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { ListingPurpose } from "@/types";
import { TYPE_OPTIONS, SORT_OPTIONS, BEDROOMS_OPTIONS } from "@/constants/filters";
import { CITY_NAMES } from "@/constants/cities";
import { SlidersHorizontal, X } from "lucide-react";

interface Props {
  purpose:        ListingPurpose;
  currentFilters: Record<string, string>;
}

const PER_PAGE_OPTIONS = [
  { value: "6",  label: "6 par page"  },
  { value: "9",  label: "9 par page"  },
  { value: "12", label: "12 par page" },
  { value: "24", label: "24 par page" },
];

export default function ListingFilters({ purpose, currentFilters }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  const [type,     setType]     = useState(currentFilters.type     ?? "");
  const [city,     setCity]     = useState(currentFilters.city     ?? "");
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice ?? "");
  const [bedrooms, setBedrooms] = useState(currentFilters.bedrooms ?? "");
  const [orderBy,  setOrderBy]  = useState(currentFilters.orderBy  ?? "date_desc");
  const [limit,    setLimit]    = useState(currentFilters.limit    ?? "9");

  function applyFilters() {
    const params = new URLSearchParams();
    if (type)     params.set("type",     type);
    if (city)     params.set("city",     city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (orderBy)  params.set("orderBy",  orderBy);
    if (limit)    params.set("limit",    limit);
    params.set("page", "1"); // reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setType(""); setCity(""); setMinPrice("");
    setMaxPrice(""); setBedrooms(""); setOrderBy("date_desc"); setLimit("9");
    router.push(pathname);
  }

  const hasFilters = !!(type || city || minPrice || maxPrice || bedrooms);

  return (
    <div className="filters">
      <div className="filters-header">
        <div className="filters-title">
          <SlidersHorizontal size={16} />
          Filtres
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="filters-clear">
            <X size={13} /> Effacer
          </button>
        )}
      </div>

      {/* Per page */}
      <div className="filter-group">
        <label className="filter-label">Afficher</label>
        <div className="pill-group">
          {PER_PAGE_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setLimit(o.value)}
              className={`pill ${limit === o.value ? "active" : ""}`}
            >
              {o.value}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label">Trier par</label>
        <select className="filter-input" value={orderBy} onChange={e => setOrderBy(e.target.value)}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div className="filter-group">
        <label className="filter-label">Type de bien</label>
        <select className="filter-input" value={type} onChange={e => setType(e.target.value)}>
          <option value="">Tous les types</option>
          {TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="filter-group">
        <label className="filter-label">Ville</label>
        <select className="filter-input" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Toutes les villes</option>
          {CITY_NAMES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="filter-group">
        <label className="filter-label">Budget (MAD)</label>
        <div className="price-range">
          <input
            type="number" className="filter-input"
            placeholder="Min" value={minPrice}
            onChange={e => setMinPrice(e.target.value)} min={0}
          />
          <span className="price-sep">—</span>
          <input
            type="number" className="filter-input"
            placeholder="Max" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)} min={0}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="filter-group">
        <label className="filter-label">Chambres (min)</label>
        <div className="pill-group">
          {BEDROOMS_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setBedrooms(bedrooms === String(o.value) ? "" : String(o.value))}
              className={`pill ${bedrooms === String(o.value) ? "active" : ""}`}
            >
              {o.value}+
            </button>
          ))}
        </div>
      </div>

      <button onClick={applyFilters} className="filters-apply">
        Appliquer les filtres
      </button>

      <style>{`
        .filters {
          background: var(--white); border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          padding: 24px; display: flex; flex-direction: column; gap: 20px;
        }
        .filters-header {
          display: flex; align-items: center; justify-content: space-between;
        }
        .filters-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 15px; font-weight: 600; color: var(--charcoal);
        }
        .filters-clear {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--terracotta);
          background: none; border: none; cursor: pointer;
          padding: 4px 8px; border-radius: 4px;
          transition: background 0.15s ease;
        }
        .filters-clear:hover { background: rgba(196,113,79,0.08); }

        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-label {
          font-size: 11px; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .filter-input {
          background: var(--cream); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 9px 12px;
          font-size: 13px; color: var(--ink);
          font-family: var(--font-body); outline: none; width: 100%;
          transition: border-color 0.15s ease; appearance: none;
        }
        .filter-input:focus { border-color: var(--terracotta); }

        .price-range { display: flex; align-items: center; gap: 8px; }
        .price-sep   { color: var(--muted); font-size: 14px; flex-shrink: 0; }

        .pill-group { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill {
          padding: 6px 14px; border-radius: 20px; font-size: 13px;
          border: 1.5px solid var(--border); background: var(--cream);
          color: var(--muted); cursor: pointer; font-family: var(--font-body);
          transition: all 0.15s ease;
        }
        .pill:hover  { border-color: var(--terracotta); color: var(--terracotta); }
        .pill.active {
          border-color: var(--terracotta); color: var(--terracotta);
          background: rgba(196,113,79,0.08); font-weight: 600;
        }

        .filters-apply {
          background: var(--terracotta); color: white; border: none;
          border-radius: var(--radius-md); padding: 12px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: var(--font-body); transition: all 0.2s ease; margin-top: 4px;
        }
        .filters-apply:hover { background: var(--terra-dark); }
      `}</style>
    </div>
  );
}