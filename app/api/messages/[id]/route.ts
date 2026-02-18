import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = req.headers.get("x-admin-token") === process.env.ADMIN_API_TOKEN;
  if (!isAdmin) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient(true);

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}