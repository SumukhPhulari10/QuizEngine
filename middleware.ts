import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function middleware(req: NextRequest) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // Protect dashboard and all subpages
  if (!user && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // pages to protect
};
