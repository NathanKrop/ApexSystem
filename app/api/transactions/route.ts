import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toWords } from "number-to-words";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("student_id");
  const term = searchParams.get("term");
  const academicYear = searchParams.get("academic_year");
  const voided = searchParams.get("voided");

  let query = supabase
    .from("transactions")
    .select("*, students(full_name, adm_no), vote_heads(name), payment_types(name), bank_accounts(bank)");

  if (studentId) query = query.eq("student_id", studentId);
  if (term) query = query.eq("term", term);
  if (academicYear) query = query.eq("academic_year", Number(academicYear));
  if (voided !== null) query = query.eq("voided", voided === "true");

  const { data, error } = await query.order("transaction_date", { ascending: false });

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
    student_id,
    term,
    academic_year,
    vote_head_id,
    amount,
    payment_type_id,
    bank_account_id,
    ref_no,
    transaction_date,
  } = body;

  // Validate required fields
  if (!student_id || !term || !academic_year || !vote_head_id || !amount || !payment_type_id) {
    return NextResponse.json(
      { error: "student_id, term, academic_year, vote_head_id, amount, and payment_type_id are required" },
      { status: 400 }
    );
  }

  if (amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than zero" },
      { status: 400 }
    );
  }

  const { data: user } = await supabase.auth.getUser();
  const staffId = user.user?.id;

  // Generate amount in words server-side
  const amountInWords = `${toWords(Math.floor(amount))} shillings${
    amount % 1 !== 0 ? ` and ${Math.round((amount % 1) * 100)} cents` : ""
  }`;

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      student_id,
      term,
      academic_year,
      vote_head_id,
      amount,
      amount_in_words: amountInWords,
      payment_type_id,
      bank_account_id,
      ref_no,
      transaction_date: transaction_date || new Date().toISOString().split("T")[0],
      recorded_by: staffId,
    })
    .select("*, students(full_name, adm_no), vote_heads(name), payment_types(name)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}