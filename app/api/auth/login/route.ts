import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Demo credentials for testing without Supabase configured
const DEMO_EMAIL = "admin@st.elizabethgirls.ac.ke";
const DEMO_PASSWORD = "admin123";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Demo mode: allow login with demo credentials when Supabase isn't configured
  if (!supabase) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return NextResponse.json({
        data: {
          user: {
            id: "demo-user",
            email: DEMO_EMAIL,
            role: "super_admin",
          },
          demo: true,
        },
      });
    }
    return NextResponse.json(
      { error: "Demo mode: use admin@st.elizabethgirls.ac.ke / admin123" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ data });
}
