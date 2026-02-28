import { getFeaturedListings, getListings } from "@/lib/supabase/queries";
import HomeContent from "@/components/home/HomeContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRes, statsRes] = await Promise.all([
    getFeaturedListings(6),
    getListings({ limit: 1, orderBy: "date_desc" }),
  ]);

  return (
    <HomeContent
      featured={featuredRes.data ?? []}
      total={statsRes.data?.total ?? 0}
    />
  );
}