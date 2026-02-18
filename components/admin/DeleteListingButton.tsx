"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteListingButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method:  "DELETE",
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN! },
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch {
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="action-btn delete"
      title="Supprimer"
    >
      <Trash2 size={15} />
      <style>{`
        .action-btn {
          width: 32px; height: 32px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #2a2a2a; transition: all 0.15s ease;
          background: none; cursor: pointer;
        }
        .action-btn.delete { color: #888; }
        .action-btn.delete:hover:not(:disabled) {
          background: rgba(224,82,82,0.1);
          color: #e05252; border-color: rgba(224,82,82,0.3);
        }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </button>
  );
}