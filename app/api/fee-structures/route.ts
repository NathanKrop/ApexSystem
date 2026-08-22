import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const classroomId = searchParams.get("classroom_id");
  const term = searchParams.get("term");
  const academicYear = searchParams.get("academic_year");
  const status = searchParams.get("status");

  let query = supabase
    .from("fee_structures")
    .select("*, classrooms(name), fee_structure_items(*, vote_heads(name, code))");

  if (classroomId) query = query.eq("classroom_id", classroomId);
  if (term) query = query.eq("term", term);
  if (academicYear) query = query.eq("academic_year", Number(academicYear));
  if (status) query = query.eq("status", status);

  const { data, error } = await query.order("academic_year", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = await request.json();

  const { classroom_id, term, academic_year, status, items } = body;

  // Validate required fields
  if (!classroom_id || !term || !academic_year) {
    return NextResponse.json(
      { error: "classroom_id, term, and academic_year are required" },
      { status: 400 }
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "At least one fee structure item is required" },
      { status: 400 }
    );
  }

  // Check for existing fee structure for this classroom/term/year
  const { data: existing } = await supabase
    .from("fee_structures")
    .select("id")
    .eq("classroom_id", classroom_id)
    .eq("term", term)
    .eq("academic_year", academic_year)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: `A fee structure already exists for this classroom, term, and year` },
      { status: 409 }
    );
  }

  // Insert fee structure and its items in a transaction
  const { data: feeStructure, error: fsError } = await supabase
    .from("fee_structures")
    .insert({
      classroom_id,
      term,
      academic_year,
      status: status || "draft",
    })
    .select()
    .single();

  if (fsError) {
    return NextResponse.json({ error: fsError.message }, { status: 500 });
  }

  const itemsToInsert = items.map((item: { vote_head_id: string; amount: number }) => ({
    fee_structure_id: feeStructure.id,
    vote_head_id: item.vote_head_id,
    amount: item.amount,
  }));

  const { data: insertedItems, error: itemsError } = await supabase
    .from("fee_structure_items")
    .insert(itemsToInsert)
    .select();

  if (itemsError) {
    // Rollback: delete the fee structure if items fail
    await supabase.from("fee_structures").delete().eq("id", feeStructure.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json(
    { data: { ...feeStructure, fee_structure_items: insertedItems } },
    { status: 201 }
  );
}