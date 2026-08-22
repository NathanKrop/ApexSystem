import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const classroomId = searchParams.get("classroom_id");
  const status = searchParams.get("status");
  const minBalance = searchParams.get("min_balance");

  let query = supabase
    .from("student_balances")
    .select("*, classrooms(name)");

  if (classroomId) query = query.eq("classroom_id", classroomId);
  if (status) query = query.eq("status", status);
  if (minBalance) query = query.gte("balance", Number(minBalance));

  const { data, error } = await query.order("balance", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}