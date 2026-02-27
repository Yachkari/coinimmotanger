"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListingImage } from "@/types";
import { X, ChevronLeft, ChevronRight, Grid2x2, Expand } from "lucide-react";

interface Props {
  images: ListingImage[];
  title:  string;
}

export default function ListingGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll,  setShowAll]  = useState(false);

  if (images.length === 0) {
    return (
      <div className="gallery-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1"/>
        </svg>
        <span>Aucune photo disponible</span>
        <style>{`
          .gallery-empty {
            height: 420px; background: var(--surface-2);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 12px;
            color: var(--muted); font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  const cover  = images[0];
  const thumbs = images.slice(1, 5);

  function prev() {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + images.length) % images.length);
  }
  function next() {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % images.length);
  }

  // Keyboard nav
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape")     setLightbox(null);
  }

  return (
    <>
      {/* ── Main gallery grid ── */}
      <div className={`gallery gallery-${Math.min(images.length, 5)}`}>

        {/* Cover */}
        <div className="gallery__cover" onClick={() => setLightbox(0)}>
          <Image
            src={cover.url}
            alt={cover.alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 65vw"
            className="gallery__img"
            priority
          />
          <div className="gallery__cover-overlay">
            <Expand size={20} />
          </div>
        </div>

        {/* Thumbnails */}
        {thumbs.map((img, i) => (
          <div
            key={img.id}
            className="gallery__thumb"
            onClick={() => setLightbox(i + 1)}
          >
            <Image
              src={img.url}
              alt={img.alt ?? `Photo ${i + 2}`}
              fill sizes="25vw"
              className="gallery__img"
            />
            {/* Last thumb — show +N overlay if more images */}
            {i === 3 && images.length > 5 && (
              <div className="gallery__more-overlay" onClick={(e) => { e.stopPropagation(); setLightbox(4); }}>
                <span>+{images.length - 5}</span>
              </div>
            )}
            <div className="gallery__thumb-overlay" />
          </div>
        ))}

        {/* All photos button */}
        <button
          className="gallery__all-btn"
          onClick={() => setLightbox(0)}
        >
          <Grid2x2 size={14} />
          {images.length} photo{images.length !== 1 ? "s" : ""}
        </button>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="lb"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button className="lb__close" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="lb__counter">
            {lightbox + 1} <span>/</span> {images.length}
          </div>

          {/* Image */}
          <div className="lb__img-wrap" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightbox].url}
              alt={images[lightbox].alt ?? title}
              fill sizes="90vw"
              className="lb__img"
              priority
            />
          </div>

          {/* Prev / Next */}
          <button className="lb__prev" onClick={e => { e.stopPropagation(); prev(); }}>
            <ChevronLeft size={24} />
          </button>
          <button className="lb__next" onClick={e => { e.stopPropagation(); next(); }}>
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          <div className="lb__strip" onClick={e => e.stopPropagation()}>
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`lb__strip-thumb ${i === lightbox ? "active" : ""}`}
                onClick={() => setLightbox(i)}
              >
                <Image src={img.url} alt={`${i+1}`} fill sizes="80px" className="lb__strip-img" />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        /* ── Gallery ──────────────────────────────── */
        .gallery {
          display: grid;
          height: 520px; gap: 3px;
          background: var(--black);
          position: relative;
          overflow: hidden;
        }
        .gallery-1 { grid-template-columns: 1fr; }
        .gallery-2,
        .gallery-3,
        .gallery-4,
        .gallery-5 {
          grid-template-columns: 3fr 1fr;
          grid-template-rows: repeat(4, 1fr);
        }
        .gallery__cover { grid-row: 1 / 5; }

        .gallery__cover, .gallery__thumb {
          position: relative; overflow: hidden; cursor: pointer;
        }
        .gallery__img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .gallery__cover:hover .gallery__img,
        .gallery__thumb:hover .gallery__img { transform: scale(1.04); }

        .gallery__cover-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          color: white; opacity: 0;
          transition: all 0.25s ease;
        }
        .gallery__cover:hover .gallery__cover-overlay {
          background: var(--gallery-hover); opacity: 1;
        }

        .gallery__thumb-overlay {
          position: absolute; inset: 0;
          background: transparent;
          transition: background 0.2s ease;
        }
        .gallery__thumb:hover .gallery__thumb-overlay {
          background: var(--gallery-thumb-h);
        }

        .gallery__more-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: var(--gallery-more);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 20px; font-weight: 600;
          font-family: var(--font-display);
        }

        .gallery__all-btn {
          position: absolute; bottom: 20px; right: 20px;
          display: flex; align-items: center; gap: 8px;
          background: var(--gallery-btn-bg); backdrop-filter: blur(12px);
          border: 1px solid var(--border-hover);
          color: var(--white); padding: 8px 16px; border-radius: 2px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          letter-spacing: 0.06em; transition: all 0.2s ease;
          font-family: var(--font-ui);
        }
        .gallery__all-btn:hover {
          background: rgba(184,151,90,0.2); border-color: var(--gold); color: var(--gold);
        }

        @media (max-width: 768px) {
          .gallery { height: 300px; }
          .gallery-2,.gallery-3,.gallery-4,.gallery-5 {
            grid-template-columns: 1fr; grid-template-rows: 1fr;
          }
          .gallery__cover { grid-row: 1; }
          .gallery__thumb { display: none; }
        }

        /* ── Lightbox ─────────────────────────────── */
        .lb {
          position: fixed; inset: 0; z-index: 600;
          background: var(--lb-bg);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
          outline: none;
        }
         

        .lb__close {
          position: absolute; top: 24px; right: 24px;
          width: 44px; height: 44px; border-radius: 50%;
          background: background: var(--lb-btn-bg); border: 1px solid var(--border);
          color: var(--white); cursor: pointer; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .lb__close:hover { background: var(--lb-btn-bg-h); border-color: var(--gold); }

        .lb__counter {
          position: absolute; top: 28px; left: 50%;
          transform: translateX(-50%);
          font-size: 13px; color: var(--muted);
          letter-spacing: 0.1em;
        }
        .lb__counter span { color: var(--muted); margin: 0 4px; }

        .lb__img-wrap {
          position: relative;
          width: min(90vw, 1100px);
          height: min(75vh, 750px);
          border-radius: var(--r-md); overflow: hidden;
        }
        .lb__img { object-fit: contain; }

        .lb__prev, .lb__next {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--lb-btn-bg); border: 1px solid var(--border);
          color: var(--white); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .lb__prev { left: 24px; }
        .lb__next { right: 24px; }
        .lb__prev:hover, .lb__next:hover {
          background: rgba(184,151,90,0.15); border-color: var(--gold); color: var(--gold);
        }

        /* Thumbnail strip */
        .lb__strip {
          position: absolute; bottom: 24px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 6px; max-width: 90vw;
          overflow-x: auto; padding: 4px;
        }
        .lb__strip::-webkit-scrollbar { height: 2px; }
        .lb__strip::-webkit-scrollbar-thumb { background: var(--gold); }

        .lb__strip-thumb {
          position: relative; width: 60px; height: 44px;
          border-radius: 4px; overflow: hidden; flex-shrink: 0;
          cursor: pointer; border: 1px solid transparent;
          transition: border-color 0.2s ease; opacity: 0.5;
          transition: all 0.2s ease;
        }
        .lb__strip-thumb.active { border-color: var(--gold); opacity: 1; }
        .lb__strip-thumb:hover  { opacity: 0.85; }
        .lb__strip-img { object-fit: cover; }
      `}</style>
    </>
  );
}