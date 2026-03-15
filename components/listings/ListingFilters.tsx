"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { ListingPurpose } from "@/types";
import { BEDROOMS_OPTIONS } from "@/constants/filters";
import { CITY_NAMES } from "@/constants/cities";
import { SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { t, tr } from "@/lib/translations";
import { CITIES } from "@/constants/cities";

interface Props {
  purpose:        ListingPurpose;
  currentFilters: Record<string, string>;
}

const PER_PAGE_OPTIONS = [
  { value: "6",  label: "6"  },
  { value: "9",  label: "9"  },
  { value: "12", label: "12" },
  { value: "24", label: "24" },
];

export default function ListingFilters({ purpose, currentFilters }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const { lang } = useLanguage();

  // ── Language-aware options ───────────────────────────────
  const TYPE_OPTIONS = [
    { value: 'appartement', label: lang === 'fr' ? 'Appartement' : 'Apartment'  },
    { value: 'villa',       label: lang === 'fr' ? 'Villa'       : 'Villa'       },
    { value: 'maison',      label: lang === 'fr' ? 'Maison'      : 'House'       },
    { value: 'Ryad',        label: lang === 'fr' ? 'Riad'        : 'Riad'        },
    { value: 'bureau',      label: lang === 'fr' ? 'Bureau'      : 'Office'      },
    { value: 'terrain',     label: lang === 'fr' ? 'Terrain'     : 'Land'        },
    { value: 'commercial',  label: lang === 'fr' ? 'Commercial'  : 'Commercial'  },
  ]

  const SORT_OPTIONS = [
    { value: 'date_desc',  label: lang === 'fr' ? 'Plus récents'     : 'Most recent'       },
    { value: 'date_asc',   label: lang === 'fr' ? 'Plus anciens'     : 'Oldest first'      },
    { value: 'price_asc',  label: lang === 'fr' ? 'Prix croissant'   : 'Price: low to high' },
    { value: 'price_desc', label: lang === 'fr' ? 'Prix décroissant' : 'Price: high to low' },
  ]
  // ────────────────────────────────────────────────────────

  const [type,     setType]     = useState(currentFilters.type     ?? "");
  const [city,     setCity]     = useState(currentFilters.city     ?? "");
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice ?? "");
  const [bedrooms, setBedrooms] = useState(currentFilters.bedrooms ?? "");
  const [orderBy,  setOrderBy]  = useState(currentFilters.orderBy  ?? "date_desc");
  const [limit,    setLimit]    = useState(currentFilters.limit    ?? "9");
  const [neighborhood, setNeighborhood] = useState(currentFilters.neighborhood ?? "");
  const neighborhoods = city
  ? (CITIES.find(c => c.name === city)?.neighborhoods ?? [])
  : [];

  function apply() {
    const params = new URLSearchParams();
    if (type)     params.set("type",     type);
    if (city)     params.set("city",     city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (orderBy)  params.set("orderBy",  orderBy);
    if (limit)    params.set("limit",    limit);
    if (neighborhood) params.set("neighborhood", neighborhood);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clear() {
    setType(""); setCity(""); setMinPrice("");
    setMaxPrice(""); setBedrooms(""); setOrderBy("date_desc"); setLimit("9");setNeighborhood("");
    router.push(pathname);
  }

  const hasFilters = !!(type || city || neighborhood || minPrice || maxPrice || bedrooms);

  return (
    <div className="filters">

      {/* Header */}
      <div className="filters__head">
        <div className="filters__title">
          <SlidersHorizontal size={14} />
          {tr(t.filters.title, lang)}
        </div>
        {hasFilters && (
          <button onClick={clear} className="filters__clear">
            <X size={12} /> {tr(t.filters.reset, lang)}
          </button>
        )}
      </div>

      {/* Per page */}
      <div className="filter-group">
        <span className="filter-label">
          {lang === 'fr' ? 'Par page' : 'Per page'}
        </span>
        <div className="pill-row">
          {PER_PAGE_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setLimit(o.value)}
              className={`pill ${limit === o.value ? "pill--active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <span className="filter-label">
          {lang === 'fr' ? 'Trier par' : 'Sort by'}
        </span>
        <select className="filter-select" value={orderBy} onChange={e => setOrderBy(e.target.value)}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div className="filter-group">
        <span className="filter-label">{tr(t.filters.type, lang)}</span>
        <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">{tr(t.filters.allTypes, lang)}</option>
          {TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="filter-group">
        <span className="filter-label">{tr(t.filters.city, lang)}</span>
        <select className="filter-select" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">{tr(t.filters.allCities, lang)}</option>
          {CITY_NAMES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {/* Neighborhood */}
{neighborhoods.length > 0 && (
  <div className="filter-group">
    <span className="filter-label">
      {lang === 'fr' ? 'Quartier' : 'Neighborhood'}
    </span>
    <select
      className="filter-select"
      value={neighborhood}
      onChange={e => setNeighborhood(e.target.value)}
    >
      <option value="">{lang === 'fr' ? 'Tous les quartiers' : 'All neighborhoods'}</option>
      {neighborhoods.map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>
)}

      {/* Price */}
      <div className="filter-group">
        <span className="filter-label">Budget (MAD)</span>
        <div className="filter-range">
          <input
            type="number" className="filter-input"
            placeholder="Min"
            value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0}
          />
          <span className="filter-range-sep">—</span>
          <input
            type="number" className="filter-input"
            placeholder="Max"
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="filter-group">
        <span className="filter-label">
          {lang === 'fr' ? 'Chambres (min)' : 'Bedrooms (min)'}
        </span>
        <div className="pill-row">
          {BEDROOMS_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setBedrooms(bedrooms === String(o.value) ? "" : String(o.value))}
              className={`pill ${bedrooms === String(o.value) ? "pill--active" : ""}`}
            >
              {o.value}+
            </button>
          ))}
        </div>
      </div>

      <button onClick={apply} className="filters__apply">
        {tr(t.filters.apply, lang)}
      </button>

      <style>{`
        .filters {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 24px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .filters__head {
          display: flex; align-items: center; justify-content: space-between;
        }
        .filters__title {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600;
          color: var(--white); letter-spacing: 0.04em;
        }
        .filters__clear {
          display: flex; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer;
          font-size: 11px; color: var(--gold);
          padding: 4px 8px; border-radius: 4px;
          transition: background 0.15s ease;
          font-family: var(--font-ui);
          letter-spacing: 0.04em;
        }
        .filters__clear:hover { background: rgba(184,151,90,0.1); }
        .filter-group { display: flex; flex-direction: column; gap: 10px; }
        .filter-label {
          font-size: 10px; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .filter-select {
          background: var(--surface-3);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          padding: 10px 12px;
          font-size: 13px; color: var(--off-white);
          font-family: var(--font-ui);
          outline: none; width: 100%;
          appearance: none; cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .filter-select:focus { border-color: var(--gold); }
        .filter-select option { background: var(--surface-3); color: var(--off-white); }
        .filter-range { display: flex; align-items: center; gap: 8px; }
        .filter-range-sep { color: var(--muted); font-size: 12px; flex-shrink: 0; }
        .filter-input {
          background: var(--surface-3);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          padding: 10px 12px;
          font-size: 13px; color: var(--off-white);
          font-family: var(--font-ui);
          outline: none; width: 100%;
          transition: border-color 0.2s ease;
        }
        .filter-input::placeholder { color: var(--muted); }
        .filter-input:focus { border-color: var(--gold); }
        .pill-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill {
          padding: 7px 14px; border-radius: 2px;
          border: 1px solid var(--border);
          background: var(--surface-3);
          color: var(--muted-2);
          font-size: 12px; font-weight: 500;
          font-family: var(--font-ui);
          cursor: pointer; transition: all 0.15s ease;
          letter-spacing: 0.04em;
        }
        .pill:hover { border-color: var(--gold); color: var(--gold); }
        .pill--active {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(184,151,90,0.1);
        }
        .filters__apply {
          background: var(--gold); color: var(--black);
          border: none; border-radius: var(--r-sm);
          padding: 12px; font-size: 12px;
          font-weight: 600; cursor: pointer;
          font-family: var(--font-ui);
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: all 0.2s ease; margin-top: 4px;
        }
        .filters__apply:hover {
          background: var(--gold-light);
          box-shadow: 0 4px 20px rgba(184,151,90,0.3);
        }
      `}</style>
    </div>
  );
}