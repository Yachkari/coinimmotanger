import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/login");

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'DM Sans', sans-serif;
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          min-height: 100vh;
          background: #0f0f0f;
        }
        @media (max-width: 768px) {
          .admin-main { margin-left: 0; padding: 1rem; }
        }
      `}</style>
    </div>
  );
}