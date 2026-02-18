"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export default function MarkReadButton({
  id,
  isRead,
}: {
  id: string;
  isRead: boolean;
}) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  if (isRead) return null;

  async function handleClick() {
    setLoading(true);
    try {
      await fetch(`/api/messages/${id}/read`, {
        method:  "POST",
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN! },
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mark-read-btn"
      title="Marquer comme lu"
    >
      <CheckCheck size={14} />
      <span>Lu</span>
      <style>{`
        .mark-read-btn {
          display: flex; align-items: center; gap: 5px;
          background: none; border: 1px solid #2a2a2a;
          border-radius: 6px; padding: 5px 10px;
          color: #666; font-size: 12px; cursor: pointer;
          transition: all 0.15s ease; font-family: 'DM Sans', sans-serif;
        }
        .mark-read-btn:hover:not(:disabled) { border-color: #4caf82; color: #4caf82; background: rgba(76,175,130,0.08); }
        .mark-read-btn:disabled { opacity: 0.4; }
      `}</style>
    </button>
  );
}