import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "./lib/admin/authorization";
import { isSupabaseConfigured } from "./lib/supabase/env";
import { updateSupabaseSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = await updateSupabaseSession(request);

  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") {
    return response;
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=not-configured", request.url));
  }

  const { createServerClient } = await import("@supabase/ssr");
  const { getSupabaseEnv } = await import("./lib/supabase/env");
  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => undefined,
    },
  });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isAdminUser(supabase, user.id))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
