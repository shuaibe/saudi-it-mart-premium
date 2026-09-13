import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "./env";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie writes from Server Components are handled by proxy/server actions.
        }
      },
    },
  });

}
export function getSupabaseAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { Authorization: `Bearer ${serviceRoleKey}` },
    },
  });
}
