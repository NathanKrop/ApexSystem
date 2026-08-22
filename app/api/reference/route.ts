import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const [classrooms, streams, voteHeads, paymentTypes, bankAccounts, houses] =
    await Promise.all([
      supabase.from("classrooms").select("*").order("sort_order"),
      supabase.from("streams").select("*, classrooms(name)").order("name"),
      supabase.from("vote_heads").select("*").order("code"),
      supabase.from("payment_types").select("*").order("name"),
      supabase.from("bank_accounts").select("*").order("bank"),
      supabase.from("houses").select("*").order("name"),
    ]);

  const errors = [classrooms, streams, voteHeads, paymentTypes, bankAccounts, houses]
    .map((r) => r.error)
    .filter(Boolean);

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0]!.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      classrooms: classrooms.data,
      streams: streams.data,
      vote_heads: voteHeads.data,
      payment_types: paymentTypes.data,
      bank_accounts: bankAccounts.data,
      houses: houses.data,
    },
  });
}