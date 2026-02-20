"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export default function MarkReadButton({ id, isRead }: { id: string; isRead: boolean }) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  if (isRead) return null;

  async function handleClick() {
    setLoading(true);
    try {
      await fetch(`/api/messages/${id}/read`, {
        method: "POST",
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN! },
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className="mrb" title="Marquer comme lu">
      <CheckCheck size={12} />
      <span>Marquer lu</span>
      <style>{`
        .mrb {
          display: flex; align-items: center; gap: 5px;
          background: none; border: 1px solid #1f1f1f;
          padding: 5px 10px; color: #555;
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .08em;
          cursor: pointer; transition: all .15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .mrb:hover:not(:disabled) {
          border-color: rgba(76,175,130,.3);
          color: #4caf82; background: rgba(76,175,130,.07);
        }
        .mrb:disabled { opacity: .4; }
      `}</style>
    </button>
  );
}