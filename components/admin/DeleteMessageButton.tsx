"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteMessageButton({ id }: { id: string }) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce message ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method:  "DELETE",
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN! },
      });
      if (res.ok) router.refresh();
      else alert("Erreur lors de la suppression.");
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
      title="Supprimer"
      style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "none", border: "1px solid #2a2a2a",
        borderRadius: 6, padding: "5px 10px",
        color: "#666", fontSize: 12, cursor: "pointer",
        transition: "all 0.15s ease", fontFamily: "'DM Sans', sans-serif",
        opacity: loading ? 0.4 : 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(224,82,82,0.4)";
        (e.currentTarget as HTMLButtonElement).style.color = "#e05252";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(224,82,82,0.08)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
        (e.currentTarget as HTMLButtonElement).style.color = "#666";
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      <Trash2 size={14} />
      Supprimer
    </button>
  );
}