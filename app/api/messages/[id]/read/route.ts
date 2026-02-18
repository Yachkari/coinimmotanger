import { NextRequest, NextResponse } from "next/server";
import { markMessageAsRead } from "@/lib/supabase/queries";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = req.headers.get("x-admin-token") === process.env.ADMIN_API_TOKEN;
  if (!isAdmin) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const result = await markMessageAsRead(id);

  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true });
}