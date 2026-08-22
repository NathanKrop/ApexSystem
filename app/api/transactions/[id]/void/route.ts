import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = await request.json();
  const { void_reason } = body;

  if (!void_reason) {
    return NextResponse.json(
      { error: "void_reason is required" },
      { status: 400 }
    );
  }

  const { data: user } = await supabase.auth.getUser();
  const staffId = user.user?.id;

  // Void, never delete — append-only enforcement
  const { data, error } = await supabase
    .from("transactions")
    .update({
      voided: true,
      void_reason,
      voided_by: staffId,
      voided_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("voided", false) // Prevent double-voiding
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}