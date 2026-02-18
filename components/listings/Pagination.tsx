"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage:  number;
  totalPages:   number;
  total:        number;
  limit:        number;
}

export default function Pagination({ currentPage, totalPages, total, limit }: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build page number array with ellipsis
  function getPageNumbers(): (number | "...")[] {
    const delta  = 2;
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

    if (range[range.length - 1] < totalPages - 1) result.push("...", totalPages);
    else if (totalPages > 1) result.push(totalPages);

    return result;
  }

  const from  = (currentPage - 1) * limit + 1;
  const to    = Math.min(currentPage * limit, total);
  const pages = getPageNumbers();

  return (
    <div className="pag-root">
      <p className="pag-info">
        {from}–{to} sur {total} bien{total !== 1 ? "s" : ""}
      </p>

      <div className="pag-controls">
        {/* Prev */}
        <button
          className="pag-btn pag-arrow"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Page précédente"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="pag-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`pag-btn pag-num ${p === currentPage ? "active" : ""}`}
              onClick={() => goToPage(p as number)}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="pag-btn pag-arrow"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        .pag-root {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding-top: 40px; margin-top: 8px;
          border-top: 1px solid var(--border);
        }
        .pag-info {
          font-size: 13px; color: var(--muted);
        }
        .pag-controls {
          display: flex; align-items: center; gap: 6px;
        }
        .pag-btn {
          min-width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; border: 1.5px solid var(--border);
          background: var(--white); color: var(--ink);
          font-size: 14px; font-family: var(--font-body);
          cursor: pointer; transition: all 0.15s ease;
          padding: 0 6px;
        }
        .pag-btn:hover:not(:disabled):not(.active) {
          border-color: var(--terracotta);
          color: var(--terracotta);
          background: rgba(196,113,79,0.06);
        }
        .pag-btn.active {
          background: var(--terracotta); color: white;
          border-color: var(--terracotta); font-weight: 600;
        }
        .pag-btn:disabled {
          opacity: 0.35; cursor: not-allowed;
        }
        .pag-ellipsis {
          color: var(--muted); font-size: 14px; padding: 0 4px;
          display: flex; align-items: center;
        }
        @media (max-width: 480px) {
          .pag-root { justify-content: center; }
          .pag-info { width: 100%; text-align: center; }
        }
      `}</style>
    </div>
  );
}