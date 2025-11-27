import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: userError?.message || "Not authenticated" }, { status: 401 });
  }

  await supabase.from("profiles").delete().eq("id", user.id);

  // Delete auth user (requires server privileges)
  // Note: Ensure your supabaseServer client has permissions to use admin API
  const { error: adminErr } = await supabase.auth.admin.deleteUser(user.id);
  if (adminErr) {
    return NextResponse.json({ error: adminErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
