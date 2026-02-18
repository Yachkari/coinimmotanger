"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListingImage } from "@/types";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface Props {
  images: ListingImage[];
  title:  string;
}

export default function ListingGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="gallery-empty">
        <span>◆</span>
      </div>
    );
  }

  const cover  = images[0];
  const others = images.slice(1, 5);

  function prev() {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + images.length) % images.length);
  }
  function next() {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % images.length);
  }

  return (
    <>
      {/* Grid */}
      <div className={`gallery gallery-${Math.min(images.length, 5)}`}>

        {/* Cover */}
        <div className="gallery-cover" onClick={() => setLightbox(0)}>
          <Image
            src={cover.url}
            alt={cover.alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="gallery-img"
            priority
          />
          <div className="gallery-overlay">
            <ZoomIn size={20} />
          </div>
        </div>

        {/* Thumbnails */}
        {others.map((img, i) => (
          <div key={img.id} className="gallery-thumb" onClick={() => setLightbox(i + 1)}>
            <Image
              src={img.url}
              alt={img.alt ?? `Photo ${i + 2}`}
              fill
              sizes="25vw"
              className="gallery-img"
            />
            <div className="gallery-overlay">
              {i === 3 && images.length > 5 && (
                <span className="gallery-more">+{images.length - 5}</span>
              )}
              {(i < 3 || images.length <= 5) && <ZoomIn size={16} />}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lb-root" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>

          <button className="lb-prev" onClick={e => { e.stopPropagation(); prev(); }}>
            <ChevronLeft size={28} />
          </button>

          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightbox].url}
              alt={images[lightbox].alt ?? title}
              fill
              sizes="90vw"
              className="lb-img"
              priority
            />
          </div>

          <button className="lb-next" onClick={e => { e.stopPropagation(); next(); }}>
            <ChevronRight size={28} />
          </button>

          <div className="lb-counter">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}

      <style>{`
        /* ── Gallery grid ──────────────────────────── */
        .gallery {
          display: grid;
          height: 480px;
          gap: 4px;
          overflow: hidden;
          background: var(--charcoal);
          cursor: pointer;
        }

        /* 1 image */
        .gallery-1 { grid-template-columns: 1fr; }
        .gallery-1 .gallery-cover { grid-column: 1; grid-row: 1; }

        /* 2-5 images: cover left, thumbs right */
        .gallery-2,
        .gallery-3,
        .gallery-4,
        .gallery-5 {
          grid-template-columns: 3fr 1fr;
          grid-template-rows: repeat(4, 1fr);
        }
        .gallery-cover { grid-row: 1 / 5; }
        .gallery-thumb { grid-column: 2; }

        .gallery-empty {
          height: 360px; background: var(--cream-dark);
          display: flex; align-items: center; justify-content: center;
          font-size: 48px; color: var(--sand);
        }

        .gallery-cover, .gallery-thumb {
          position: relative; overflow: hidden;
        }
        .gallery-img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .gallery-cover:hover .gallery-img,
        .gallery-thumb:hover .gallery-img { transform: scale(1.04); }

        .gallery-overlay {
          position: absolute; inset: 0;
          background: rgba(26,22,20,0);
          display: flex; align-items: center; justify-content: center;
          color: white; opacity: 0;
          transition: all 0.25s ease;
        }
        .gallery-cover:hover .gallery-overlay,
        .gallery-thumb:hover .gallery-overlay {
          background: rgba(26,22,20,0.3); opacity: 1;
        }
        .gallery-more {
          font-size: 18px; font-weight: 600;
          background: rgba(0,0,0,0.5);
          padding: 8px 14px; border-radius: 8px;
        }

        @media (max-width: 768px) {
          .gallery { height: 300px; }
          .gallery-2, .gallery-3, .gallery-4, .gallery-5 {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
          }
          .gallery-thumb { display: none; }
          .gallery-cover { grid-row: 1; }
        }

        /* ── Lightbox ──────────────────────────────── */
        .lb-root {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(10,8,6,0.96);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        .lb-img-wrap {
          position: relative;
          width: min(90vw, 1000px);
          height: min(80vh, 700px);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .lb-img { object-fit: contain; }

        .lb-close {
          position: absolute; top: 20px; right: 20px;
          background: rgba(255,255,255,0.1); border: none;
          color: white; width: 44px; height: 44px;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease; z-index: 1;
        }
        .lb-close:hover { background: rgba(255,255,255,0.2); }

        .lb-prev, .lb-next {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: none;
          color: white; width: 52px; height: 52px;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease;
        }
        .lb-prev { left: 20px; }
        .lb-next { right: 20px; }
        .lb-prev:hover, .lb-next:hover { background: rgba(255,255,255,0.2); }

        .lb-counter {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          color: rgba(255,255,255,0.6); font-size: 14px;
        }
      `}</style>
    </>
  );
}