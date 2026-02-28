"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { t, tr } from "@/lib/translations";

interface Props {
  currentPage: number;
  totalPages:  number;
  total:       number;
  limit:       number;
}

export default function Pagination({ currentPage, totalPages, total, limit }: Props) {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const { lang }     = useLanguage();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  function getPages(): (number | "...")[] {
    const delta = 2;
    const range: number[] = [];
    const result: (number | "...")[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) result.push(1, "...");
    else result.push(1);

    result.push(...range);

    if (range[range.length - 1] < totalPages - 1)
      result.push("...", totalPages);
    else if (totalPages > 1)
      result.push(totalPages);

    return result;
  }

  const from  = (currentPage - 1) * limit + 1;
  const to    = Math.min(currentPage * limit, total);
  const pages = getPages();

  const countLabel = lang === 'fr'
    ? `${from}–${to} sur ${total} bien${total !== 1 ? 's' : ''}`
    : `${from}–${to} of ${total} propert${total !== 1 ? 'ies' : 'y'}`

  return (
    <div className="pag">
      <p className="pag__info">{countLabel}</p>

      <div className="pag__controls">

        {/* Previous */}
        <a
          className={`pag__btn pag__btn--arrow ${currentPage === 1 ? "pag__btn--disabled" : ""}`}
          href={currentPage === 1 ? undefined : buildUrl(currentPage - 1)}
          aria-label={tr(t.pagination.previous, lang)}
        >
          <ChevronLeft size={16} />
        </a>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="pag__ellipsis">…</span>
          ) : (
            <a
              key={p}
              className={`pag__btn ${p === currentPage ? "pag__btn--active" : ""}`}
              href={buildUrl(p as number)}
            >
              {p}
            </a>
          )
        )}

        {/* Next */}
        <a
          className={`pag__btn pag__btn--arrow ${currentPage === totalPages ? "pag__btn--disabled" : ""}`}
          href={currentPage === totalPages ? undefined : buildUrl(currentPage + 1)}
          aria-label={tr(t.pagination.next, lang)}
        >
          <ChevronRight size={16} />
        </a>

      </div>

      <style>{`
        .pag {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding-top: 48px; margin-top: 12px;
          border-top: 1px solid var(--border);
        }
        .pag__info { font-size: 12px; color: var(--muted); letter-spacing: 0.04em; }
        .pag__controls { display: flex; align-items: center; gap: 4px; }
        .pag__btn {
          min-width: 38px; height: 38px; padding: 0 6px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--muted-2);
          font-size: 13px; font-family: var(--font-ui);
          cursor: pointer; transition: all 0.2s ease;
          text-decoration: none;
        }
        .pag__btn:hover:not(.pag__btn--active):not(.pag__btn--disabled) {
          border-color: var(--gold); color: var(--gold);
          background: rgba(184,151,90,0.08);
        }
        .pag__btn--active {
          background: var(--gold); color: var(--black);
          border-color: var(--gold); font-weight: 600;
        }
        .pag__btn--disabled { opacity: 0.25; pointer-events: none; cursor: not-allowed; }
        .pag__btn--arrow { background: var(--surface-3); }
        .pag__ellipsis {
          color: var(--muted); font-size: 14px; padding: 0 6px;
          display: flex; align-items: center;
        }
        @media (max-width: 480px) {
          .pag { justify-content: center; }
          .pag__info { width: 100%; text-align: center; }
        }
      `}</style>
    </div>
  );
}
