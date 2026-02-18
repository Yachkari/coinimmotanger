"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { ListingImage } from "@/types";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";

interface Props {
  listingId:      string;
  existingImages: ListingImage[];
}

export default function ImageUploader({ listingId, existingImages }: Props) {
  const [images,    setImages]    = useState<ListingImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");

  // ── Upload handler ───────────────────────────────────────

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setError("");
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("listing_id", listingId);
        acceptedFiles.forEach((f) => formData.append("files", f));

        const res = await fetch("/api/upload", {
          method:  "POST",
          headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN! },
          body:    formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Erreur upload.");
          return;
        }

        setImages((prev) => [...prev, ...(data.images ?? [])]);

        if (data.failed?.length > 0) {
          setError(`Échec pour : ${data.failed.join(", ")}`);
        }
      } catch {
        setError("Erreur réseau.");
      } finally {
        setUploading(false);
      }
    },
    [listingId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  // ── Delete handler ───────────────────────────────────────

  async function handleDelete(image: ListingImage) {
    if (!confirm("Supprimer cette photo ?")) return;

    try {
      const res = await fetch("/api/upload", {
        method:  "DELETE",
        headers: {
          "Content-Type":  "application/json",
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN!,
        },
        body: JSON.stringify({ image_id: image.id, url: image.url }),
      });

      if (res.ok) {
        setImages((prev) => prev.filter((i) => i.id !== image.id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch {
      alert("Erreur réseau.");
    }
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="iu-root">

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`iu-dropzone ${isDragActive ? "active" : ""} ${uploading ? "disabled" : ""}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="iu-uploading">
            <Loader2 size={28} className="iu-spin" />
            <span>Upload en cours…</span>
          </div>
        ) : isDragActive ? (
          <div className="iu-idle">
            <ImagePlus size={28} />
            <span>Déposez les photos ici</span>
          </div>
        ) : (
          <div className="iu-idle">
            <Upload size={24} />
            <div>
              <p className="iu-main">Glissez vos photos ici</p>
              <p className="iu-sub">ou cliquez pour sélectionner · JPEG, PNG, WebP · 5MB max</p>
            </div>
          </div>
        )}
      </div>

      {error && <div className="iu-error">⚠ {error}</div>}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="iu-grid">
          {images
            .sort((a, b) => a.order - b.order)
            .map((img, i) => (
              <div key={img.id} className="iu-thumb">
                <Image
                  src={img.url}
                  alt={img.alt ?? `Photo ${i + 1}`}
                  fill
                  className="iu-img"
                  sizes="160px"
                />
                {i === 0 && <span className="iu-cover-badge">Couverture</span>}
                <button
                  type="button"
                  className="iu-delete"
                  onClick={() => handleDelete(img)}
                  title="Supprimer"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
        </div>
      )}

      <style>{`
        .iu-root { display: flex; flex-direction: column; gap: 16px; }

        .iu-dropzone {
          border: 2px dashed #2a2a2a; border-radius: 12px;
          padding: 40px 20px; text-align: center;
          cursor: pointer; transition: all 0.2s ease;
          background: #0f0f0f;
        }
        .iu-dropzone:hover:not(.disabled) { border-color: #c9a84c; background: rgba(201,168,76,0.04); }
        .iu-dropzone.active   { border-color: #c9a84c; background: rgba(201,168,76,0.08); }
        .iu-dropzone.disabled { opacity: 0.6; cursor: not-allowed; }

        .iu-idle {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px; color: #555;
        }
        .iu-main { font-size: 14px; color: #888; margin-bottom: 4px; }
        .iu-sub  { font-size: 12px; color: #444; }

        .iu-uploading {
          display: flex; align-items: center; gap: 12px;
          color: #c9a84c; font-size: 14px; justify-content: center;
        }
        .iu-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .iu-error {
          background: rgba(224,82,82,0.1); border: 1px solid rgba(224,82,82,0.2);
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: #e05252;
        }

        .iu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }

        .iu-thumb {
          position: relative; aspect-ratio: 4/3;
          border-radius: 8px; overflow: hidden;
          border: 1px solid #2a2a2a; background: #0f0f0f;
        }
        .iu-img    { object-fit: cover; }
        .iu-cover-badge {
          position: absolute; top: 6px; left: 6px;
          background: #c9a84c; color: #0a0a0a;
          font-size: 10px; font-weight: 700; padding: 2px 8px;
          border-radius: 20px; letter-spacing: 0.04em;
        }
        .iu-delete {
          position: absolute; top: 6px; right: 6px;
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(0,0,0,0.7); border: none;
          color: #fff; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.15s ease;
        }
        .iu-thumb:hover .iu-delete { opacity: 1; }
        .iu-delete:hover { background: #e05252; }
      `}</style>
    </div>
  );
}