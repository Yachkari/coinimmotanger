"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteListingButton({
  id, title, onDelete
}: {
  id: string;
  title: string;
  onDelete: (id: string) => void
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN! },
      });
      if (res.ok) onDelete(id); // ← remove from state instantly
      else alert("Erreur lors de la suppression.");
    } catch {
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="del-btn" title="Supprimer">
      <Trash2 size={14} />
      <style>{`
        .del-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #1f1f1f; background: none;
          cursor: pointer; color: #555;
          transition: all .15s ease;
        }
        .del-btn:hover:not(:disabled) {
          border-color: rgba(192,82,82,.4);
          color: #c05252; background: rgba(192,82,82,.07);
        }
        .del-btn:disabled { opacity: .4; cursor: not-allowed; }
      `}</style>
    </button>
  );
}