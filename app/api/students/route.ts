import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const classroomId = searchParams.get("classroom_id");
  const status = searchParams.get("status");

  let query = supabase
    .from("students")
    .select("*, classrooms(name), streams(name), houses(name)");

  if (q) {
    query = query.or(`adm_no.ilike.%${q}%,full_name.ilike.%${q}%,upi_no.ilike.%${q}%`);
  }
  if (classroomId) {
    query = query.eq("classroom_id", classroomId);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query.order("adm_no");

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

  const {
    adm_no,
    upi_no,
    full_name,
    gender,
    date_of_birth,
    classroom_id,
    stream_id,
    form_admitted,
    date_admitted,
    is_boarder,
    house_id,
    family_id,
    kcpe_marks,
    kcpe_index_no,
    kcse_index_no,
    guardian_name,
    guardian_phone_primary,
    guardian_phone_secondary,
    county,
    division,
    location,
    sub_location,
    address,
    status,
  } = body;

  // Validate required fields
  if (!adm_no || !full_name || !gender) {
    return NextResponse.json(
      { error: "adm_no, full_name, and gender are required" },
      { status: 400 }
    );
  }

  // Check for duplicate adm_no
  const { data: existing } = await supabase
    .from("students")
    .select("id")
    .eq("adm_no", adm_no)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: `Admission number ${adm_no} already exists` },
      { status: 409 }
    );
  }

  const { data: user } = await supabase.auth.getUser();
  const staffId = user.user?.id;

  const { data, error } = await supabase
    .from("students")
    .insert({
      adm_no,
      upi_no,
      full_name,
      gender,
      date_of_birth,
      classroom_id,
      stream_id,
      form_admitted,
      date_admitted,
      is_boarder,
      house_id,
      family_id,
      kcpe_marks,
      kcpe_index_no,
      kcse_index_no,
      guardian_name,
      guardian_phone_primary,
      guardian_phone_secondary,
      county,
      division,
      location,
      sub_location,
      address,
      status: status || "active",
      created_by: staffId,
      updated_by: staffId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}