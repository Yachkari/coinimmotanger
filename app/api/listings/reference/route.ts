import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { reference_code, geo_code } = await req.json();

  if (!reference_code || !geo_code) {
    return NextResponse.json({ error: "Missing code or geo" }, { status: 400 });
  }

  const supabase = await createClient();

  // Count existing listings with this exact prefix+geo combination
  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("reference_code", reference_code)
    .eq("geo_code", geo_code);

  const next = (count ?? 0) + 1;
  const reference = `${reference_code}-${geo_code}-${next}`;

  return NextResponse.json({ reference });
}